/**
 * Logo/Símbolo em bloco: flor de laranjeira com vapor (vetores do Figma) girada 22,92°,
 * num bloco 40×40 com degradê lilás. Medidas e cores são únicas deste componente no Figma.
 */
export function LogoSymbol() {
  return (
    <div
      aria-hidden="true"
      className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-surface/70"
      style={{ backgroundImage: 'linear-gradient(135deg, #efe9f7 14.286%, #d8c8ee 85.714%)' }}
    >
      <div className="relative h-[29.76px] w-[19.84px] rotate-[22.92deg]">
        <div className="absolute inset-[37.5%_6.25%_4.17%_6.25%]">
          <img src="/brand/simbolo/flor.svg" alt="" className="block size-full max-w-none" />
        </div>
        <div className="absolute inset-[-2.08%_9.38%_52.08%_53.12%]">
          <img src="/brand/simbolo/vapor.svg" alt="" className="block size-full max-w-none" />
        </div>
      </div>
    </div>
  )
}
