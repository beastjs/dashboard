import { createRootRoute, createRoute, createRouter } from '@octanejs/tanstack-router'
import App from './App.btsx'

const rootRoute = createRootRoute({ component: App })

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/' })
const formRoute = createRoute({ getParentRoute: () => rootRoute, path: '/form' })
const streamingRoute = createRoute({ getParentRoute: () => rootRoute, path: '/streaming' })

const routeTree = rootRoute.addChildren([indexRoute, formRoute, streamingRoute])

export const router = createRouter({ routeTree })

declare module '@octanejs/tanstack-router' {
  interface Register {
    router: typeof router
  }
}
