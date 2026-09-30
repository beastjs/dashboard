import { expect, test } from 'bun:test'
import { listRoutes, removeNavRoute, removePagesExport, removeRouterRoute } from './codegen'

test('lists and removes a lazy page route', () => {
  const router = `const rootRoute = createRootRoute({ component: App })
const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: lazyRouteComponent(() => import('./pages/Home.btsx')) })
const deckRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/deck-builder',
  component: lazyRouteComponent(() => import('./pages/DeckBuilder.btsx'))
})
const routeTree = rootRoute.addChildren([homeRoute, deckRoute])
`
  const routes = listRoutes(router)
  expect(routes).toEqual([
    { path: '/', routeVar: 'homeRoute', component: 'Home' },
    { path: '/deck-builder', routeVar: 'deckRoute', component: 'DeckBuilder' }
  ])
  const updated = removeRouterRoute(router, routes[1])
  expect(updated).toContain('rootRoute.addChildren([homeRoute])')
  expect(updated).not.toContain('deckRoute')
  expect(updated).not.toContain('DeckBuilder.btsx')
})

test('removes a nav item and its group when empty', () => {
  const navs = `export const navGroups: NavGroup[] = [
  {
    title: 'Workspace',
    items: [
      { href: '/', label: 'Home' },
      { href: '/deck-builder', label: 'Deck Builder' }
    ]
  },
  {
    title: 'Tools',
    items: [
      { href: '/only', label: 'Only' }
    ]
  }
]
`
  const withoutDeck = removeNavRoute(navs, '/deck-builder')
  expect(withoutDeck).toContain("{ href: '/', label: 'Home' }")
  expect(withoutDeck).not.toContain('/deck-builder')
  expect(withoutDeck).not.toContain("'Home' },")
  const withoutTools = removeNavRoute(withoutDeck, '/only')
  expect(withoutTools).not.toContain("title: 'Tools'")
  expect(withoutTools).toContain("title: 'Workspace'")
})

test('removes the first item without changing the remaining nav entries', () => {
  const navs = `export const navGroups = [
  {
    title: 'Workspace',
    items: [
      { href: '/', label: 'Home' },
      { href: '/documents', label: 'Documents' },
      { href: '/projects', label: 'Projects' }
    ]
  }
]
`
  const updated = removeNavRoute(navs, '/')
  expect(updated).not.toContain("href: '/'")
  expect(updated).toContain("{ href: '/documents', label: 'Documents' },")
  expect(updated).toContain("{ href: '/projects', label: 'Projects' }")
})

test('removes the page import and export', () => {
  const index = `import Home from './Home.btsx'
import DeckBuilder from './DeckBuilder.btsx'
export { Home, DeckBuilder }
`
  expect(removePagesExport(index, 'DeckBuilder')).toBe(`import Home from './Home.btsx'
export { Home }
`)
})
