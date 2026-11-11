import { MotionConfig } from 'motion/react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { AppLayout, type RouteHandle } from './layouts/AppLayout'
import { Movimentacoes } from './pages/Movimentacoes'
import { Painel } from './pages/Painel'
import { ProdutoNovo } from './pages/ProdutoNovo'
import { Produtos } from './pages/Produtos'
import { StoreProvider } from './store/StoreProvider'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Painel />, handle: { title: 'Painel' } satisfies RouteHandle },
      { path: 'produtos', element: <Produtos />, handle: { title: 'Produtos' } satisfies RouteHandle },
      { path: 'produtos/novo', element: <ProdutoNovo />, handle: { title: 'Novo produto' } satisfies RouteHandle },
      { path: 'produtos/:id', handle: { title: 'Produto' } satisfies RouteHandle },
      { path: 'movimentacoes', element: <Movimentacoes />, handle: { title: 'Movimentações' } satisfies RouteHandle },
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
