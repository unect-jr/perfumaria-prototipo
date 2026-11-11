// Tipos de domínio. Estoque, custo médio, totais, lucro e margem são derivados das
// movimentações em lib/calc.ts; nunca ficam armazenados.

export type Produto = {
  id: string
  nome: string
  precoVenda: number
  /** Limite de aviso: estoque ≤ estoqueMinimo é "estoque baixo". */
  estoqueMinimo: number
}

type MovimentacaoBase = {
  id: string
  produtoId: string
  quantidade: number
  valorUnitario: number
  /** Data ISO 8601. */
  data: string
}

export type Compra = MovimentacaoBase & { tipo: 'compra' }

export type Venda = MovimentacaoBase & {
  tipo: 'venda'
  /** Custo médio vigente no momento da venda, para o histórico não mudar depois. */
  custoUnitario: number
}

export type Movimentacao = Compra | Venda

export type TipoMovimentacao = Movimentacao['tipo']
