import type { Movimentacao, Produto } from './types'

// Seed que reproduz os números âncora do Figma (docs/produto.md, seção 6) no mês corrente:
// total investido R$ 14.480,00 · total vendido R$ 10.438,00 (52 un.) · lucro R$ 4.038,00 ·
// em estoque 60 un. (R$ 8.080,00) · estoque baixo: Flor de Laranjeira (3) e Baunilha Suave (2).
// Gráfico "Lucro por mês": 2.150, 2.480, 2.910, 3.120, 3.560 e 4.038.

export const produtosSeed: Produto[] = [
  { id: 'madeira-oriental', nome: 'Madeira Oriental 100ml', familiaOlfativa: 'Oriental', precoVenda: 349, estoqueMinimo: 3 },
  { id: 'ambar-noturno', nome: 'Âmbar Noturno 100ml', familiaOlfativa: 'Amadeirado', precoVenda: 289, estoqueMinimo: 3 },
  { id: 'flor-de-laranjeira', nome: 'Flor de Laranjeira 75ml', familiaOlfativa: 'Floral', precoVenda: 219, estoqueMinimo: 3 },
  { id: 'lavanda-classica', nome: 'Lavanda Clássica 100ml', familiaOlfativa: 'Aromático', precoVenda: 199, estoqueMinimo: 3 },
  { id: 'citrico-fresh', nome: 'Cítrico Fresh 50ml', familiaOlfativa: 'Cítrico', precoVenda: 159, estoqueMinimo: 3 },
  { id: 'baunilha-suave', nome: 'Baunilha Suave 30ml', familiaOlfativa: 'Doce', precoVenda: 99, estoqueMinimo: 3 },
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

// Compras do início do mês corrente: [produto, quantidade]. Com a compra de Lavanda de ontem
// (10 un. a R$ 120,00), somam R$ 14.480,00.
const COMPRAS_INICIO_MES: [string, number][] = [
  ['madeira-oriental', 13],
  ['ambar-noturno', 20],
  ['flor-de-laranjeira', 12],
  ['lavanda-classica', 11],
  ['citrico-fresh', 34],
  ['baunilha-suave', 12],
]

// Vendas do mês corrente até anteontem: [produto, quantidade, fração do período].
// Depois delas vêm as duas "Últimas movimentações" do Figma (ver buildMovimentacoes).
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
  ['citrico-fresh', 3, 0.9],
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

  // Mês corrente: datas entre o dia 1 e hoje, nunca no futuro. Empates de horário (só no
  // começo do mês) mantêm a ordem de inserção, que já é a cronológica.
  const ateAgora = (data: Date) => (data > now ? new Date(now) : data)
  const anteontem = Math.max(1, hoje - 2)
  COMPRAS_INICIO_MES.forEach(([produtoId, quantidade]) =>
    compra(produtoId, quantidade, ateAgora(new Date(ano, mes, 1, 8))),
  )
  VENDAS_MES.forEach(([produtoId, quantidade, fracao], i) => {
    const dia = Math.max(1, Math.ceil(anteontem * fracao))
    venda(produtoId, quantidade, ateAgora(new Date(ano, mes, dia, 9 + (i % 8))))
  })

  // Últimas movimentações do Figma: compra de Lavanda ontem e venda de Cítrico hoje.
  const ontem = ateAgora(new Date(ano, mes, Math.max(1, hoje - 1), 18))
  compra('lavanda-classica', 10, ontem)
  const hojeCedo = new Date(ano, mes, hoje, 10)
  venda('citrico-fresh', 2, ateAgora(hojeCedo > ontem ? hojeCedo : ontem))

  return movimentacoes
}

export const movimentacoesSeed = buildMovimentacoes(new Date())
