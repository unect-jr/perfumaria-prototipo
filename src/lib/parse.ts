export function apenasDigitos(texto: string, maximo = 4): string {
  return texto.replace(/\D/g, '').slice(0, maximo)
}

export function toInt(texto: string): number {
  return texto === '' ? 0 : Number(texto)
}

export function toDateInput(data: Date): string {
  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

export function dateInputToIso(valor: string, agora = new Date()): string {
  if (valor === toDateInput(agora)) return agora.toISOString()
  const [ano, mes, dia] = valor.split('-').map(Number)
  return new Date(ano, mes - 1, dia, 12).toISOString()
}
