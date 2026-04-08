'use client'

import { Scale, Stamp, Handshake, FileText, MessageSquare, FolderOpen, ArrowRight, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/lib/i18n/context'
import { services } from '@/lib/mock-data'

const iconMap: Record<string, typeof Scale> = {
  Scale,
  Stamp,
  Handshake,
  FileText,
  MessageSquare,
  FolderOpen,
}

const serviceInfo: Record<string, { titleKey: string; descKey: string }> = {
  legalAid: { titleKey: 'services.legalAid', descKey: 'services.legalAidDesc' },
  notarization: { titleKey: 'services.notarization', descKey: 'services.notarizationDesc' },
  mediation: { titleKey: 'services.mediation', descKey: 'services.mediationDesc' },
  certificates: { titleKey: 'services.certificates', descKey: 'services.certificatesDesc' },
  consultation: { titleKey: 'services.consultation', descKey: 'services.consultationDesc' },
  documentation: { titleKey: 'services.documentation', descKey: 'services.documentationDesc' },
}

export function ServicesContent() {
  const { t, locale } = useI18n()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
        <h2 className="text-2xl font-bold text-foreground">{t('services.available')}</h2>
        <p className="mt-1 text-muted-foreground">
          {locale === 'am' 
            ? 'ለዜጎች የሚሰጡ የህግ አገልግሎቶች' 
            : 'Legal services available for citizens'}
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = iconMap[service.icon] || FileText
          const info = serviceInfo[service.key]
          
          return (
            <Card key={service.id} className="group relative overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="rounded-lg bg-primary/10 p-3 transition-colors group-hover:bg-primary">
                    <Icon className="size-6 text-primary transition-colors group-hover:text-primary-foreground" />
                  </div>
                  <Badge variant="outline" className="bg-success/10 text-success-foreground border-success/20">
                    {locale === 'am' ? 'ይገኛል' : 'Available'}
                  </Badge>
                </div>
                <CardTitle className="mt-4">
                  {t(info.titleKey as keyof typeof import('@/lib/i18n/translations/en').default)}
                </CardTitle>
                <CardDescription>
                  {t(info.descKey as keyof typeof import('@/lib/i18n/translations/en').default)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {service.requirements && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      {locale === 'am' ? 'ያስፈልጋሉ:' : 'Requirements:'}
                    </p>
                    <ul className="space-y-1.5">
                      {service.requirements.map((req, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="size-4 text-primary" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <Button className="mt-4 w-full group-hover:bg-primary" variant="outline">
                  {locale === 'am' ? 'ተጨማሪ ዝርዝር' : 'Learn More'}
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
              
              {/* Decorative element */}
              <div className="absolute -right-8 -bottom-8 size-32 rounded-full bg-primary/5 transition-all group-hover:bg-primary/10" />
            </Card>
          )
        })}
      </div>

      {/* Info Section */}
      <Card>
        <CardHeader>
          <CardTitle>{locale === 'am' ? 'እንዴት ማግኘት ይቻላል?' : 'How to Access Services?'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                1
              </div>
              <h4 className="mt-3 font-medium">{locale === 'am' ? 'ቀጠሮ ይያዙ' : 'Book Appointment'}</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                {locale === 'am' 
                  ? 'በስልክ ወይም በአካል ቀጠሮ ይያዙ' 
                  : 'Schedule an appointment by phone or in person'}
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                2
              </div>
              <h4 className="mt-3 font-medium">{locale === 'am' ? 'ሰነዶች ያዘጋጁ' : 'Prepare Documents'}</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                {locale === 'am' 
                  ? 'የሚያስፈልጉ ሰነዶችን ያዘጋጁ' 
                  : 'Gather all required documents'}
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                3
              </div>
              <h4 className="mt-3 font-medium">{locale === 'am' ? 'ቢሮ ይምጡ' : 'Visit Office'}</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                {locale === 'am' 
                  ? 'በተቀጠሩበት ሰዓት ቢሮ ይምጡ' 
                  : 'Come to the office at your scheduled time'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
