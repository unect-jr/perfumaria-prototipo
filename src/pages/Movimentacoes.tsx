import { motion } from 'motion/react'
import { useSearchParams } from 'react-router'
import { EmptyState } from '../components/EmptyState'
import { MovementItem } from '../components/MovementItem'
import { MovementTable } from '../components/MovementTable'
import { Button } from '../components/ui/Button'
import { Pagination } from '../components/ui/Pagination'
import { EASE, STAGGER } from '../lib/motion'
import { useRegistrar } from '../store/registrar'
import { useHistorico } from '../store/useHistorico'

const POR_PAGINA = 10

export function Movimentacoes() {
  const { abrir, destaqueId } = useRegistrar()
  const historico = useHistorico()
  const [params, setParams] = useSearchParams()

  const totalPaginas = Math.max(1, Math.ceil(historico.length / POR_PAGINA))
  const pagina = Math.min(Math.max(1, Number(params.get('pagina')) || 1), totalPaginas)
  const linhas = historico.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  const mudarPagina = (nova: number) => {
    setParams(nova === 1 ? {} : { pagina: String(nova) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const paginacao = (
    <Pagination
      pagina={pagina}
      porPagina={POR_PAGINA}
      total={historico.length}
      rotulo="movimentações"
      onChange={mudarPagina}
    />
  )

  const registrar = () => abrir()

  const vazio =
    linhas.length === 0 ? (
      <EmptyState titulo="Nenhuma movimentação registrada">
        <Button icon="plus" onClick={registrar}>
          Registrar movimentação
        </Button>
      </EmptyState>
    ) : null

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center bg-page px-5 pt-5 pb-3 md:hidden">
        <h1 className="text-title-lg">Histórico</h1>
      </header>

      <div className="flex flex-col gap-3.5 px-5 pt-1 pb-5 md:hidden">
        {vazio ?? (
          <ul key={pagina} className="flex flex-col gap-3.5">
            {linhas.map(({ movimentacao, produto, total, lucro }, i) => (
              <motion.li
                key={movimentacao.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i, 12) * STAGGER, duration: 0.25, ease: EASE }}
              >
                <MovementItem
                  tipo={movimentacao.tipo}
                  nomeProduto={produto?.nome ?? ''}
                  quantidade={movimentacao.quantidade}
                  data={movimentacao.data}
                  total={total}
                  lucro={lucro}
                />
              </motion.li>
            ))}
          </ul>
        )}
        {paginacao}
      </div>

      <div className="hidden flex-col gap-6 p-8 md:flex">
        <div className="flex items-center gap-3">
          <Button icon="plus" className="ml-auto" onClick={registrar}>
            Registrar movimentação
          </Button>
        </div>
        {vazio ?? <MovementTable key={pagina} linhas={linhas} destaqueId={destaqueId} />}
        {paginacao}
      </div>
    </>
  )
}
