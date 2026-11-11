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
const dayMonthNumeric = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' })
const dayMonth = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' })

const DIA_MS = 24 * 60 * 60 * 1000

/** "hoje", "ontem" ou "8 de nov." */
export function formatRelativeDay(dataIso: string, agora = new Date()): string {
  const data = new Date(dataIso)
  const inicio = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const dias = Math.round((inicio(agora) - inicio(data)) / DIA_MS)
  if (dias === 0) return 'hoje'
  if (dias === 1) return 'ontem'
  return dayMonth.format(data)
}

export function formatDayMonth(dataIso: string): string {
  return dayMonthNumeric.format(new Date(dataIso))
}

/** R$ 1.234,56 */
export function formatCurrency(valor: number): string {
  return currency.format(valor)
}

/** +R$ 128,00 (sinal explícito quando positivo) */
export function formatSignedCurrency(valor: number): string {
  return valor > 0 ? `+${formatCurrency(valor)}` : formatCurrency(valor)
}

/** 1.234 (arredondado, sem "-0") */
export function formatNumber(valor: number): string {
  return integer.format(Math.round(valor) || 0)
}

/** 38,7% (recebe fração: 0.387) */
export function formatPercent(fracao: number): string {
  return percent.format(fracao)
}

/** +13,4% (sinal explícito quando positivo) */
export function formatSignedPercent(fracao: number): string {
  return fracao > 0 ? `+${formatPercent(fracao)}` : formatPercent(fracao)
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

export function formatLucroUnitario(valor: number): string {
  return `${formatSignedCurrency(valor)}/un.`
}
