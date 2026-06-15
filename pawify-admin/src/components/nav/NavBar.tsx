import { NavLink } from 'react-router-dom'
import { PackageIcon } from '@/components/icons/PackageIcon'
import { ClaimIcon } from '@/components/icons/ClaimIcon'
import { LogOutIcon } from '@/components/icons/LogOutIcon'
import { DeliveryIcon } from '@/components/icons/DeliveryIcon'
import { ProfileIcon } from '@/components/icons/ProfileIcon'
import { GearIcon } from '@/components/icons/GearIcon'
import { useAuthContext } from '@/context/AuthContext'
import { useAuth } from '@/hooks/useAuth'
import { IconSidebar } from '../icons/icon-sidebar'

interface NavBarProps {
  collapsed: boolean
  onToggle: () => void
}

const navItems = [
  {
    name: 'Productos',
    href: '/products',
    icon: <PackageIcon className="w-5 h-5" />,
  },
  {
    name: 'Órdenes',
    href: '/orders',
    icon: <PackageIcon className="w-5 h-5" />,
  },
  {
    name: 'Entregas',
    href: '/deliveries',
    icon: <DeliveryIcon className="w-5 h-5" />,
  },
  {
    name: 'Reclamos',
    href: '/claims',
    icon: <ClaimIcon className="w-5 h-5" />,
  },
  {
    name: 'Compradores',
    href: '/buyers',
    icon: <ProfileIcon className="w-5 h-5" />,
  },
  {
    name: 'Administradores',
    href: '/admins',
    icon: <GearIcon className="w-5 h-5" />,
  },
  {
    name: 'Perfil',
    href: '/profile',
    icon: <ProfileIcon className="w-5 h-5" />,
  },
]

export const NavBar = ({ collapsed, onToggle }: NavBarProps) => {
  const { user } = useAuthContext()
  const { logoutMutation } = useAuth()
  return (
    <div className="w-full h-full bg-primary flex flex-col border-r border-primary-border transition-all duration-300">
      <div
        className={`w-full h-15 px-4 border-b border-primary-border flex items-center overflow-hidden ${collapsed ? 'justify-center' : 'justify-between'}`}
      >
        {collapsed ? (
          <button
            onClick={onToggle}
            className="cursor-pointer p-1 hover:bg-primary-accent rounded-lg transition-colors"
          >
            <IconSidebar className="w-5 h-5 text-white" />
          </button>
        ) : (
          <>
            <span className="text-white text-xl whitespace-nowrap">Pawify Admin</span>
            <button
              onClick={onToggle}
              className="cursor-pointer p-1 hover:bg-primary-accent rounded-lg transition-colors"
            >
              <IconSidebar className="w-5 h-5 text-subtitle" />
            </button>
          </>
        )}
      </div>
      <div className={`flex flex-col flex-1 w-full overflow-hidden ${collapsed ? 'p-2 gap-1' : 'p-4 gap-2'}`}>
        {navItems.map(({ name, href, icon }) => (
          <NavLink
            key={name}
            to={href}
            className={({ isActive }) =>
              `flex items-center p-2 rounded-lg text-sm transition-all duration-200 ${
                collapsed ? 'justify-center' : 'gap-2'
              } ${isActive ? 'bg-active/40 text-active' : 'hover:bg-primary-accent text-white'}`
            }
          >
            {icon}
            <span
              className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${
                collapsed ? 'max-w-0 opacity-0' : 'max-w-40 opacity-100'
              }`}
            >
              {name}
            </span>
          </NavLink>
        ))}
      </div>
      <div className="flex justify-center border-t border-primary-border py-2">
        {collapsed ? (
          <button
            onClick={logoutMutation}
            className="cursor-pointer p-2 hover:bg-primary-accent rounded-lg transition-colors"
          >
            <LogOutIcon className="w-5 h-5 text-white" />
          </button>
        ) : (
          <div className="w-full h-14 px-4 flex items-center justify-between">
            <span className="text-white text-sm truncate">{user?.username}</span>
            <button
              onClick={logoutMutation}
              className="cursor-pointer p-2 hover:bg-primary-accent rounded-lg transition-colors"
            >
              <LogOutIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
