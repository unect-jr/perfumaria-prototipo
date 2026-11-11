import { Link } from 'react-router'
import { cn } from '../../lib/cn'
import { Icon, type IconName } from './Icon'

const SIZES = {
  md: 'size-9',
  lg: 'size-11',
}

type IconButtonProps = {
  icon: IconName
  label: string
  size?: keyof typeof SIZES
  className?: string
} & ({ to: string; onClick?: never } | { to?: never; onClick: () => void })

export function IconButton({ icon, label, size = 'md', className, to, onClick }: IconButtonProps) {
  const classes = cn(
    'flex shrink-0 cursor-pointer items-center justify-center rounded-md border border-line bg-surface text-fg-muted transition-colors duration-120 ease-out hover:bg-page hover:text-fg active:scale-97',
    SIZES[size],
    className,
  )
  const icone = <Icon name={icon} size={16} />
  if (to !== undefined) {
    return (
      <Link to={to} aria-label={label} title={label} className={classes}>
        {icone}
      </Link>
    )
  }
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className={classes}>
      {icone}
    </button>
  )
}
