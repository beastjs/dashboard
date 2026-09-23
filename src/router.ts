import { createRootRoute, createRoute, createRouter } from '@octanejs/tanstack-router'
import App from './App.btsx'
import { Home, Documents, Projects } from './pages'

const rootRoute = createRootRoute({ component: App })

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Home })
const formRoute = createRoute({ getParentRoute: () => rootRoute, path: '/documents', component: Documents })
const streamingRoute = createRoute({ getParentRoute: () => rootRoute, path: '/projects', component: Projects })

const routeTree = rootRoute.addChildren([indexRoute, formRoute, streamingRoute])

export const router = createRouter({ routeTree })

declare module '@octanejs/tanstack-router' {
  interface Register {
    router: typeof router
  }
}
