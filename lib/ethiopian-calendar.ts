// Ethiopian Calendar Utilities
// Ethiopian calendar is 7-8 years behind Gregorian calendar
// Ethiopian New Year starts on September 11 (or 12 in leap year)

export interface EthiopianDate {
  year: number
  month: number
  day: number
}

export interface GregorianDate {
  year: number
  month: number
  day: number
}

const ethiopianMonths = {
  en: [
    'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit',
    'Megabit', 'Miazia', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagume'
  ],
  am: [
    'መስከረም', 'ጥቅምት', 'ህዳር', 'ታህሳስ', 'ጥር', 'የካቲት',
    'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሃምሌ', 'ነሐሴ', 'ጳጉሜ'
  ]
}

const ethiopianDays = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  am: ['እሁድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሃሙስ', 'አርብ', 'ቅዳሜ']
}

// Check if Ethiopian year is a leap year
function isEthiopianLeapYear(year: number): boolean {
  return (year % 4) === 3
}

// Check if Gregorian year is a leap year
function isGregorianLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
}

// Julian Day Number from Ethiopian date
function ethiopianToJDN(ethDate: EthiopianDate): number {
  const { year, month, day } = ethDate
  const era = Math.floor((year - 1) / 4)
  const yearInEra = (year - 1) % 4
  
  return (
    (era * 1461) +
    (yearInEra * 365) +
    ((month - 1) * 30) +
    day +
    1723856 - 1
  )
}

// Ethiopian date from Julian Day Number
function jdnToEthiopian(jdn: number): EthiopianDate {
  const r = (jdn - 1723856 + 1) % 1461
  const n = (r % 365) + 365 * Math.floor(r / 1460)
  
  const year = 4 * Math.floor((jdn - 1723856 + 1) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460) + 1
  const month = Math.floor(n / 30) + 1
  const day = (n % 30) + 1
  
  return { year, month, day }
}

// Julian Day Number from Gregorian date
function gregorianToJDN(gregDate: GregorianDate): number {
  const { year, month, day } = gregDate
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3
  
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  )
}

// Gregorian date from Julian Day Number
function jdnToGregorian(jdn: number): GregorianDate {
  const a = jdn + 32044
  const b = Math.floor((4 * a + 3) / 146097)
  const c = a - Math.floor((146097 * b) / 4)
  const d = Math.floor((4 * c + 3) / 1461)
  const e = c - Math.floor((1461 * d) / 4)
  const m = Math.floor((5 * e + 2) / 153)
  
  const day = e - Math.floor((153 * m + 2) / 5) + 1
  const month = m + 3 - 12 * Math.floor(m / 10)
  const year = 100 * b + d - 4800 + Math.floor(m / 10)
  
  return { year, month, day }
}

// Convert Gregorian to Ethiopian
export function gregorianToEthiopian(date: Date): EthiopianDate {
  const jdn = gregorianToJDN({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  })
  return jdnToEthiopian(jdn)
}

// Convert Ethiopian to Gregorian
export function ethiopianToGregorian(ethDate: EthiopianDate): Date {
  const jdn = ethiopianToJDN(ethDate)
  const gregDate = jdnToGregorian(jdn)
  return new Date(gregDate.year, gregDate.month - 1, gregDate.day)
}

// Get current Ethiopian date
export function getCurrentEthiopianDate(): EthiopianDate {
  return gregorianToEthiopian(new Date())
}

// Format Ethiopian date
export function formatEthiopianDate(
  ethDate: EthiopianDate,
  locale: 'en' | 'am' = 'am',
  format: 'short' | 'long' | 'full' = 'long'
): string {
  const monthName = ethiopianMonths[locale][ethDate.month - 1]
  
  if (format === 'short') {
    return `${ethDate.day}/${ethDate.month}/${ethDate.year}`
  }
  
  if (format === 'full') {
    const gregDate = ethiopianToGregorian(ethDate)
    const dayOfWeek = ethiopianDays[locale][gregDate.getDay()]
    return `${dayOfWeek}፣ ${monthName} ${ethDate.day}፣ ${ethDate.year}`
  }
  
  return `${monthName} ${ethDate.day}, ${ethDate.year}`
}

// Get month name
export function getEthiopianMonthName(month: number, locale: 'en' | 'am' = 'am'): string {
  return ethiopianMonths[locale][month - 1] || ''
}

// Get all month names
export function getEthiopianMonthNames(locale: 'en' | 'am' = 'am'): string[] {
  return ethiopianMonths[locale]
}

// Get day name
export function getEthiopianDayName(dayOfWeek: number, locale: 'en' | 'am' = 'am'): string {
  return ethiopianDays[locale][dayOfWeek] || ''
}

// Get days in Ethiopian month
export function getDaysInEthiopianMonth(year: number, month: number): number {
  if (month <= 12) {
    return 30
  }
  // Pagume (13th month)
  return isEthiopianLeapYear(year) ? 6 : 5
}

// Format current date for display
export function formatCurrentDate(locale: 'en' | 'am' = 'am'): {
  ethiopian: string
  gregorian: string
} {
  const now = new Date()
  const ethDate = gregorianToEthiopian(now)
  
  const ethiopianFormatted = formatEthiopianDate(ethDate, locale, 'full')
  
  const gregorianOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  const gregorianFormatted = now.toLocaleDateString(locale === 'am' ? 'am-ET' : 'en-US', gregorianOptions)
  
  return {
    ethiopian: ethiopianFormatted,
    gregorian: gregorianFormatted
  }
}
