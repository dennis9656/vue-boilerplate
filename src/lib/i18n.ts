import { createI18n } from 'vue-i18n'

import commonEn from '@/common/locales/en.json'
import commonKo from '@/common/locales/ko.json'
import sampleEn from '@/features/sample/locales/en.json'
import sampleKo from '@/features/sample/locales/ko.json'

export const LOCALES = ['ko', 'en'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'ko'

/**
 * Messages are merged from per-feature files, not kept in one global bag
 * (rules/web/stack-standards.md §1). A new feature adds `locales/{locale}.json`
 * next to its code and one line here.
 */
export const i18n = createI18n({
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: 'en',
  messages: {
    ko: { ...commonKo, ...sampleKo },
    en: { ...commonEn, ...sampleEn },
  },
  datetimeFormats: {
    ko: { short: { year: 'numeric', month: 'short', day: 'numeric' } },
    en: { short: { year: 'numeric', month: 'short', day: 'numeric' } },
  },
})
