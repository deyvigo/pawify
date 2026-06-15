import { EyeIcon } from '@/components/icons/EyeIcon'
import { NoEyeIcon } from '@/components/icons/NoEyeIcon'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'
import { useState, type ChangeEvent } from 'react'

export const LoginPage = () => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const { loginMutation } = useAuth()
  
  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!username || !password) return
    loginMutation.mutate({ username, password })
  }

  return (
    <div className='w-dvw h-dvh flex items-center justify-center bg-linear-[135deg] from-start via-primary to-secondary'>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4 items-center justify-center h-auto w-100 min-w-100 bg-primary rounded-xl py-6 px-10 transition-all duration-300'
      >
        <div className='flex flex-col items-center'>
          <h1 className='text-3xl text-white'>Pawify Admin</h1>
          <p className='text-xs text-subtitle'>Inicia sesión para continuar</p>
        </div>

        <Input
          name='Usuario'
          type='text'
          placeholder='Ingresa tu usuario'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          inputStyle='h-10'
        />

        <Input
          name='Contraseña'
          type={showPassword ? 'text' : 'password'}
          placeholder='Ingresa tu contraseña'
          value={password}
          className='relative'
          inputStyle='h-10'
          onChange={(e) => setPassword(e.target.value)}
        >
          <button
            type='button'
            onClick={() => setShowPassword(prev => !prev)}
            className='absolute right-2 flex items-center h-10 bottom-0 text-white/70 hover:text-blue-400/70 transition-colors cursor-pointer'
          >
            { showPassword ? <EyeIcon className='w-5 h-5' /> : <NoEyeIcon className='w-5 h-5' /> }
          </button>
        </Input>

        <div
          className={`
            flex w-full h-10 rounded-lg bg-error/40 text-sm text-white items-center justify-center transition-all duration-300 ease-in-out overflow-hidden
            ${loginMutation.isError
              ? 'max-h-10 opacity-100 scale-100'
              : 'max-h-0 opacity-0 scale-95'
            }
          `}>
            <div className='w-full h-full truncate flex items-center justify-center'>
              { loginMutation?.error?.response?.data.message }
            </div>
        </div>

        <button
          type='submit'
          className='w-full h-10 text-white bg-linear-to-r from-start to-end p-2 rounded-lg cursor-pointer'
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  )
}