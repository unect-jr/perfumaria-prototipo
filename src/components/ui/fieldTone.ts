export type FieldTone = 'erro' | 'alerta' | 'padrao'

export function getFieldTone(error?: string, warning?: string): FieldTone {
  return error ? 'erro' : warning ? 'alerta' : 'padrao'
}
