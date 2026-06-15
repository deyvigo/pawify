import dayjs from 'dayjs'
import 'dayjs/locale/es'
dayjs.locale('es')

export const formatDate = (date: string) => {
  const newDate = dayjs(date)
  return newDate.format('DD [de] MMMM [del] YYYY')
}

export const formatDateTime = (date: string) => {
  const newDate = dayjs(date)
  return newDate.format('DD [de] MMMM [del] YYYY [a las] HH:mm')
}

export const formatDateCompact = (date: string) => {
  const newDate = dayjs(date)
  return newDate.format('HH:mm DD/MM/YYYY')
}