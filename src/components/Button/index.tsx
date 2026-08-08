import type { ComponentProps, ReactNode } from 'react'
import { NavLink } from 'react-router'
import styles from './Button.module.css'

type ButtonBaseProps = {
  variant?: 'primary' | 'outline'
  icon?: ReactNode
  children?: ReactNode
}

type ButtonAsButtonProps = ButtonBaseProps &
  Omit<ComponentProps<'button'>, 'className' | 'children'>

type ButtonAsLinkProps = ButtonBaseProps &
  Omit<ComponentProps<typeof NavLink>, 'className' | 'children'>

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps

function Button(props: ButtonProps) {
  if ('to' in props) {
    const { variant = 'primary', icon, children, to, ...rest } = props
    return (
      <NavLink
        className={`${styles.button} ${styles[variant]}`}
        to={to}
        {...rest}
      >
        {children}
        {icon}
      </NavLink>
    )
  }

  const { variant = 'primary', icon, children, type = 'button', ...rest } = props
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
