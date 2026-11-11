import { MotionConfig } from 'motion/react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { AppLayout, type RouteHandle } from './layouts/AppLayout'
import { Painel } from './pages/Painel'
import { StoreProvider } from './store/StoreProvider'

// Produtos e Movimentações: só o título por enquanto; as telas vêm nos próximos marcos.
const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Painel />, handle: { title: 'Painel' } satisfies RouteHandle },
      { path: 'produtos', handle: { title: 'Produtos' } satisfies RouteHandle },
      { path: 'movimentacoes', handle: { title: 'Movimentações' } satisfies RouteHandle },
    ],
  },
])

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <StoreProvider>
        <RouterProvider router={router} />
      </StoreProvider>
    </MotionConfig>
  )
}
