#!/usr/bin/env bun
/**
 * Interactive codegen: adds a nav item to src/lib/navs.ts and, for internal pages,
 * scaffolds src/pages/<Name>.btsx, exports it, and registers the route in src/router.ts.
 *
 *   bun run gen            # interactive
 *   bun run gen --dry-run  # show the diff without writing
 */
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, relative } from 'node:path'
import { navGroups } from '../../src/lib/navs'
import { icons } from '../../src/lib/icons/icons'
import { apply, isExternal, paths, plan, root, toKebab, toPascal, type FileChange, type GenSpec } from './codegen'
import { CancelError, colors as c, confirm, select, text } from './prompts'

const dryRun = process.argv.includes('--dry-run')
const NEW_GROUP = Symbol('new-group')

const allItems = navGroups.flatMap((g) => g.items)
const routerSrc = readFileSync(paths.router, 'utf8')
const pagesSrc = readFileSync(paths.pagesIndex, 'utf8')
const routePaths = [...routerSrc.matchAll(/path:\s*['"]([^'"]+)['"]/g)].map((m) => m[1])
const pageExports = (/export\s*\{([^}]*)\}/.exec(pagesSrc)?.[1] ?? '').split(',').map((s) => s.trim())

async function main() {
  console.log(
    `\n${c.bold('beast-dashboard')} ${c.dim('· nav + route generator')}${dryRun ? c.yellow(' (dry run)') : ''}\n`
  )

  const kind = await select({
    message: 'What are you adding?',
    choices: [
      { label: 'Page', value: 'page' as const, hint: 'nav item + route + page component' },
      { label: 'External link', value: 'link' as const, hint: 'nav item only' }
    ]
  })

  const label = await text({
    message: 'Label',
    placeholder: kind === 'page' ? 'e.g. Settings' : 'e.g. GitHub',
    validate: (v) => (v ? undefined : 'Label is required')
  })

  const href = await text({
    message: kind === 'page' ? 'Route path' : 'URL',
    initial: kind === 'page' ? `/${toKebab(label)}` : 'https://',
    validate: (v) => {
      if (kind === 'page') {
        if (!v.startsWith('/')) return 'Route path must start with "/"'
        if (!/^\/[a-zA-Z0-9\-_/$.]*$/.test(v)) return 'Use letters, numbers, -, _, / or $params'
        if (routePaths.includes(v)) return `Route "${v}" already exists in router.ts`
      } else if (!isExternal(v) || v === 'https://') return 'Enter a full URL, e.g. https://example.com'
      if (allItems.some((i) => i.href === v)) return `A nav item already points to "${v}"`
    }
  })

  const groupChoice = await select<string | typeof NEW_GROUP>({
    message: 'Nav group',
    choices: [
      ...navGroups.map((g) => ({ label: g.title, value: g.title, hint: `${g.items.length} items` })),
      { label: '+ New group…', value: NEW_GROUP }
    ],
    initial: Math.max(
      0,
      navGroups.findIndex((g) => g.items.some((i) => !isExternal(i.href)) === (kind === 'page'))
    )
  })
  const newGroup = groupChoice === NEW_GROUP
  const group = newGroup
    ? await text({
        message: 'New group title',
        validate: (v) =>
          !v ? 'Title is required' : navGroups.some((g) => g.title === v) ? 'Group already exists' : undefined
      })
    : (groupChoice as string)

  const iconNames = Object.keys(icons)
  const icon = await select({
    message: 'Icon',
    choices: iconNames.map((name) => ({ label: name, value: name })),
    initial: Math.max(0, iconNames.indexOf(kind === 'page' ? 'folder' : 'beast')),
    filterable: true
  })

  const title = await text({ message: 'Title', initial: label })
  const description = await text({ message: 'Description', initial: kind === 'page' ? `My ${label}` : '' })
  const value = await text({ message: 'Value (badge)', initial: kind === 'page' ? '00' : '↗' })
  const tags = (await text({ message: 'Tags (comma separated)', initial: label.toLowerCase() }))
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  let page: GenSpec['page'] = null
  if (kind === 'page') {
    const component = await text({
      message: 'Component name',
      initial: toPascal(label),
      validate: (v) => {
        if (!/^[A-Z][A-Za-z0-9]*$/.test(v)) return 'Use PascalCase, e.g. UserSettings'
        if (pageExports.includes(v)) return `"${v}" is already exported from src/pages`
      }
    })
    let createFile = true
    if (existsSync(paths.page(component))) {
      createFile = !(await confirm({ message: `src/pages/${component}.btsx exists. Reuse it?`, initial: true }))
      if (createFile) throw new Error(`Refusing to overwrite src/pages/${component}.btsx`)
    }
    page = { component, createFile }
  }

  const spec: GenSpec = {
    group,
    newGroup,
    nav: { href, icon, label, title, description, value, tags: tags.length ? tags : [''] },
    page
  }
  const changes = plan(spec)

  console.log()
  printDiff(changes)

  if (dryRun) {
    console.log(c.yellow('Dry run — no files written.\n'))
    return
  }
  if (!(await confirm({ message: `Write ${changes.length} file(s)?` }))) {
    console.log(c.dim('Nothing written.\n'))
    return
  }
  apply(changes)
  console.log()
  for (const ch of changes)
    console.log(`  ${ch.before === null ? c.green('create') : c.cyan('update')} ${relative(root, ch.path)}`)
  console.log(`\n${c.green('Done.')}${page ? ` Visit ${c.bold(href)} in the dev server.` : ''}\n`)
}

function printDiff(changes: FileChange[]) {
  const dir = mkdtempSync(join(tmpdir(), 'beast-gen-'))
  try {
    for (const [i, ch] of changes.entries()) {
      const a = join(dir, `${i}.a`)
      const b = join(dir, `${i}.b`)
      writeFileSync(a, ch.before ?? '')
      writeFileSync(b, ch.after)
      const { stdout } = Bun.spawnSync(['git', 'diff', '--no-index', '--color=always', '--no-prefix', a, b])
      const body = stdout.toString().split('\n').slice(4).join('\n') // drop git's temp-file header
      console.log(`${c.bold(relative(root, ch.path))} ${ch.before === null ? c.green('(new)') : ''}`)
      console.log(body.trimEnd() + '\n')
    }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

main().catch((err) => {
  if (err instanceof CancelError) process.exit(130)
  console.error(`\n${c.red('✖')} ${err instanceof Error ? err.message : err}\n`)
  process.exit(1)
})
