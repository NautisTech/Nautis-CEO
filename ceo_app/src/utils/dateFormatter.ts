import type { Locale } from '@configs/i18n'

/**
 * Get the BCP 47 language tag for date formatting
 * Maps our app locales to proper locale codes for Intl.DateTimeFormat
 */
const getLocaleTag = (locale: Locale): string => {
    const localeMap: Record<Locale, string> = {
        pt: 'pt-PT',
        en: 'en-US',
        de: 'de-DE',
        es: 'es-ES',
        fr: 'fr-FR',
        it: 'it-IT',
        ar: 'ar-SA'
    }

    return localeMap[locale] || 'pt-PT'
}

/**
 * Format a date according to the current locale
 */
export const formatDate = (
    date: Date | string,
    locale: Locale,
    options?: Intl.DateTimeFormatOptions
): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const localeTag = getLocaleTag(locale)

    return new Intl.DateTimeFormat(localeTag, options).format(dateObj)
}

/**
 * Format date with default long format (e.g., "01 de agosto de 2025")
 */
export const formatDateLong = (date: Date | string, locale: Locale): string => {
    return formatDate(date, locale, {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
}

/**
 * Format date with short format (e.g., "01/08/2025")
 */
export const formatDateShort = (date: Date | string, locale: Locale): string => {
    return formatDate(date, locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

/**
 * Format date with month and day (e.g., "01 ago")
 */
export const formatDateMonthShort = (date: Date | string, locale: Locale): string => {
    return formatDate(date, locale, {
        day: 'numeric',
        month: 'short'
    })
}

/**
 * Format time (e.g., "14:30")
 */
export const formatTime = (date: Date | string, locale: Locale): string => {
    return formatDate(date, locale, {
        hour: 'numeric',
        minute: 'numeric'
    })
}

/**
 * Format date and time (e.g., "01/08/2025 14:30")
 */
export const formatDateTime = (date: Date | string, locale: Locale): string => {
    return formatDate(date, locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    })
}

/**
 * Format weekday short (e.g., "seg", "Mon", "Mo")
 */
export const formatWeekdayShort = (date: Date | string, locale: Locale): string => {
    return formatDate(date, locale, {
        weekday: 'short'
    })
}

/**
 * Format weekday long (e.g., "segunda-feira", "Monday", "Montag")
 */
export const formatWeekdayLong = (date: Date | string, locale: Locale): string => {
    return formatDate(date, locale, {
        weekday: 'long'
    })
}

/**
 * Format month short (e.g., "ago", "Aug", "Aug")
 */
export const formatMonth = (date: Date | string, locale: Locale): string => {
    return formatDate(date, locale, {
        month: 'short'
    })
}

/**
 * Format month long (e.g., "agosto", "August", "August")
 */
export const formatMonthLong = (date: Date | string, locale: Locale): string => {
    return formatDate(date, locale, {
        month: 'long'
    })
}

/**
 * Check if a date is today
 */
export const isToday = (date: Date | string): boolean => {
    const today = new Date()
    const dateObj = typeof date === 'string' ? new Date(date) : date

    return (
        dateObj.getDate() === today.getDate() &&
        dateObj.getMonth() === today.getMonth() &&
        dateObj.getFullYear() === today.getFullYear()
    )
}

/**
 * Format date to month short or time if today
 * Used commonly in chat/messaging interfaces
 */
export const formatDateToMonthShort = (
    value: Date | string,
    locale: Locale,
    toTimeForCurrentDay = true
): string => {
    const date = new Date(value)

    if (toTimeForCurrentDay && isToday(date)) {
        return formatTime(date, locale)
    }

    return formatDateMonthShort(date, locale)
}

/**
 * Format relative date for use in localized components
 * This should be used with dictionary translations for "today", "yesterday", etc.
 */
export const getRelativeDateInfo = (date: Date | string) => {
    const now = new Date()
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const diffInMs = now.getTime() - dateObj.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    const diffInWeeks = Math.floor(diffInDays / 7)
    const diffInMonths = Math.round(diffInDays / 30)

    return {
        diffInMinutes,
        diffInHours,
        diffInDays,
        diffInWeeks,
        diffInMonths,
        isToday: diffInDays === 0,
        isYesterday: diffInDays === 1,
        isThisWeek: diffInDays < 7,
        isThisMonth: diffInDays < 30
    }
}

/**
 * Format date to yyyy-MM-dd format for HTML date inputs
 * Converts ISO date strings or Date objects to the format required by <input type="date">
 */
export const formatDateForInput = (date: Date | string | null | undefined): string => {
    if (!date) return ''

    // Convert ISO date or SQL date to YYYY-MM-DD format for input[type="date"]
    const dateObj = new Date(date)

    // Check if date is valid
    if (isNaN(dateObj.getTime())) return ''

    // Use toISOString and split to avoid timezone issues
    return dateObj.toISOString().split('T')[0]
}
