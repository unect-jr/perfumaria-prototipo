// Cálculos de domínio, puros e sem React. Tudo deriva das movimentações.
import type { Movimentacao, Produto, Venda } from '../data/types'

export type Posicao = { estoque: number; custoMedio: number }

/** Mês de calendário; `mes` vai de 0 (janeiro) a 11. */
export type Mes = { ano: number; mes: number }

export function getMes(data: Date): Mes {
  return { ano: data.getFullYear(), mes: data.getMonth() }
}

/** Os `quantidade` meses terminando em `ate`, do mais antigo ao mais recente. */
export function getMesesAte(ate: Mes, quantidade: number): Mes[] {
  return Array.from({ length: quantidade }, (_, i) =>
    getMes(new Date(ate.ano, ate.mes - (quantidade - 1 - i), 1)),
  )
}

export function isNoMes(dataIso: string, { ano, mes }: Mes): boolean {
  const data = new Date(dataIso)
  return data.getFullYear() === ano && data.getMonth() === mes
}

/** Ordena por data; empates mantêm a ordem original (sort estável). */
export function sortByData(movimentacoes: readonly Movimentacao[]): Movimentacao[] {
  return [...movimentacoes].sort((a, b) => Date.parse(a.data) - Date.parse(b.data))
}

/** Custo médio ponderado após uma compra. Sem estoque, vale o valor da compra. */
export function getNovoCustoMedio(
  estoque: number,
  custoMedio: number,
  quantidade: number,
  valorCompra: number,
): number {
  const total = estoque + quantidade
  if (total <= 0) return valorCompra
  return (estoque * custoMedio + quantidade * valorCompra) / total
}

/** Estoque e custo médio atuais de cada produto, reproduzindo as movimentações em ordem. */
export function getPosicoes(
  produtos: readonly Produto[],
  movimentacoes: readonly Movimentacao[],
): Map<string, Posicao> {
  const posicoes = new Map<string, Posicao>(
    produtos.map((p) => [p.id, { estoque: 0, custoMedio: 0 }]),
  )
  for (const m of sortByData(movimentacoes)) {
    const atual = posicoes.get(m.produtoId)
    if (!atual) continue
    if (m.tipo === 'compra') {
      posicoes.set(m.produtoId, {
        estoque: atual.estoque + m.quantidade,
        custoMedio: getNovoCustoMedio(atual.estoque, atual.custoMedio, m.quantidade, m.valorUnitario),
      })
    } else {
      posicoes.set(m.produtoId, { ...atual, estoque: atual.estoque - m.quantidade })
    }
  }
  return posicoes
}

export function getTotal(m: Movimentacao): number {
  return m.quantidade * m.valorUnitario
}

export function getLucroVenda(v: Venda): number {
  return v.quantidade * (v.valorUnitario - v.custoUnitario)
}

function getVendasDoMes(movimentacoes: readonly Movimentacao[], mes: Mes): Venda[] {
  return movimentacoes.filter((m): m is Venda => m.tipo === 'venda' && isNoMes(m.data, mes))
}

export type ResumoDoMes = {
  totalInvestido: number
  totalVendido: number
  unidadesVendidas: number
  lucro: number
  /** Lucro ÷ total vendido (0 sem vendas). */
  margem: number
}

export function getResumoDoMes(movimentacoes: readonly Movimentacao[], mes: Mes): ResumoDoMes {
  const vendas = getVendasDoMes(movimentacoes, mes)
  const totalInvestido = movimentacoes
    .filter((m) => m.tipo === 'compra' && isNoMes(m.data, mes))
    .reduce((soma, m) => soma + getTotal(m), 0)
  const totalVendido = vendas.reduce((soma, v) => soma + getTotal(v), 0)
  const lucro = vendas.reduce((soma, v) => soma + getLucroVenda(v), 0)
  return {
    totalInvestido,
    totalVendido,
    unidadesVendidas: vendas.reduce((soma, v) => soma + v.quantidade, 0),
    lucro,
    margem: totalVendido > 0 ? lucro / totalVendido : 0,
  }
}

export function getLucroDoMes(movimentacoes: readonly Movimentacao[], mes: Mes): number {
  return getVendasDoMes(movimentacoes, mes).reduce((soma, v) => soma + getLucroVenda(v), 0)
}

/** Variação relativa (0.134 = +13,4%). Sem base positiva para comparar, retorna null. */
export function getVariacao(atual: number, anterior: number): number | null {
  return anterior > 0 ? atual / anterior - 1 : null
}

/** As `quantidade` movimentações mais recentes, da mais nova para a mais antiga. */
export function getUltimas(
  movimentacoes: readonly Movimentacao[],
  quantidade: number,
): Movimentacao[] {
  return sortByData(movimentacoes).reverse().slice(0, quantidade)
}

export type LinhaHistorico = {
  movimentacao: Movimentacao
  produto: Produto | undefined
  total: number
  lucro: number | null
}

export function getHistorico(
  produtos: readonly Produto[],
  movimentacoes: readonly Movimentacao[],
  quantidade = movimentacoes.length,
): LinhaHistorico[] {
  return getUltimas(movimentacoes, quantidade).map((movimentacao) => ({
    movimentacao,
    produto: produtos.find((p) => p.id === movimentacao.produtoId),
    total: getTotal(movimentacao),
    lucro: movimentacao.tipo === 'venda' ? getLucroVenda(movimentacao) : null,
  }))
}

export type ItemRanking = { produto: Produto; unidades: number; total: number; lucro: number }

/** Produtos vendidos no mês, do maior para o menor lucro. */
export function getRankingDoMes(
  produtos: readonly Produto[],
  movimentacoes: readonly Movimentacao[],
  mes: Mes,
): ItemRanking[] {
  const porProduto = new Map<string, ItemRanking>()
  for (const v of getVendasDoMes(movimentacoes, mes)) {
    const produto = produtos.find((p) => p.id === v.produtoId)
    if (!produto) continue
    const item = porProduto.get(produto.id) ?? { produto, unidades: 0, total: 0, lucro: 0 }
    porProduto.set(produto.id, {
      produto,
      unidades: item.unidades + v.quantidade,
      total: item.total + getTotal(v),
      lucro: item.lucro + getLucroVenda(v),
    })
  }
  return [...porProduto.values()].sort((a, b) => b.lucro - a.lucro)
}

/** Unidades em estoque e quanto elas valem pelo custo médio. */
export function getResumoEstoque(posicoes: ReadonlyMap<string, Posicao>): {
  unidades: number
  valor: number
} {
  let unidades = 0
  let valor = 0
  for (const { estoque, custoMedio } of posicoes.values()) {
    unidades += estoque
    valor += estoque * custoMedio
  }
  return { unidades, valor }
}

export function isEstoqueBaixo(produto: Produto, estoque: number): boolean {
  return estoque <= produto.estoqueMinimo
}

export function getEstoqueBaixo(
  produtos: readonly Produto[],
  posicoes: ReadonlyMap<string, Posicao>,
): { produto: Produto; estoque: number }[] {
  return produtos
    .map((produto) => ({ produto, estoque: posicoes.get(produto.id)?.estoque ?? 0 }))
    .filter(({ produto, estoque }) => isEstoqueBaixo(produto, estoque))
}

export type ItemCatalogo = {
  produto: Produto
  estoque: number
  custoMedio: number
  lucroUnitario: number
  margem: number
  baixo: boolean
}

export function getCatalogo(
  produtos: readonly Produto[],
  posicoes: ReadonlyMap<string, Posicao>,
): ItemCatalogo[] {
  return produtos
    .map((produto) => {
      const { estoque, custoMedio } = posicoes.get(produto.id) ?? { estoque: 0, custoMedio: 0 }
      const lucroUnitario = produto.precoVenda - custoMedio
      return {
        produto,
        estoque,
        custoMedio,
        lucroUnitario,
        margem: produto.precoVenda > 0 ? lucroUnitario / produto.precoVenda : 0,
        baixo: isEstoqueBaixo(produto, estoque),
      }
    })
    .sort((a, b) => a.produto.nome.localeCompare(b.produto.nome, 'pt-BR'))
}

export function normalizeBusca(texto: string): string {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()
}

export type ResumoNovoProduto = { lucroUnitario: number; margem: number; investimento: number }

export function getResumoNovoProduto(
  valorCompra: number,
  precoVenda: number,
  quantidade: number,
): ResumoNovoProduto {
  const lucroUnitario = precoVenda - valorCompra
  return {
    lucroUnitario,
    margem: precoVenda > 0 ? lucroUnitario / precoVenda : 0,
    investimento: quantidade * valorCompra,
  }
}

export type ResumoVenda = {
  total: number
  custo: number
  estoqueApos: number
  lucro: number
}

export function getResumoVenda(
  posicao: Posicao,
  quantidade: number,
  valorUnitario: number,
): ResumoVenda {
  const total = quantidade * valorUnitario
  const custo = quantidade * posicao.custoMedio
  return { total, custo, estoqueApos: posicao.estoque - quantidade, lucro: total - custo }
}

export type ResumoCompra = {
  total: number
  estoqueApos: number
  custoMedioAntes: number
  custoMedioDepois: number
  lucroUnitario: number
}

export function getResumoCompra(
  posicao: Posicao,
  quantidade: number,
  valorUnitario: number,
  precoVenda: number,
): ResumoCompra {
  const custoMedioDepois =
    quantidade > 0
      ? getNovoCustoMedio(posicao.estoque, posicao.custoMedio, quantidade, valorUnitario)
      : posicao.custoMedio
  return {
    total: quantidade * valorUnitario,
    estoqueApos: posicao.estoque + quantidade,
    custoMedioAntes: posicao.custoMedio,
    custoMedioDepois,
    lucroUnitario: precoVenda - custoMedioDepois,
  }
}
