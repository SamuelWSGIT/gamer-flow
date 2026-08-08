import type { ComponentProps, ReactNode } from 'react'
import { NavLink } from 'react-router'
import styles from './NavItem.module.css'

type NavItemProps = Omit<ComponentProps<typeof NavLink>, 'children'> & {
  children?: ReactNode
  icon: ReactNode
}

function NavItem({ children, icon, to, ...rest }: NavItemProps) {
  return (
    <NavLink className={styles.navItem} to={to} {...rest}>
      {icon}
      {children}
    </NavLink>
  )
}

export default NavItem
