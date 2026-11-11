import { useToast } from '../components/ui/toastContext'
import type { Movimentacao, TipoMovimentacao } from '../data/types'
import { getLucroVenda, getPosicoes } from '../lib/calc'
import { cn } from '../lib/cn'
import { formatCurrency, formatUnidades } from '../lib/format'
import { useStore } from './context'
import { useRegistrar } from './registrar'

export type NovaMovimentacao = {
  tipo: TipoMovimentacao
  produtoId: string
  quantidade: number
  valorUnitario: number
  data: string
}

export function useSalvarMovimentacao() {
  const { estado, dispatch } = useStore()
  const toast = useToast()
  const { destacar } = useRegistrar()

  return (nova: NovaMovimentacao): boolean => {
    const produto = estado.produtos.find((p) => p.id === nova.produtoId)
    if (!produto) return false
    const posicoes = getPosicoes(estado.produtos, estado.movimentacoes)
    const posicao = posicoes.get(produto.id) ?? { estoque: 0, custoMedio: 0 }
    const rotulo = nova.tipo === 'venda' ? 'venda' : 'compra'

    if (nova.tipo === 'venda' && nova.quantidade > posicao.estoque) {
      toast.mostrar({
        tom: 'erro',
        titulo: `Não foi possível registrar a ${rotulo}`,
        detalhe: `Estoque insuficiente: ${produto.nome} tem ${formatUnidades(posicao.estoque)} disponíveis.`,
      })
      return false
    }

    const base = { ...nova, id: crypto.randomUUID() }
    const movimentacao: Movimentacao =
      base.tipo === 'venda'
        ? { ...base, tipo: 'venda', custoUnitario: posicao.custoMedio }
        : { ...base, tipo: 'compra' }

    dispatch({ type: 'movimentacao/registrada', movimentacao })
    destacar(movimentacao.id)

    const resumo = `${produto.nome} · ${formatUnidades(movimentacao.quantidade)} · `
    let detalhe
    if (movimentacao.tipo === 'venda') {
      const lucro = getLucroVenda(movimentacao)
      detalhe = (
        <>
          {resumo}lucro de{' '}
          <span className={cn('font-semibold', lucro < 0 ? 'text-danger' : 'text-success')}>
            {formatCurrency(lucro)}
          </span>
        </>
      )
    } else {
      const custoMedio =
        getPosicoes(estado.produtos, [...estado.movimentacoes, movimentacao]).get(produto.id)
          ?.custoMedio ?? movimentacao.valorUnitario
      detalhe = (
        <>
          {resumo}custo médio de{' '}
          <span className="font-semibold text-fg">{formatCurrency(custoMedio)}</span>
        </>
      )
    }

    toast.mostrar({
      tom: 'sucesso',
      titulo: movimentacao.tipo === 'venda' ? 'Venda registrada' : 'Compra registrada',
      detalhe,
      acao: {
        rotulo: 'Desfazer',
        onClick: () => {
          dispatch({ type: 'movimentacao/removida', id: movimentacao.id })
          destacar(null)
        },
      },
    })
    return true
  }
}
