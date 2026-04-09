'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { Locale, defaultLocale, localeConfigs, LocaleConfig } from './types'
import enTranslations from './translations/en'
import amTranslations from './translations/am'
import soTranslations from './translations/so'

type TranslationKey = keyof typeof enTranslations

const translations: Record<Locale, typeof enTranslations> = {
  en: enTranslations,
  am: amTranslations,
  so: soTranslations,
}

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
  config: LocaleConfig
}

const I18nContext = createContext<I18nContextType | null>(null)

const LOCALE_STORAGE_KEY = 'moj-locale'

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  useEffect(() => {
    const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'am' || savedLocale === 'so')) {
      setLocaleState(savedLocale)
    }
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale)
  }, [])

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[locale][key] || translations['en'][key] || key
    },
    [locale]
  )

  const config = localeConfigs[locale]

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, config }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

export function useTranslation() {
  const { t } = useI18n()
  return t
}
