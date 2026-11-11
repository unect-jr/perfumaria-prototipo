import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { RegistrarContext, type OpcoesRegistro } from '../store/registrar'
import { RegistrarForm } from './RegistrarForm'
import { Modal } from './ui/Modal'

const DESTAQUE_MS = 5000

export function RegistrarProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [aberto, setAberto] = useState(false)
  const [sessao, setSessao] = useState<{ chave: number; opcoes: OpcoesRegistro }>({
    chave: 0,
    opcoes: {},
  })
  const [destaqueId, setDestaqueId] = useState<string | null>(null)

  const abrir = useCallback(
    (opcoes: OpcoesRegistro = {}) => {
      if (!window.matchMedia('(min-width: 48rem)').matches) {
        const params = new URLSearchParams()
        if (opcoes.tipo) params.set('tipo', opcoes.tipo)
        if (opcoes.produtoId) params.set('produto', opcoes.produtoId)
        const busca = params.toString()
        navigate(busca ? `/registrar?${busca}` : '/registrar')
        return
      }
      setSessao((atual) => ({ chave: atual.chave + 1, opcoes }))
      setAberto(true)
    },
    [navigate],
  )

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
      <Modal aberto={aberto} titulo="Registrar movimentação" onFechar={fechar}>
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
