import { createRootRoute, createRoute, createRouter } from '@octanejs/tanstack-router'
import App from './App.btsx'
import { Home, Documents, Projects, Settings } from './pages'

const rootRoute = createRootRoute({ component: App })

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Home })
const formRoute = createRoute({ getParentRoute: () => rootRoute, path: '/documents', component: Documents })
const streamingRoute = createRoute({ getParentRoute: () => rootRoute, path: '/projects', component: Projects })
const settingsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/settings', component: Settings })

const routeTree = rootRoute.addChildren([indexRoute, formRoute, streamingRoute, settingsRoute])

export const router = createRouter({ routeTree })

declare module '@octanejs/tanstack-router' {
  interface Register {
    router: typeof router
  }
}
