import { motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { EmptyState } from '../components/EmptyState'
import { ProductItem } from '../components/ProductItem'
import { ProductTable } from '../components/ProductTable'
import { Button } from '../components/ui/Button'
import { Chip } from '../components/ui/Chip'
import { SearchInput } from '../components/ui/SearchInput'
import { normalizeBusca } from '../lib/calc'
import { EASE, STAGGER } from '../lib/motion'
import { useCatalogo } from '../store/useCatalogo'

type Filtro = 'todos' | 'baixo'

export function Produtos() {
  const navigate = useNavigate()
  const catalogo = useCatalogo()
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState<Filtro>('todos')

  const totalBaixo = catalogo.filter((item) => item.baixo).length
  const itens = useMemo(() => {
    const termo = normalizeBusca(busca)
    return catalogo.filter(
      (item) =>
        (filtro === 'todos' || item.baixo) &&
        (termo === '' || normalizeBusca(item.produto.nome).includes(termo)),
    )
  }, [catalogo, busca, filtro])

  const novoProduto = () => navigate('/produtos/novo')

  const filtros = (
    <div className="flex gap-2">
      <Chip selected={filtro === 'todos'} onClick={() => setFiltro('todos')}>
        {`Todos (${catalogo.length})`}
      </Chip>
      <Chip selected={filtro === 'baixo'} onClick={() => setFiltro('baixo')}>
        {`Estoque baixo (${totalBaixo})`}
      </Chip>
    </div>
  )

  let vazio = null
  if (catalogo.length === 0) {
    vazio = (
      <EmptyState titulo="Nenhum produto cadastrado">
        <Button icon="plus" onClick={novoProduto}>
          Cadastrar primeiro produto
        </Button>
      </EmptyState>
    )
  } else if (itens.length === 0 && busca.trim() !== '') {
    vazio = (
      <EmptyState titulo={`Nenhum produto encontrado para "${busca.trim()}"`}>
        <Button variant="secundario" onClick={() => setBusca('')}>
          Limpar busca
        </Button>
      </EmptyState>
    )
  } else if (itens.length === 0) {
    vazio = <EmptyState titulo="Nenhum produto com estoque baixo" />
  }

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center bg-page px-5 pt-5 pb-3 md:hidden">
        <h1 className="text-title-lg">Produtos</h1>
        <Button
          variant="secundario"
          icon="plus"
          iconClassName="text-fg-muted"
          className="ml-auto"
          onClick={novoProduto}
        >
          Novo
        </Button>
      </header>

      <div className="flex flex-col gap-3.5 px-5 pt-1 pb-5 md:hidden">
        <SearchInput value={busca} onChange={setBusca} placeholder="Buscar produto" />
        {filtros}
        {vazio ?? (
          <ul className="flex flex-col gap-3.5">
            {itens.map((item, i) => (
              <motion.li
                key={item.produto.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * STAGGER, duration: 0.25, ease: EASE }}
              >
                <ProductItem item={item} />
              </motion.li>
            ))}
          </ul>
        )}
      </div>

      <div className="hidden flex-col gap-6 p-8 md:flex">
        <div className="flex flex-wrap items-center gap-4">
          <SearchInput
            value={busca}
            onChange={setBusca}
            placeholder="Buscar produto"
            className="w-90"
          />
          {filtros}
          <Button icon="plus" className="ml-auto" onClick={novoProduto}>
            Novo produto
          </Button>
        </div>
        {vazio ?? <ProductTable itens={itens} />}
      </div>
    </>
  )
}
