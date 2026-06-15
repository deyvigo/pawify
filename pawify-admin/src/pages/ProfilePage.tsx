import { EyeIcon } from "@/components/icons/EyeIcon"
import { NoEyeIcon } from "@/components/icons/NoEyeIcon"
import { Input } from "@/components/ui/Input"
import { useAdmin } from "@/hooks/useAdmin"
import { formatDate } from "@/utils/date"
import { useState, type ChangeEvent } from "react"
import { toast } from "sonner"

interface PasswordShow {
  password: boolean
  newPassword: boolean
  newPasswordConfirm: boolean
}

export const ProfilePage = () => {
  const [password, setPassword] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>('')

  const [showPassword, setShowPassword] = useState<PasswordShow>({
    password: false,
    newPassword: false,
    newPasswordConfirm: false,
  })

  const { adminInfo, updatePasswordMutation } = useAdmin()

  const handleChangePassword = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!password || !newPassword || !newPasswordConfirm) return
    if (newPassword !== newPasswordConfirm) return

    updatePasswordMutation.mutate(
      {
        current_password: password,
        new_password: newPassword,
        confirm_new_password: newPasswordConfirm,
      },
      {
        onSuccess: () => {
          toast.success('Contraseña actualizada exitosamente')
          setPassword('')
          setNewPassword('')
          setNewPasswordConfirm('')
        },
        onError: (error) => {
          toast.error(error?.response?.data.message ?? 'Error al actualizar contraseña')
        },
      }
    )
  }

  return (
    <div className='w-full h-full p-4 flex flex-col gap-4 bg-secondary'>
      <h1 className='text-white text-2xl px-2'>Mi Perfil</h1>
      <div className='max-w-120 bg-primary h-auto rounded-lg border-primary-border border'>
        <table className='w-full text-sm text-white'>
          <colgroup>
            <col className='w-2/5' />
            <col className='w-3/5' />
          </colgroup>
          <tbody className=''>
            <tr className='border-primary-border border-b'>
              <td className='px-6 py-3'>Usuario</td>
              <td className='px-6 py-3'>{ adminInfo?.username }</td>
            </tr>
            <tr className='border-primary-border border-b'>
              <td className='px-6 py-3'>Nombres</td>
              <td className='px-6 py-3'>{ adminInfo?.first_name }</td>
            </tr>
            <tr className='border-primary-border border-b'>
              <td className='px-6 py-3'>Apellidos</td>
              <td className='px-6 py-3'>{ adminInfo?.last_name }</td>
            </tr>
            <tr className='border-primary-border border-b'>
              <td className='px-6 py-3'>Número de DNI</td>
              <td className='px-6 py-3'>{ adminInfo?.dni_number }</td>
            </tr>
            <tr className=''>
              <td className='px-6 py-3'>Fecha de creación</td>
              <td className='px-6 py-3'>{ formatDate(adminInfo?.created_at!) }</td>
            </tr>
          </tbody>
        </table>
      </div>
      <form
        onSubmit={handleChangePassword}
        className='w-120 flex flex-col gap-4 bg-primary border-primary-border border h-auto rounded-lg p-6'
      >
        <Input
          name='Contraseña actual'
          className='relative'
          inputStyle='h-10'
          type={showPassword.password ? 'text' : 'password'}
          value={password}
          placeholder='Ingresa tu contraseña actual'
          onChange={(e) => setPassword(e.target.value)}
        >
          <button
            type='button'
            onClick={() => setShowPassword((prev) => ({ ...prev, password: !prev.password }))}
            className='absolute right-2 flex items-center h-10 bottom-0 text-white/70 hover:text-blue-400/70 transition-colors cursor-pointer'
          >
            { showPassword.password ? <EyeIcon className='w-5 h-5' /> : <NoEyeIcon className='w-5 h-5' /> }
          </button>
        </Input>
        <Input
          name='Nueva contraseña'
          className='relative'
          inputStyle='h-10'
          type={showPassword.newPassword ? 'text' : 'password'}
          value={newPassword}
          placeholder='Ingresa tu nueva contraseña'
          onChange={(e) => setNewPassword(e.target.value)}
        >
          <button
            type='button'
            onClick={() => setShowPassword((prev) => ({ ...prev, newPassword: !prev.newPassword }))}
            className='absolute right-2 flex items-center h-10 bottom-0 text-white/70 hover:text-blue-400/70 transition-colors cursor-pointer'
          >
            { showPassword.newPassword ? <EyeIcon className='w-5 h-5' /> : <NoEyeIcon className='w-5 h-5' /> }
          </button>
        </Input>
        <Input
          name='Confirmar contraseña'
          className='relative'
          inputStyle='h-10'
          type={showPassword.newPasswordConfirm ? 'text' : 'password'}
          value={newPasswordConfirm}
          placeholder='Confirma tu nueva contraseña'
          onChange={(e) => setNewPasswordConfirm(e.target.value)}
        >
          <button
            type='button'
            onClick={() => setShowPassword((prev) => ({ ...prev, newPasswordConfirm: !prev.newPasswordConfirm }))}
            className='absolute right-2 flex items-center h-10 bottom-0 text-white/70 hover:text-blue-400/70 transition-colors cursor-pointer'
          >
            { showPassword.newPasswordConfirm ? <EyeIcon className='w-5 h-5' /> : <NoEyeIcon className='w-5 h-5' /> }
          </button>
        </Input>
        <button
          type='submit'
          className='w-full h-10 text-white bg-linear-to-r from-start to-end p-2 rounded-lg cursor-pointer'>
          Cambiar contraseña
        </button>
      </form>
    </div>
  )
}