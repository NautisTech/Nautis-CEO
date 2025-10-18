export const i18n = {
  defaultLocale: 'pt',
  locales: ['en', 'pt', 'de', 'es', 'fr', 'it', 'mn'],
  langDirection: {
    en: 'ltr',
    pt: 'ltr',
    de: 'ltr',
    es: 'ltr',
    fr: 'ltr',
    it: 'ltr',
    mn: 'ltr'
  }
} as const

export type Locale = (typeof i18n)['locales'][number]
