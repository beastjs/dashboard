import { createRootRoute, createRoute, createRouter, lazyRouteComponent } from '@octanejs/tanstack-router'
import App from './App.btsx'

const rootRoute = createRootRoute({
  component: App,
  notFoundComponent: lazyRouteComponent(() => import('./pages/NotFound.btsx')),
})

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: lazyRouteComponent(() => import('./pages/Home.btsx')) })
const streamingRoute = createRoute({ getParentRoute: () => rootRoute, path: '/projects', component: lazyRouteComponent(() => import('./pages/Projects.btsx')) })
const deckBuilderRoute = createRoute({ getParentRoute: () => rootRoute, path: '/deck-builder', component: lazyRouteComponent(() => import('./pages/DeckBuilder.btsx')) })
const highlightsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/highlights', component: lazyRouteComponent(() => import('./pages/Highlights.btsx')) })

const routeTree = rootRoute.addChildren([indexRoute, streamingRoute, deckBuilderRoute, highlightsRoute])

// Preload a route's chunk when its link is hovered or focused.
export const router = createRouter({ routeTree, defaultPreload: 'intent' })

declare module '@octanejs/tanstack-router' {
  interface Register {
    router: typeof router
  }
}
