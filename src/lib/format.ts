import type { Mes } from './calc'

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const integer = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 })
const percent = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})
const monthLong = new Intl.DateTimeFormat('pt-BR', { month: 'long' })
const monthShort = new Intl.DateTimeFormat('pt-BR', { month: 'short' })

/** R$ 1.234,56 */
export function formatCurrency(valor: number): string {
  return currency.format(valor)
}

/** 1.234 (arredondado, sem "-0") */
export function formatNumber(valor: number): string {
  return integer.format(Math.round(valor) || 0)
}

/** 38,7% (recebe fração: 0.387) */
export function formatPercent(fracao: number): string {
  return percent.format(fracao)
}

/** 60 un. */
export function formatUnidades(quantidade: number): string {
  return `${formatNumber(quantidade)} un.`
}

/** "unidade" ou "unidades" conforme a quantidade. */
export function pluralUnidade(quantidade: number): string {
  return Math.abs(quantidade) === 1 ? 'unidade' : 'unidades'
}

function toDate({ ano, mes }: Mes): Date {
  return new Date(ano, mes, 1)
}

/** novembro */
export function formatMonthLong(mes: Mes): string {
  return monthLong.format(toDate(mes))
}

/** Nov */
export function formatMonthShort(mes: Mes): string {
  const texto = monthShort.format(toDate(mes)).replace('.', '')
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}
