import { useParams } from 'next/navigation'
import type { Locale } from '@configs/i18n'
import {
    formatDate,
    formatDateLong,
    formatDateShort,
    formatDateMonthShort,
    formatTime,
    formatDateTime,
    formatWeekdayShort,
    formatWeekdayLong,
    formatMonth,
    formatMonthLong,
    formatDateToMonthShort,
    isToday,
    getRelativeDateInfo
} from '@/utils/dateFormatter'

/**
 * Hook to provide date formatting functions with the current locale
 * Use this hook in client components to automatically get locale-aware date formatting
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { formatDateLong, formatTime } = useDateFormatter()
 *   
 *   return (
 *     <div>
 *       <p>{formatDateLong(new Date())}</p>
 *       <p>{formatTime(new Date())}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export const useDateFormatter = () => {
    const params = useParams()
    const locale = (params?.lang as Locale) || 'pt'

    return {
        locale,
        formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) =>
            formatDate(date, locale, options),
        formatDateLong: (date: Date | string) =>
            formatDateLong(date, locale),
        formatDateShort: (date: Date | string) =>
            formatDateShort(date, locale),
        formatDateMonthShort: (date: Date | string) =>
            formatDateMonthShort(date, locale),
        formatTime: (date: Date | string) =>
            formatTime(date, locale),
        formatDateTime: (date: Date | string) =>
            formatDateTime(date, locale),
        formatWeekdayShort: (date: Date | string) =>
            formatWeekdayShort(date, locale),
        formatWeekdayLong: (date: Date | string) =>
            formatWeekdayLong(date, locale),
        formatMonth: (date: Date | string) =>
            formatMonth(date, locale),
        formatMonthLong: (date: Date | string) =>
            formatMonthLong(date, locale),
        formatDateToMonthShort: (date: Date | string, toTimeForCurrentDay = true) =>
            formatDateToMonthShort(date, locale, toTimeForCurrentDay),
        isToday,
        getRelativeDateInfo
    }
}
