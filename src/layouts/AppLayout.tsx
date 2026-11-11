import { motion } from 'motion/react'
import { Outlet, useLocation, useMatches } from 'react-router'
import { Sidebar } from '../components/Sidebar'
import { Topbar } from '../components/Topbar'
import { EASE } from '../lib/motion'

/** Título da página, vindo do `handle` da rota. */
export type RouteHandle = { title: string }

function isRouteHandle(handle: unknown): handle is RouteHandle {
  return typeof handle === 'object' && handle !== null && 'title' in handle
}

/** Layout web: sidebar fixa + topbar. O layout mobile (barra inferior) entra depois. */
export function AppLayout() {
  const { pathname } = useLocation()
  const handle = useMatches().findLast((m) => isRouteHandle(m.handle))?.handle
  const title = isRouteHandle(handle) ? handle.title : ''

  return (
    <div className="min-h-dvh">
      <Sidebar />
      <div className="flex min-h-dvh flex-col md:pl-62">
        <Topbar title={title} />
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="flex-1"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  )
}
