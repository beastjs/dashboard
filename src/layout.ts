import { layout as L, type LayoutSpec, type ViewTypes } from '@danfessler/trellis'
import { openDoc } from './components/ws'

// The mount callbacks run only after Trellis has created the client-side workspace.
const samplePaths = ['README.md', 'src/layout.ts', 'src/components/Tr.btsx'] as const

const previewHtml = `<!doctype html>
<html lang="en">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font: 15px system-ui, sans-serif; margin: 0; padding: 24px; color: #17212b; background: #f5f8fc; }
    .card { max-width: 460px; margin: auto; padding: 24px; border: 1px solid #d8e1ed; border-radius: 16px; background: white; box-shadow: 0 12px 40px #20304a12; }
    .eyebrow { color: #5266a6; font-size: 12px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
    h1 { margin: 10px 0; font-size: 26px; }
    p { line-height: 1.55; }
    .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
    .chips span { padding: 6px 10px; border-radius: 999px; background: #eaf0ff; color: #304b95; font-size: 12px; }
  </style>
  <main class="card">
    <div class="eyebrow">Iframe view</div>
    <h1>Preview stays mounted</h1>
    <p>Drag this tab, float its panel, or switch away and back. Trellis keeps the view alive while you rearrange the workspace.</p>
    <div class="chips"><span>Tabbed</span><span>Dockable</span><span>Floating</span></div>
  </main>
</html>`

export const trellisTypes: ViewTypes = {
  files: {
    title: 'Files',
    singleton: true,
    allow: { stage: false },
    mount(element, view) {
      const list = document.createElement('ul')
      list.className = 'trellis-demo-files'
      for (const path of samplePaths) {
        const item = document.createElement('li')
        const button = document.createElement('button')
        button.type = 'button'
        button.textContent = path
        button.addEventListener('click', () => openDoc(view.workspace, path))
        item.append(button)
        list.append(item)
      }
      element.append(list)
      return () => list.remove()
    }
  },
  doc: {
    title: (view) => String(view.params.path),
    placement: 'stage',
    mount(element, view) {
      const textarea = document.createElement('textarea')
      textarea.className = 'trellis-demo-editor'
      textarea.setAttribute('aria-label', `Demo document ${String(view.params.path)}`)
      textarea.value = `// ${String(view.params.path)}\n// Try editing, then move this tab to another panel.\n`
      textarea.addEventListener('input', () => view.setBadge('Edited'))
      element.append(textarea)
      return () => textarea.remove() // Runs when the view closes.
    }
  },
  preview: {
    title: 'Preview',
    iframe: { srcdoc: previewHtml, sandbox: '', title: 'Trellis demo preview' }
  },
  inspector: {
    title: 'Inspector',
    singleton: true,
    placement: 'side',
    mount(element, view) {
      const content = document.createElement('div')
      content.className = 'trellis-demo-inspector'
      element.append(content)

      const render = () => {
        const snapshot = view.workspace.getSnapshot()
        const focused = snapshot.views.find((item) => item.id === snapshot.focusedView)
        content.replaceChildren()
        const heading = document.createElement('strong')
        heading.textContent = 'Workspace state'
        content.append(heading)
        for (const [label, value] of [
          ['Open views', String(snapshot.views.length)],
          ['Hidden panels', String(snapshot.hidden.length)],
          ['Focused view', focused?.title ?? 'None'],
          ['Current frame', snapshot.framed ?? 'Overview']
        ]) {
          const row = document.createElement('div')
          const name = document.createElement('span')
          const detail = document.createElement('span')
          name.textContent = label
          detail.textContent = value
          row.append(name, detail)
          content.append(row)
        }
      }

      render()
      const unsubscribe = view.workspace.subscribe(render)
      return () => {
        unsubscribe()
        content.remove()
      }
    }
  }
}

export const trellisDefaultLayout: LayoutSpec = L.row(
  [
    L.view('files'),
    L.stage(L.panel(
      L.view('doc', { params: { path: 'README.md' } }),
      L.view('preview')
    ))
  ],
  [1, 4]
)
