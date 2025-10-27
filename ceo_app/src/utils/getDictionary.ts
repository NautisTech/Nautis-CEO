// Third-party Imports
import 'server-only'

// Type Imports
import type { Locale } from '@configs/i18n'

const dictionaries = {
  en: () => import('@/data/dictionaries/en.json').then(module => module.default),
  pt: () => import('@/data/dictionaries/pt.json').then(module => module.default),
  de: () => import('@/data/dictionaries/de.json').then(module => module.default),
  es: () => import('@/data/dictionaries/es.json').then(module => module.default),
  fr: () => import('@/data/dictionaries/fr.json').then(module => module.default),
  it: () => import('@/data/dictionaries/it.json').then(module => module.default),
  ar: () => import('@/data/dictionaries/ar.json').then(module => module.default),
  // mn: () => import('@/data/dictionaries/mn.json').then(module => module.default),
}

export const getDictionary = async (locale: Locale) => dictionaries[locale]()
