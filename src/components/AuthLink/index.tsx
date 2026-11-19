import type { ComponentProps, ReactNode } from 'react'
import { LogIn } from 'lucide-react'
import { NavLink } from 'react-router'
import styles from './AuthLink.module.css'

type AuthLinkProps = Omit<ComponentProps<typeof NavLink>, 'children' | 'to'> & {
  linkText: string
  to: ComponentProps<typeof NavLink>['to']
  children?: ReactNode
  icon?: ReactNode
}

function AuthLink({
  children,
  linkText,
  icon = <LogIn size={20} />,
  to,
  ...rest
}: AuthLinkProps) {
  return (
    <p className={styles.authLink}>
      {children}
      <NavLink className={styles.link} to={to} {...rest}>
        {linkText}
        {icon}
      </NavLink>
    </p>
  )
}

export default AuthLink
