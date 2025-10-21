// Config Imports
import { i18n } from '@configs/i18n'
import type { Locale } from '@configs/i18n'

// Util Imports
import { ensurePrefix } from '@/utils/string'

// Check if the url is missing the locale
export const isUrlMissingLocale = (url: string) => {
  return i18n.locales.every(locale => !(url.startsWith(`/${locale}/`) || url === `/${locale}`))
}

// Get the localized url
export const getLocalizedUrl = (url: string, languageCode: string): string => {
  if (!url || !languageCode) throw new Error("URL or Language Code can't be empty")

  return isUrlMissingLocale(url) ? `/${languageCode}${ensurePrefix(url, '/')}` : url
}

/**
 * Type guard para validar se string é um Locale válido
 */
export function isValidLocale(lang: string): lang is Locale {
  return i18n.locales.includes(lang as Locale)
}

/**
 * Parse seguro de string para Locale com fallback
 */
export function parseLocale(lang: string, fallback: Locale = 'pt'): Locale {
  return isValidLocale(lang) ? lang : fallback
}

/**
 * Hook/helper para usar em layouts e pages
 */
export async function getLocaleParams(params: Promise<{ lang: string }>) {
  const resolved = await params
  return {
    lang: parseLocale(resolved.lang),
    rawLang: resolved.lang
  }
}