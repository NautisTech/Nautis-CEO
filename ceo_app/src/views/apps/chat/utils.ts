import { formatDateToMonthShort, isToday } from '@/utils/dateFormatter'
import type { Locale } from '@configs/i18n'

export const formatDateToMonthShortLocalized = (value: Date | string, locale: Locale, toTimeForCurrentDay = true) => {
  return formatDateToMonthShort(value, locale, toTimeForCurrentDay)
}

// Keep the old function for backward compatibility but it should use locale
const formatDateToMonthShortOld = (value: Date | string, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

export { formatDateToMonthShortOld as formatDateToMonthShort }
