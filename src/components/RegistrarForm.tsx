import { useId, useState, type FormEvent } from 'react'
import type { TipoMovimentacao } from '../data/types'
import { getResumoCompra, getResumoVenda } from '../lib/calc'
import { formatCurrency, formatNumber, formatUnidades } from '../lib/format'
import { apenasDigitos, dateInputToIso, toDateInput, toInt } from '../lib/parse'
import { useCatalogo } from '../store/useCatalogo'
import { useSalvarMovimentacao } from '../store/useSalvarMovimentacao'
import { MovimentacaoResumo } from './MovimentacaoResumo'
import { Button } from './ui/Button'
import { CurrencyField } from './ui/CurrencyField'
import { Icon } from './ui/Icon'
import { Segmented } from './ui/Segmented'
import { SelectField } from './ui/SelectField'
import { TextField } from './ui/TextField'

type Campo = 'produto' | 'quantidade' | 'valor' | 'data'

const ORDEM_CAMPOS: Campo[] = ['produto', 'quantidade', 'valor', 'data']

const TIPOS = [
  { valor: 'compra', rotulo: 'Compra' },
  { valor: 'venda', rotulo: 'Venda' },
] as const

type RegistrarFormProps = {
  tipoInicial?: TipoMovimentacao
  produtoIdInicial?: string
  onCancelar: () => void
  onSalvo: () => void
}

function arredondar(valor: number): number {
  return Math.round(valor * 100) / 100
}

export function RegistrarForm({
  tipoInicial = 'venda',
  produtoIdInicial = '',
  onCancelar,
  onSalvo,
}: RegistrarFormProps) {
  const catalogo = useCatalogo()
  const salvarMovimentacao = useSalvarMovimentacao()
  const formId = useId()

  const valorSugerido = (t: TipoMovimentacao, id: string): number | null => {
    const item = catalogo.find((c) => c.produto.id === id)
    if (!item) return null
    const valor = t === 'venda' ? item.produto.precoVenda : arredondar(item.custoMedio)
    return valor > 0 ? valor : null
  }

  const [tipo, setTipo] = useState<TipoMovimentacao>(tipoInicial)
  const [produtoId, setProdutoId] = useState(produtoIdInicial)
  const [quantidade, setQuantidade] = useState('1')
  const [valor, setValor] = useState<number | null>(() => valorSugerido(tipoInicial, produtoIdInicial))
  const [data, setData] = useState(() => toDateInput(new Date()))
  const [tocados, setTocados] = useState<ReadonlySet<Campo>>(new Set())
  const [tentouSalvar, setTentouSalvar] = useState(false)

  const hoje = toDateInput(new Date())
  const item = catalogo.find((c) => c.produto.id === produtoId)
  const posicao = { estoque: item?.estoque ?? 0, custoMedio: item?.custoMedio ?? 0 }
  const qtd = toInt(quantidade)
  const venda = tipo === 'venda'

  const estoqueInsuficiente = venda && item !== undefined && qtd > posicao.estoque

  const erros: Partial<Record<Campo, string>> = {}
  if (!item) erros.produto = 'Selecione um produto.'
  if (qtd < 1) erros.quantidade = 'Informe ao menos 1 unidade.'
  else if (estoqueInsuficiente)
    erros.quantidade =
      posicao.estoque === 0
        ? 'Estoque insuficiente: o produto está sem estoque.'
        : `Estoque insuficiente: só há ${formatUnidades(posicao.estoque)} disponíveis.`
  if (!valor) erros.valor = venda ? 'Informe o valor de venda.' : 'Informe o valor de compra.'
  if (data === '') erros.data = 'Informe a data.'
  else if (data > hoje) erros.data = 'A data não pode ser no futuro.'

  const erroVisivel = (campo: Campo) =>
    campo === 'quantidade' && estoqueInsuficiente
      ? erros.quantidade
      : tentouSalvar || tocados.has(campo)
        ? erros[campo]
        : undefined

  const tocar = (campo: Campo) => () => setTocados((atual) => new Set(atual).add(campo))
  const campoId = (campo: Campo) => `${formId}-${campo}`

  let avisoQuantidade: string | undefined
  if (venda && item && qtd > 0 && qtd === posicao.estoque)
    avisoQuantidade = 'Esta venda zera o estoque do produto.'

  let avisoValor: string | undefined
  if (item && valor) {
    if (venda && valor < posicao.custoMedio)
      avisoValor = `Abaixo do custo médio (${formatCurrency(posicao.custoMedio)}).`
    if (!venda && valor > item.produto.precoVenda)
      avisoValor = `Acima do valor de venda (${formatCurrency(item.produto.precoVenda)}).`
  }

  const ajudaProduto = item
    ? venda
      ? `${formatNumber(posicao.estoque)} em estoque`
      : `${formatNumber(posicao.estoque)} em estoque · custo médio de ${formatCurrency(posicao.custoMedio)}`
    : undefined

  const mudarTipo = (novo: TipoMovimentacao) => {
    if (novo === tipo) return
    setTipo(novo)
    setValor(valorSugerido(novo, produtoId))
    setTentouSalvar(false)
  }

  const mudarProduto = (id: string) => {
    setProdutoId(id)
    setValor(valorSugerido(tipo, id))
  }

  const salvar = (e: FormEvent) => {
    e.preventDefault()
    setTentouSalvar(true)
    const primeiroInvalido = ORDEM_CAMPOS.find((campo) => erros[campo])
    if (primeiroInvalido) {
      document.getElementById(campoId(primeiroInvalido))?.focus()
      return
    }
    if (!item || !valor) return
    const salvo = salvarMovimentacao({
      tipo,
      produtoId: item.produto.id,
      quantidade: qtd,
      valorUnitario: valor,
      data: dateInputToIso(data),
    })
    if (salvo) onSalvo()
  }

  return (
    <form noValidate onSubmit={salvar} className="flex flex-col gap-5">
      <Segmented label="Tipo de movimentação" opcoes={TIPOS} valor={tipo} onChange={mudarTipo} />

      <SelectField
        id={campoId('produto')}
        label="Produto"
        placeholder="Selecione um produto"
        value={produtoId}
        opcoes={catalogo.map((c) => ({ valor: c.produto.id, rotulo: c.produto.nome }))}
        onChange={(e) => mudarProduto(e.target.value)}
        onBlur={tocar('produto')}
        help={ajudaProduto}
        error={erroVisivel('produto')}
        data-autofocus={produtoIdInicial === '' ? '' : undefined}
      />

      <div className="flex items-start gap-4">
        <TextField
          id={campoId('quantidade')}
          label="Quantidade"
          placeholder="Ex.: 2"
          inputMode="numeric"
          autoComplete="off"
          value={quantidade}
          onChange={(e) => setQuantidade(apenasDigitos(e.target.value))}
          onBlur={tocar('quantidade')}
          error={erroVisivel('quantidade')}
          warning={avisoQuantidade}
          className="min-w-0 flex-1"
          data-autofocus={produtoIdInicial === '' ? undefined : ''}
        />
        <CurrencyField
          id={campoId('valor')}
          label={venda ? 'Valor de venda (un.)' : 'Valor de compra (un.)'}
          placeholder="R$ 0,00"
          value={valor}
          onChange={setValor}
          onBlur={tocar('valor')}
          error={erroVisivel('valor')}
          warning={avisoValor}
          className="min-w-0 flex-1"
        />
      </div>

      <TextField
        id={campoId('data')}
        label="Data"
        type="date"
        max={hoje}
        value={data}
        onChange={(e) => setData(e.target.value)}
        onBlur={tocar('data')}
        error={erroVisivel('data')}
        inputClassName="[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:size-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
        icon={<Icon name="calendario" size={16} className="pointer-events-none text-fg-muted" />}
      />

      {venda ? (
        <MovimentacaoResumo
          tipo="venda"
          quantidade={qtd}
          resumo={getResumoVenda(posicao, qtd, valor ?? 0)}
        />
      ) : (
        <MovimentacaoResumo
          tipo="compra"
          resumo={getResumoCompra(posicao, qtd, valor ?? 0, item?.produto.precoVenda ?? 0)}
        />
      )}

      <div className="flex justify-end gap-3">
        <Button variant="secundario" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button type="submit" icon="check" disabled={estoqueInsuficiente}>
          {venda ? 'Salvar venda' : 'Salvar compra'}
        </Button>
      </div>
    </form>
  )
}
