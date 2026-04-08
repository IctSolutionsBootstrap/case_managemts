'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useI18n } from '@/lib/i18n/context'

export function ContactContent() {
  const { t, locale } = useI18n()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: '', email: '', phone: '', message: '' })
    }, 3000)
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: t('contact.address'),
      details: [
        locale === 'am' ? 'ጅጅጋ፣ ፋፋን ዞን' : 'Jijiga, Fafan Zone',
        locale === 'am' ? 'ሶማሌ ክልል፣ ኢትዮጵያ' : 'Somali Region, Ethiopia',
      ],
    },
    {
      icon: Phone,
      title: t('contact.phone'),
      details: ['+251 25 775 XXXX', '+251 25 775 XXXX'],
    },
    {
      icon: Mail,
      title: t('contact.email'),
      details: ['info@moj-jijiga.gov.et', 'support@moj-jijiga.gov.et'],
    },
    {
      icon: Clock,
      title: t('contact.workingHours'),
      details: [
        `${t('contact.weekdays')}: 8:30 AM - 5:30 PM`,
        `${t('contact.saturday')}: 8:30 AM - 12:30 PM`,
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
        <h2 className="text-2xl font-bold text-foreground">{t('contact.title')}</h2>
        <p className="mt-1 text-muted-foreground">
          {locale === 'am' 
            ? 'ለማንኛውም ጥያቄ ወይም እርዳታ ያግኙን' 
            : 'Get in touch with us for any questions or assistance'}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Contact Information */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('contact.office')}</CardTitle>
              <CardDescription>
                {locale === 'am' ? 'የፍትህ ሚኒስቴር ዋና ቢሮ' : 'Ministry of Justice Main Office'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <item.icon className="size-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{item.title}</h4>
                    {item.details.map((detail, i) => (
                      <p key={i} className="text-sm text-muted-foreground">{detail}</p>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Map Placeholder */}
          <Card>
            <CardContent className="p-0">
              <div className="flex h-48 items-center justify-center rounded-lg bg-muted">
                <div className="text-center">
                  <MapPin className="mx-auto size-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {locale === 'am' ? 'ካርታ ይመጣል' : 'Map coming soon'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>{t('contact.sendMessage')}</CardTitle>
            <CardDescription>
              {locale === 'am' 
                ? 'ጥያቄዎን ወይም አስተያየትዎን ይላኩ' 
                : 'Send us your questions or feedback'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="rounded-full bg-success/10 p-4">
                  <CheckCircle className="size-8 text-success-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  {locale === 'am' ? 'መልእክትዎ ተልኳል!' : 'Message Sent!'}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {locale === 'am' 
                    ? 'በቅርቡ እንመልስልዎታለን።' 
                    : 'We will get back to you soon.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('contact.yourName')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('contact.yourEmail')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('contact.yourPhone')}</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{t('contact.message')}</Label>
                  <Textarea
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Send className="mr-2 size-4" />
                  {t('contact.sendMessage')}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
