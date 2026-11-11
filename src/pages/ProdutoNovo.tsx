import { useId, useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { ProdutoResumo } from '../components/ProdutoResumo'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { CurrencyField } from '../components/ui/CurrencyField'
import { IconButton } from '../components/ui/IconButton'
import { TextField } from '../components/ui/TextField'
import type { Compra, Produto } from '../data/types'
import { getResumoNovoProduto, normalizeBusca } from '../lib/calc'
import { pluralUnidade } from '../lib/format'
import { apenasDigitos, toInt } from '../lib/parse'
import { useStore } from '../store/context'

type Campo = 'nome' | 'compra' | 'venda' | 'quantidade' | 'minimo'

const ORDEM_CAMPOS: Campo[] = ['nome', 'compra', 'venda', 'quantidade', 'minimo']

export function ProdutoNovo() {
  const navigate = useNavigate()
  const { estado, dispatch } = useStore()
  const formId = useId()

  const [nome, setNome] = useState('')
  const [familia, setFamilia] = useState('')
  const [valorCompra, setValorCompra] = useState<number | null>(null)
  const [precoVenda, setPrecoVenda] = useState<number | null>(null)
  const [quantidade, setQuantidade] = useState('')
  const [minimo, setMinimo] = useState('3')
  const [tocados, setTocados] = useState<ReadonlySet<Campo>>(new Set())
  const [tentouSalvar, setTentouSalvar] = useState(false)

  const familias = useMemo(
    () =>
      [...new Set(estado.produtos.map((p) => p.familiaOlfativa))].sort((a, b) =>
        a.localeCompare(b, 'pt-BR'),
      ),
    [estado.produtos],
  )

  const erros: Partial<Record<Campo, string>> = {}
  const nomeNormalizado = normalizeBusca(nome)
  if (nomeNormalizado === '') erros.nome = 'Informe o nome do produto.'
  else if (estado.produtos.some((p) => normalizeBusca(p.nome) === nomeNormalizado))
    erros.nome = 'Já existe um produto com esse nome.'
  if (!valorCompra) erros.compra = 'Informe o valor de compra.'
  if (!precoVenda) erros.venda = 'Informe o valor de venda.'
  if (toInt(quantidade) < 1) erros.quantidade = 'Informe ao menos 1 unidade.'
  if (minimo === '') erros.minimo = 'Informe a partir de quantas unidades avisar.'

  const vendaAbaixo = valorCompra !== null && precoVenda !== null && precoVenda < valorCompra

  const erroVisivel = (campo: Campo) =>
    tentouSalvar || tocados.has(campo) ? erros[campo] : undefined

  const tocar = (campo: Campo) => () => setTocados((atual) => new Set(atual).add(campo))

  const campoId = (campo: Campo) => `${formId}-${campo}`

  const resumo = getResumoNovoProduto(valorCompra ?? 0, precoVenda ?? 0, toInt(quantidade))

  const cancelar = () => navigate('/produtos')

  const salvar = (e: FormEvent) => {
    e.preventDefault()
    setTentouSalvar(true)
    const primeiroInvalido = ORDEM_CAMPOS.find((campo) => erros[campo])
    if (primeiroInvalido) {
      document.getElementById(campoId(primeiroInvalido))?.focus()
      return
    }
    if (valorCompra === null || precoVenda === null) return

    const produto: Produto = {
      id: crypto.randomUUID(),
      nome: nome.trim(),
      familiaOlfativa: familia.trim(),
      precoVenda,
      estoqueMinimo: toInt(minimo),
    }
    const compraInicial: Compra = {
      id: crypto.randomUUID(),
      tipo: 'compra',
      produtoId: produto.id,
      quantidade: toInt(quantidade),
      valorUnitario: valorCompra,
      data: new Date().toISOString(),
    }
    dispatch({ type: 'produto/cadastrado', produto, compraInicial })
    navigate('/produtos')
  }

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-page px-5 pt-5 pb-3 md:hidden">
        <IconButton icon="voltar" label="Voltar para produtos" to="/produtos" />
        <h1 className="text-title-lg">Novo produto</h1>
      </header>

      <form
        noValidate
        onSubmit={salvar}
        className="flex flex-col gap-4 px-5 pt-1 pb-5 md:flex-row md:items-start md:gap-6 md:p-8"
      >
        <Card className="flex flex-col gap-5 p-5 md:flex-1 md:self-stretch md:p-7">
          <h2 className="text-heading">Dados do produto</h2>
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <TextField
              id={campoId('nome')}
              label="Nome"
              placeholder="Ex.: Âmbar Noturno 100ml"
              autoComplete="off"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              onBlur={tocar('nome')}
              error={erroVisivel('nome')}
              className="md:flex-1"
            />
            <TextField
              label="Família olfativa"
              placeholder="Ex.: Amadeirado"
              autoComplete="off"
              list={`${formId}-familias`}
              value={familia}
              onChange={(e) => setFamilia(e.target.value)}
              className="md:w-65"
            />
            <datalist id={`${formId}-familias`}>
              {familias.map((f) => (
                <option key={f} value={f} />
              ))}
            </datalist>
          </div>

          <h2 className="pt-2 text-heading">Valores e estoque</h2>
          <div className="grid grid-cols-2 items-start gap-4 md:flex">
            <CurrencyField
              id={campoId('compra')}
              label="Valor de compra (un.)"
              placeholder="R$ 0,00"
              value={valorCompra}
              onChange={setValorCompra}
              onBlur={tocar('compra')}
              error={erroVisivel('compra')}
              className="min-w-0 md:flex-1"
            />
            <CurrencyField
              id={campoId('venda')}
              label="Valor de venda (un.)"
              placeholder="R$ 0,00"
              value={precoVenda}
              onChange={setPrecoVenda}
              onBlur={tocar('venda')}
              error={erroVisivel('venda')}
              warning={vendaAbaixo ? 'Valor de venda abaixo do valor de compra.' : undefined}
              className="min-w-0 md:flex-1"
            />
            <TextField
              id={campoId('quantidade')}
              label="Quantidade inicial"
              placeholder="Ex.: 12"
              inputMode="numeric"
              autoComplete="off"
              value={quantidade}
              onChange={(e) => setQuantidade(apenasDigitos(e.target.value))}
              onBlur={tocar('quantidade')}
              error={erroVisivel('quantidade')}
              className="min-w-0 md:flex-1"
            />
            <TextField
              id={campoId('minimo')}
              label="Alerta de estoque baixo"
              placeholder="Ex.: 3"
              inputMode="numeric"
              autoComplete="off"
              value={minimo}
              suffix={pluralUnidade(toInt(minimo))}
              onChange={(e) => setMinimo(apenasDigitos(e.target.value))}
              onBlur={tocar('minimo')}
              error={erroVisivel('minimo')}
              help="Você recebe um aviso ao chegar nesse número."
              className="min-w-0 md:flex-1"
            />
          </div>
        </Card>

        <ProdutoResumo
          resumo={resumo}
          quantidade={toInt(quantidade)}
          valorCompra={valorCompra ?? 0}
          className="md:w-85 md:shrink-0"
        >
          <Button variant="secundario" className="flex-1" onClick={cancelar}>
            Cancelar
          </Button>
          <Button type="submit" className="flex-1">
            Salvar produto
          </Button>
        </ProdutoResumo>
      </form>
    </>
  )
}
