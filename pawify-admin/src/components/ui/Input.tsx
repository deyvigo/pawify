import type { ChangeEvent, ReactNode } from 'react'

interface InputProps {
  name: string,
  type: string,
  placeholder: string,
  value: string | number,
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  className?: string
  labelStyle?: string
  inputStyle?: string
  children?: ReactNode
}

export const Input = ({
  name,
  type,
  placeholder,
  value,
  onChange,
  className,
  labelStyle,
  inputStyle,
  children
}: InputProps) => {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      <label className={`px-2 text-tiny text-white/60 ${labelStyle}`}>{name}</label>
      <input
        value={value}
        onChange={onChange}
        type={type}
        className={`w-full outline-none p-2 rounded-lg bg-primary-accent text-white text-sm ${inputStyle}`}
        placeholder={placeholder}
      />
      {children}
    </div>
  )
}