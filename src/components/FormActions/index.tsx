import type { ComponentProps } from 'react'
import Button from '../Button'
import styles from './FormActions.module.css'

type FormActionsProps = ComponentProps<'div'> & {
  // em forms com action, o "Salvar" precisa ser type="submit"
  submit?: boolean
  isPending?: boolean
}

function FormActions({
  submit = false,
  isPending = false,
  ...rest
}: FormActionsProps) {
  return (
    <div className={styles.formActions} {...rest}>
      <Button variant="outline" disabled={isPending}>
        Cancelar
      </Button>
      <Button type={submit ? 'submit' : 'button'} disabled={isPending}>
        {isPending ? 'Salvando...' : 'Salvar'}
      </Button>
    </div>
  )
}

export default FormActions
