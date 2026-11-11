import type { Movimentacao, Produto } from './types'

// Seed que reproduz os números âncora do Figma (docs/produto.md, seção 6) no mês corrente:
// total investido R$ 14.480,00 · total vendido R$ 10.438,00 (52 un.) · lucro R$ 4.038,00 ·
// em estoque 60 un. (R$ 8.080,00) · estoque baixo: Flor de Laranjeira (3) e Baunilha Suave (2).
// Gráfico "Lucro por mês": 2.150, 2.480, 2.910, 3.120, 3.560 e 4.038.

export const produtosSeed: Produto[] = [
  { id: 'madeira-oriental', nome: 'Madeira Oriental 100ml', precoVenda: 349, estoqueMinimo: 3 },
  { id: 'ambar-noturno', nome: 'Âmbar Noturno 100ml', precoVenda: 289, estoqueMinimo: 3 },
  { id: 'flor-de-laranjeira', nome: 'Flor de Laranjeira 75ml', precoVenda: 219, estoqueMinimo: 3 },
  { id: 'lavanda-classica', nome: 'Lavanda Clássica 100ml', precoVenda: 199, estoqueMinimo: 3 },
  { id: 'citrico-fresh', nome: 'Cítrico Fresh 50ml', precoVenda: 159, estoqueMinimo: 3 },
  { id: 'baunilha-suave', nome: 'Baunilha Suave 30ml', precoVenda: 99, estoqueMinimo: 3 },
]

// Valor de compra por produto. Como toda compra do seed usa o mesmo valor, o custo médio é constante.
const VALOR_COMPRA: Record<string, number> = {
  'madeira-oriental': 210,
  'ambar-noturno': 180,
  'flor-de-laranjeira': 140,
  'lavanda-classica': 120,
  'citrico-fresh': 95,
  'baunilha-suave': 60,
}

const ORDEM = produtosSeed.map((p) => p.id)

// Unidades vendidas nos 5 meses anteriores (do mais antigo ao mês passado), na ordem de produtosSeed.
// Em cada mês compra-se exatamente o que é vendido, então o estoque começa o mês corrente zerado.
const VENDAS_MESES_ANTERIORES = [
  [5, 4, 3, 5, 3, 5], // lucro 2.150
  [4, 4, 6, 6, 6, 4], // lucro 2.480
  [5, 5, 6, 7, 7, 5], // lucro 2.910
  [7, 7, 5, 6, 5, 5], // lucro 3.120
  [8, 7, 6, 8, 6, 5], // lucro 3.560
]

// Compras do mês corrente: [produto, quantidade, fração do mês até hoje]. Soma R$ 14.480,00.
const COMPRAS_MES: [string, number, number][] = [
  ['madeira-oriental', 13, 0],
  ['ambar-noturno', 20, 0],
  ['flor-de-laranjeira', 12, 0],
  ['lavanda-classica', 11, 0],
  ['citrico-fresh', 34, 0],
  ['baunilha-suave', 12, 0],
  ['lavanda-classica', 10, 0.75], // compra recente de 10 un. a R$ 120,00
]

// Vendas do mês corrente: [produto, quantidade, fração do mês até hoje].
const VENDAS_MES: [string, number, number][] = [
  ['citrico-fresh', 4, 0.2],
  ['flor-de-laranjeira', 4, 0.25],
  ['ambar-noturno', 3, 0.3],
  ['baunilha-suave', 6, 0.35],
  ['madeira-oriental', 2, 0.4],
  ['lavanda-classica', 3, 0.5],
  ['citrico-fresh', 5, 0.55],
  ['flor-de-laranjeira', 5, 0.7],
  ['ambar-noturno', 5, 0.8],
  ['baunilha-suave', 4, 0.85],
  ['citrico-fresh', 5, 0.9],
  ['lavanda-classica', 3, 0.95],
  ['madeira-oriental', 3, 1],
]

function buildMovimentacoes(now: Date): Movimentacao[] {
  const ano = now.getFullYear()
  const mes = now.getMonth()
  const hoje = now.getDate()
  const precoVenda = new Map(produtosSeed.map((p) => [p.id, p.precoVenda]))
  const movimentacoes: Movimentacao[] = []
  let seq = 0

  const compra = (produtoId: string, quantidade: number, data: Date) => {
    movimentacoes.push({
      id: `seed-${++seq}`,
      tipo: 'compra',
      produtoId,
      quantidade,
      valorUnitario: VALOR_COMPRA[produtoId],
      data: data.toISOString(),
    })
  }

  const venda = (produtoId: string, quantidade: number, data: Date) => {
    movimentacoes.push({
      id: `seed-${++seq}`,
      tipo: 'venda',
      produtoId,
      quantidade,
      valorUnitario: precoVenda.get(produtoId) ?? 0,
      custoUnitario: VALOR_COMPRA[produtoId],
      data: data.toISOString(),
    })
  }

  // Meses anteriores: compra no dia 1, vendas nos dias 10 e 20.
  VENDAS_MESES_ANTERIORES.forEach((quantidades, i) => {
    const offset = VENDAS_MESES_ANTERIORES.length - i
    ORDEM.forEach((produtoId, j) => {
      const total = quantidades[j]
      const primeira = Math.ceil(total / 2)
      compra(produtoId, total, new Date(ano, mes - offset, 1, 9))
      venda(produtoId, primeira, new Date(ano, mes - offset, 10, 14))
      if (total > primeira) venda(produtoId, total - primeira, new Date(ano, mes - offset, 20, 16))
    })
  })

  // Mês corrente: datas entre o dia 1 e hoje, nunca no futuro.
  // Empates de horário mantêm a ordem de inserção (compras antes das vendas).
  const noMesCorrente = (fracao: number, hora: number) => {
    const dia = Math.max(1, Math.ceil(hoje * fracao))
    const data = new Date(ano, mes, dia, hora)
    return data > now ? new Date(now) : data
  }
  COMPRAS_MES.forEach(([produtoId, quantidade, fracao]) =>
    compra(produtoId, quantidade, noMesCorrente(fracao, 8)),
  )
  VENDAS_MES.forEach(([produtoId, quantidade, fracao], i) =>
    venda(produtoId, quantidade, noMesCorrente(fracao, 10 + (i % 8))),
  )

  return movimentacoes
}

export const movimentacoesSeed = buildMovimentacoes(new Date())
