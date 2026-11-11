import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { RegistrarContext, type OpcoesRegistro } from '../store/registrar'
import { RegistrarForm } from './RegistrarForm'
import { Modal } from './ui/Modal'

const DESTAQUE_MS = 5000

export function RegistrarProvider({ children }: { children: ReactNode }) {
  const [aberto, setAberto] = useState(false)
  const [sessao, setSessao] = useState<{ chave: number; opcoes: OpcoesRegistro }>({
    chave: 0,
    opcoes: {},
  })
  const [destaqueId, setDestaqueId] = useState<string | null>(null)

  const abrir = useCallback((opcoes: OpcoesRegistro = {}) => {
    setSessao((atual) => ({ chave: atual.chave + 1, opcoes }))
    setAberto(true)
  }, [])

  useEffect(() => {
    if (!destaqueId) return
    const timer = window.setTimeout(() => setDestaqueId(null), DESTAQUE_MS)
    return () => window.clearTimeout(timer)
  }, [destaqueId])

  const value = useMemo(
    () => ({ abrir, destaqueId, destacar: setDestaqueId }),
    [abrir, destaqueId],
  )

  const fechar = () => setAberto(false)

  return (
    <RegistrarContext value={value}>
      {children}
      <Modal aberto={aberto} titulo="Registrar movimentação" tituloMobile="Registrar" onFechar={fechar}>
        <RegistrarForm
          key={sessao.chave}
          tipoInicial={sessao.opcoes.tipo}
          produtoIdInicial={sessao.opcoes.produtoId}
          onCancelar={fechar}
          onSalvo={fechar}
        />
      </Modal>
    </RegistrarContext>
  )
}
