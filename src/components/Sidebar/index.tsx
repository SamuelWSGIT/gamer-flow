import type { ComponentProps } from 'react'
import { CircleUserRound, FileText, LogOut } from 'lucide-react'
import Button from '../Button'
import Logo from '../Logo'
import NavItem from '../NavItem'
import styles from './Sidebar.module.css'

type SidebarProps = ComponentProps<'aside'>

function Sidebar({ ...rest }: SidebarProps) {
  return (
    <aside className={styles.sidebar} {...rest}>
      <Logo />
      <Button variant="link" to="/postagem">
        Publicar
      </Button>
      <nav className={styles.nav}>
        <NavItem to="/" icon={<FileText size={24} />}>
          Feed
        </NavItem>
        <NavItem to="/perfil" icon={<CircleUserRound size={24} />}>
          Perfil
        </NavItem>
        <NavItem to="#" icon={<LogOut size={24} />}>
          Logout
        </NavItem>
      </nav>
    </aside>
  )
}

export default Sidebar
