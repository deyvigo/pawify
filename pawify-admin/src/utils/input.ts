import type { ChangeEvent } from "react"

export const handleNumberInput = (
  e: ChangeEvent<HTMLInputElement>, onChange: (value: number | string) => void, decimals: boolean
) => {
  const value = e.target.value
  if (value === '' || value === '0') {
    onChange(0)
    return
  }
  const onlyDigits = decimals
    ? value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
    : value.replace(/\D/g, '')

  const cleaned = onlyDigits.replace(/^0+(\d)/, '$1')

  if (cleaned !== '') {
    onChange(cleaned)
  }
}