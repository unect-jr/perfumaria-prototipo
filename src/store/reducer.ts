import type { Compra, Movimentacao, Produto } from '../data/types'

export type EstadoApp = {
  produtos: Produto[]
  movimentacoes: Movimentacao[]
}

export type Acao =
  | { type: 'movimentacao/registrada'; movimentacao: Movimentacao }
  | { type: 'movimentacao/removida'; id: string }
  | { type: 'produto/cadastrado'; produto: Produto; compraInicial: Compra }

export function reducer(estado: EstadoApp, acao: Acao): EstadoApp {
  switch (acao.type) {
    case 'movimentacao/registrada':
      return { ...estado, movimentacoes: [...estado.movimentacoes, acao.movimentacao] }
    case 'movimentacao/removida':
      return {
        ...estado,
        movimentacoes: estado.movimentacoes.filter((m) => m.id !== acao.id),
      }
    case 'produto/cadastrado':
      return {
        produtos: [...estado.produtos, acao.produto],
        movimentacoes: [...estado.movimentacoes, acao.compraInicial],
      }
  }
}
