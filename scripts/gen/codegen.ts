import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

export const root = resolve(import.meta.dir, '../..')
export const paths = {
  navs: join(root, 'src/lib/navs.ts'),
  router: join(root, 'src/router.ts'),
  pagesIndex: join(root, 'src/pages/index.ts'),
  page: (name: string) => join(root, `src/pages/${name}.btsx`)
}

export type NavSpec = {
  href: string
  icon: string
  label: string
  title: string
  description: string
  value: string
  tags: string[]
}

export type GenSpec = {
  group: string
  newGroup: boolean
  nav: NavSpec
  /** null for external links: no page or route is generated */
  page: { component: string; createFile: boolean } | null
}

export type FileChange = { path: string; before: string | null; after: string }

// ── naming helpers ──────────────────────────────────────────────────────────

const words = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1 $2').split(/[^a-zA-Z0-9]+/).filter(Boolean)
export const toPascal = (s: string) => words(s).map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join('')
export const toCamel = (s: string) => {
  const p = toPascal(s)
  return p && p[0].toLowerCase() + p.slice(1)
}
export const toKebab = (s: string) => words(s).map((w) => w.toLowerCase()).join('-')
export const isExternal = (href: string) => /^[a-z][a-z0-9+.-]*:/i.test(href)

// ── source helpers ──────────────────────────────────────────────────────────

const q = (s: string) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Index of the bracket that closes the one at `open`, skipping string literals. */
function matchBracket(src: string, open: number): number {
  const pairs: Record<string, string> = { '[': ']', '{': '}', '(': ')' }
  const stack: string[] = []
  for (let i = open; i < src.length; i++) {
    const ch = src[i]
    if (ch === "'" || ch === '"' || ch === '`') {
      for (i++; i < src.length && src[i] !== ch; i++) if (src[i] === '\\') i++
      continue
    }
    if (pairs[ch]) stack.push(pairs[ch])
    else if (ch === stack[stack.length - 1]) {
      stack.pop()
      if (!stack.length) return i
    }
  }
  throw new Error(`Unbalanced bracket at offset ${open}`)
}

/** Insert `entry` as the last element of the array literal whose `[` is at `open`. */
function appendToArray(src: string, open: number, entry: string, indent: string): string {
  const close = matchBracket(src, open)
  const inner = src.slice(open + 1, close)
  const closingIndent = indent.slice(2)
  if (!inner.trim()) return `${src.slice(0, open + 1)}\n${indent}${entry}\n${closingIndent}${src.slice(close)}`
  const lastEnd = open + 1 + inner.trimEnd().replace(/,$/, '').length
  return `${src.slice(0, lastEnd)},\n${indent}${entry}${src.slice(lastEnd, close).replace(/^,/, '')}${src.slice(close)}`
}

function indentBlock(block: string, indent: string) {
  return block
    .split('\n')
    .map((line, i) => (i === 0 ? line : indent + line))
    .join('\n')
}

// ── generators ──────────────────────────────────────────────────────────────

export function renderNavItem(nav: NavSpec): string {
  return [
    '{',
    `  href: ${q(nav.href)},`,
    `  icon: ${q(nav.icon)},`,
    `  label: ${q(nav.label)},`,
    `  title: ${q(nav.title)},`,
    `  description: ${q(nav.description)},`,
    `  value: ${q(nav.value)},`,
    `  tags: [${nav.tags.map(q).join(', ')}]`,
    '}'
  ].join('\n')
}

export function updateNavs(src: string, spec: GenSpec): string {
  const item = renderNavItem(spec.nav)
  const declaration = src.match(/export const navGroups\s*(?::[^=]+)?=\s*\[/)
  if (!declaration || declaration.index === undefined) throw new Error('Could not find `navGroups` in navs.ts')

  if (spec.newGroup) {
    const group = `{\n  title: ${q(spec.group)},\n  items: [\n    ${indentBlock(item, '    ')}\n  ]\n}`
    return appendToArray(src, declaration.index + declaration[0].length - 1, indentBlock(group, '  '), '  ')
  }

  const re = new RegExp(`title:\\s*(['"])${escapeRe(spec.group)}\\1\\s*,\\s*items:\\s*\\[`)
  const match = re.exec(src)
  if (!match) throw new Error(`Could not find nav group "${spec.group}" in navs.ts`)
  return appendToArray(src, match.index + match[0].length - 1, indentBlock(item, '      '), '      ')
}

export function updateRouter(src: string, component: string, path: string): string {
  const routeVar = `${toCamel(component)}Route`
  if (new RegExp(`\\bconst ${routeVar}\\b`).test(src)) throw new Error(`Route \`${routeVar}\` already exists in router.ts`)

  // 1. import the page component from './pages'
  const pagesImport = /import\s*\{([^}]*)\}\s*from\s*['"]\.\/pages['"]/.exec(src)
  if (!pagesImport) throw new Error("Could not find `import { ... } from './pages'` in router.ts")
  const names = pagesImport[1].split(',').map((s) => s.trim()).filter(Boolean)
  if (!names.includes(component)) names.push(component)
  src = src.replace(pagesImport[0], `import { ${names.join(', ')} } from './pages'`)

  // 2. declare the route after the last createRoute(...)
  const routeLine = `const ${routeVar} = createRoute({ getParentRoute: () => rootRoute, path: ${q(path)}, component: ${component} })`
  const decls = [...src.matchAll(/^const \w+ = createRoute\(/gm)]
  const last = decls[decls.length - 1]
  if (!last || last.index === undefined) throw new Error('Could not find any `createRoute(...)` in router.ts')
  const lastEnd = matchBracket(src, last.index + last[0].length - 1)
  const lineEnd = src.indexOf('\n', lastEnd)
  src = `${src.slice(0, lineEnd)}\n${routeLine}${src.slice(lineEnd)}`

  // 3. register it in the route tree
  const children = /rootRoute\.addChildren\(\s*\[/.exec(src)
  if (!children) throw new Error('Could not find `rootRoute.addChildren([...])` in router.ts')
  const open = children.index + children[0].length - 1
  const close = matchBracket(src, open)
  const list = src.slice(open + 1, close).split(',').map((s) => s.trim()).filter(Boolean)
  list.push(routeVar)
  return `${src.slice(0, open + 1)}${list.join(', ')}${src.slice(close)}`
}

export function updatePagesIndex(src: string, component: string): string {
  const importLine = `import ${component} from './${component}.btsx'`
  if (!src.includes(importLine)) {
    const imports = [...src.matchAll(/^import .*$/gm)]
    const last = imports[imports.length - 1]
    const at = last?.index !== undefined ? last.index + last[0].length : 0
    src = `${src.slice(0, at)}${at ? '\n' : ''}${importLine}${at ? '' : '\n'}${src.slice(at)}`
  }
  const exp = /export\s*\{([^}]*)\}/.exec(src)
  if (!exp) return `${src.trimEnd()}\nexport { ${component} }\n`
  const names = exp[1].split(',').map((s) => s.trim()).filter(Boolean)
  if (!names.includes(component)) names.push(component)
  return src.replace(exp[0], `export { ${names.join(', ')} }`)
}

export function renderPage(href: string): string {
  return `import PageHolder from "@/components/PageHolder.btsx"\n\nprops {}:{}\nPageHolder(href=${JSON.stringify(href)})\n`
}

// ── plan / apply ────────────────────────────────────────────────────────────

const read = (path: string) => (existsSync(path) ? readFileSync(path, 'utf8') : null)

export function plan(spec: GenSpec): FileChange[] {
  const changes: FileChange[] = []
  const edit = (path: string, fn: (src: string) => string) => {
    const before = read(path)
    if (before === null) throw new Error(`Missing file: ${path}`)
    changes.push({ path, before, after: fn(before) })
  }

  edit(paths.navs, (src) => updateNavs(src, spec))

  if (spec.page) {
    const { component, createFile } = spec.page
    if (createFile) {
      const file = paths.page(component)
      if (existsSync(file)) throw new Error(`Page already exists: ${file}`)
      changes.push({ path: file, before: null, after: renderPage(spec.nav.href) })
    }
    edit(paths.pagesIndex, (src) => updatePagesIndex(src, component))
    edit(paths.router, (src) => updateRouter(src, component, spec.nav.href))
  }
  return changes
}

export function apply(changes: FileChange[]) {
  for (const { path, after } of changes) writeFileSync(path, after)
}
