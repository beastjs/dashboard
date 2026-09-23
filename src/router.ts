import { createRootRoute, createRoute, createRouter, lazyRouteComponent } from '@octanejs/tanstack-router'
import App from './App.btsx'

const rootRoute = createRootRoute({ component: App })

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: lazyRouteComponent(() => import('./pages/Home.btsx')) })
const formRoute = createRoute({ getParentRoute: () => rootRoute, path: '/documents', component: lazyRouteComponent(() => import('./pages/Documents.btsx')) })
const streamingRoute = createRoute({ getParentRoute: () => rootRoute, path: '/projects', component: lazyRouteComponent(() => import('./pages/Projects.btsx')) })
const settingsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/settings', component: lazyRouteComponent(() => import('./pages/Settings.btsx')) })

const routeTree = rootRoute.addChildren([indexRoute, formRoute, streamingRoute, settingsRoute])

// Preload a route's chunk when its link is hovered or focused.
export const router = createRouter({ routeTree, defaultPreload: 'intent' })

declare module '@octanejs/tanstack-router' {
  interface Register {
    router: typeof router
  }
}
