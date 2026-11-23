import type { ComponentProps } from 'react'
import { Gamepad2 } from 'lucide-react'
import styles from './ImagePlaceholder.module.css'

type ImagePlaceholderProps = ComponentProps<'div'>

function ImagePlaceholder({ ...rest }: ImagePlaceholderProps) {
  return (
    <div className={styles.imagePlaceholder} {...rest}>
      <Gamepad2 size={80} strokeWidth={1} />
    </div>
  )
}

export default ImagePlaceholder
