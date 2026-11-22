import type { ComponentProps } from 'react'
import Button from '../Button'
import styles from './FormActions.module.css'

type FormActionsProps = ComponentProps<'div'> & {
  isSubmitting?: boolean
  onCancel?: () => void
}

function FormActions({ isSubmitting = false, onCancel, ...rest }: FormActionsProps) {
  return (
    <div className={styles.formActions} {...rest}>
      <Button
        variant="outline"
        type="button"
        disabled={isSubmitting}
        onClick={onCancel}
      >
        Cancelar
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Salvar"}
      </Button>
    </div>
  )
}

export default FormActions
