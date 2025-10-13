export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'pt', 'de', 'es', 'fr', 'it'],
  langDirection: {
    en: 'ltr',
    pt: 'ltr',
    de: 'ltr',
    es: 'ltr',
    fr: 'ltr',
    it: 'ltr'
  }
} as const

export type Locale = (typeof i18n)['locales'][number]
