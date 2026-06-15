import { useState } from 'react'
import { NavBar } from '@/components/nav/NavBar'
import { Outlet } from 'react-router-dom'

export const Layout = () => {
  const [navCollapsed, setNavCollapsed] = useState(false)

  return (
    <div className='w-dvw h-dvh flex items-center justify-center'>
      <div className={`h-full transition-all duration-300 overflow-hidden ${navCollapsed ? 'w-16' : 'w-60'}`}>
        <NavBar collapsed={navCollapsed} onToggle={() => setNavCollapsed((prev) => !prev)} />
      </div>
      <div className='flex-1 h-full overflow-y-scroll'>
        <Outlet />
      </div>
    </div>
  )
}