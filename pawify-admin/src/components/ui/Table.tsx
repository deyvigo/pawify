import type { ReactNode } from 'react'


export const Table = ({ children }: { children: ReactNode }) => {
  return (
    <div className='w-full border-primary-border border rounded-lg bg-primary'>
      <table className='w-full text-sm text-white'>
        { children }
      </table>
    </div>
  )
}