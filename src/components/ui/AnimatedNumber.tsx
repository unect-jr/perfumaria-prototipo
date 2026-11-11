import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { useEffect } from 'react'
import { EASE } from '../../lib/motion'

type AnimatedNumberProps = {
  value: number
  /** Formata o valor intermediário a cada quadro (ex.: formatCurrency). */
  format: (valor: number) => string
  className?: string
}

/** Número que conta até o valor ao entrar e quando o valor muda. */
export function AnimatedNumber({ value, format, className }: AnimatedNumberProps) {
  const reduzir = useReducedMotion()
  const atual = useMotionValue(reduzir ? value : 0)
  const texto = useTransform(atual, format)

  useEffect(() => {
    if (reduzir) {
      atual.set(value)
      return
    }
    const controle = animate(atual, value, { duration: 0.8, ease: EASE })
    return () => controle.stop()
  }, [atual, value, reduzir])

  return <motion.span className={className}>{texto}</motion.span>
}
