/** Logotipo "perfumaria" (vetor do Figma) com a descrição "CONTROLE FINANCEIRO". */
export function Logo() {
  return (
    <div className="flex flex-col items-center">
      <img src="/brand/logotipo.svg" alt="perfumaria" width={145} height={51} />
      {/* Medidas únicas do logotipo no Figma: Inter Semi Bold 8,5px, +22% de espaçamento */}
      <p className="text-[8.5px] leading-normal font-semibold tracking-[0.27em] text-fg-muted">
        CONTROLE FINANCEIRO
      </p>
    </div>
  )
}
