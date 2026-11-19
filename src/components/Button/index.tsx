import type { ComponentProps, ReactNode } from 'react'
import { NavLink } from 'react-router'
import styles from './Button.module.css'

type ButtonProps =
  | (ComponentProps<'button'> & {
      variant?: 'primary' | 'outline'
      to?: never
      icon?: ReactNode
    })
  | (Omit<ComponentProps<typeof NavLink>, 'children' | 'to'> & {
      variant: 'link'
      to: ComponentProps<typeof NavLink>['to']
      children?: ReactNode
      icon?: ReactNode
    })

function Button(props: ButtonProps) {
  if (props.variant === 'link') {
    const { children, icon, variant, ...rest } = props

    return (
      <NavLink className={`${styles.button} ${styles[variant]}`} {...rest}>
        {children}
        {icon}
      </NavLink>
    )
  }

  const {
    children,
    icon,
    variant = 'primary',
    type = 'button',
    ...rest
  } = props

  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      type={type}
      {...rest}
    >
      {children}
      {icon}
    </button>
  )
}

export default Button
