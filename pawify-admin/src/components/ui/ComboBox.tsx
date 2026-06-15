import { useEffect, useRef, useState } from 'react'

interface ComboBoxProps {
  name: string
  value: string
  onChange: (value: string) => void
  options?: string[]
  placeholder?: string
  className?: string
}

export const ComboBox =({
  name,
  value,
  onChange,
  options,
  placeholder,
  className
}: ComboBoxProps) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(value)
  const containerRef = useRef<HTMLDivElement>(null)

  const filtered = options?.filter((opt) => opt.toLowerCase().includes(value.toLowerCase()))

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setOpen(true)
    if (!options || options.some((opt) => opt.toLowerCase().includes(e.target.value.toLowerCase()))) {
      onChange(e.target.value)
    }
  }

  const handleSelect = (option: string) => {
    setQuery(option)
    onChange(option)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <label className='px-2 text-tiny text-white/60'>{name}</label>
      <input
        type='text'
        value={query}
        onChange={handleInputChange}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className='w-full bg-primary-accent text-white rounded-lg p-2 text-sm outline-none'
      />
      {open && filtered && filtered.length > 0 && (
        <ul className='absolute z-50 w-full mt-1 bg-secondary border border-primary-border rounded-lg overflow-hidden shadow-lg max-h-48 overflow-y-auto'>
          {filtered.map((option) => (
            <li
              key={option}
              onMouseDown={() => handleSelect(option)}
              className='px-3 py-2 text-white text-sm cursor-pointer hover:bg-white/10'
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}