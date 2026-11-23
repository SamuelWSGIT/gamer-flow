import type { ComponentProps } from 'react'
import { Gamepad2 } from 'lucide-react'
import Text from '../Text'
import styles from './EmptyState.module.css'

type EmptyStateProps = ComponentProps<'div'> & {
  title?: string
  description?: string
}

function EmptyState({
  title = 'Nenhum jogo no arquivo ainda...',
  description = 'Quando houver sessões publicadas, elas aparecem aqui.',
  ...rest
}: EmptyStateProps) {
  return (
    <div className={styles.emptyState} {...rest}>
      <span className={styles.icon}>
        <Gamepad2 size={40} />
      </span>
      <p className={styles.title}>{title}</p>
      <Text>{description}</Text>
    </div>
  )
}

export default EmptyState
