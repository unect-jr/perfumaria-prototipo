import { usePainel } from '../store/usePainel'
import { InicioMobile } from './painel/InicioMobile'
import { PainelWeb } from './painel/PainelWeb'

/** Painel (web) e Início (mobile): mesma rota e mesmos dados, apresentações diferentes. */
export function Painel() {
  const dados = usePainel()
  return (
    <>
      <InicioMobile dados={dados} />
      <PainelWeb dados={dados} />
    </>
  )
}
