export type Locale = 'en' | 'am'

export type TranslationKey = keyof typeof import('./translations/en').default

export interface LocaleConfig {
  code: Locale
  name: string
  nativeName: string
  direction: 'ltr' | 'rtl'
  dateFormat: string
  calendarType: 'gregorian' | 'ethiopian'
}

export const localeConfigs: Record<Locale, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    dateFormat: 'MM/DD/YYYY',
    calendarType: 'gregorian',
  },
  am: {
    code: 'am',
    name: 'Amharic',
    nativeName: 'አማርኛ',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    calendarType: 'ethiopian',
  },
}

export const defaultLocale: Locale = 'am'
export const supportedLocales: Locale[] = ['en', 'am']
