'use client'

import { useState } from 'react'
import { CheckCircle2, Upload, User, FileText, ChevronRight, ChevronLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useI18n } from '@/lib/i18n/context'
import { generateReferenceNumber, ComplaintType } from '@/lib/mock-data'

const complaintTypes: { value: ComplaintType; labelKey: string }[] = [
  { value: 'civil', labelKey: 'complaints.types.civil' },
  { value: 'criminal', labelKey: 'complaints.types.criminal' },
  { value: 'family', labelKey: 'complaints.types.family' },
  { value: 'property', labelKey: 'complaints.types.property' },
  { value: 'employment', labelKey: 'complaints.types.employment' },
  { value: 'administrative', labelKey: 'complaints.types.administrative' },
  { value: 'other', labelKey: 'complaints.types.other' },
]

const steps = [
  { id: 1, titleKey: 'complaints.personalInfo', icon: User },
  { id: 2, titleKey: 'complaints.description', icon: FileText },
  { id: 3, titleKey: 'complaints.attachments', icon: Upload },
]

export function ComplaintForm() {
  const { t, locale } = useI18n()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [referenceNumber, setReferenceNumber] = useState('')
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    kebele: '',
    woreda: '',
    zone: '',
    type: '' as ComplaintType | '',
    subject: '',
    description: '',
    files: [] as File[],
  })

  const updateFormData = (field: string, value: string | File[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    const ref = generateReferenceNumber()
    setReferenceNumber(ref)
    setIsSubmitted(true)
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  if (isSubmitted) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardContent className="flex flex-col items-center py-12 text-center">
          <div className="rounded-full bg-success/10 p-4">
            <CheckCircle2 className="size-12 text-success-foreground" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-foreground">
            {t('complaints.submittedSuccess')}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {t('complaints.referenceProvided')}
          </p>
          <div className="mt-4 rounded-lg bg-primary/10 px-6 py-3">
            <p className="text-xl font-mono font-bold text-primary">{referenceNumber}</p>
          </div>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            {t('complaints.keepReference')}
          </p>
          <div className="mt-8 flex gap-4">
            <Button variant="outline" onClick={() => {
              setIsSubmitted(false)
              setCurrentStep(1)
              setFormData({
                fullName: '',
                phone: '',
                email: '',
                kebele: '',
                woreda: '',
                zone: '',
                type: '',
                subject: '',
                description: '',
                files: [],
              })
            }}>
              {locale === 'am' ? 'አዲስ አቤቱታ' : 'New Complaint'}
            </Button>
            <Button asChild>
              <a href="/complaints/track">{t('complaints.track')}</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Progress Steps */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex size-10 items-center justify-center rounded-full border-2 transition-colors ${
                      currentStep >= step.id
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background text-muted-foreground'
                    }`}
                  >
                    <step.icon className="size-5" />
                  </div>
                  <span className={`mt-2 text-sm font-medium ${
                    currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {t(step.titleKey as keyof typeof import('@/lib/i18n/translations/en').default)}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`mx-4 h-0.5 w-16 sm:w-24 md:w-32 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Personal Information */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('complaints.personalInfo')}</CardTitle>
            <CardDescription>
              {locale === 'am' ? 'የግል መረጃዎን ያስገቡ' : 'Enter your personal information'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">{t('complaints.fullName')} *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => updateFormData('fullName', e.target.value)}
                  placeholder={locale === 'am' ? 'ሙሉ ስምዎን ያስገቡ' : 'Enter your full name'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t('complaints.phone')} *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  placeholder="+251 9XX XXX XXX"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">{t('complaints.email')}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                placeholder="email@example.com"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="kebele">{t('complaints.kebele')} *</Label>
                <Input
                  id="kebele"
                  value={formData.kebele}
                  onChange={(e) => updateFormData('kebele', e.target.value)}
                  placeholder={locale === 'am' ? 'ቀበሌ' : 'Kebele'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="woreda">{t('complaints.woreda')} *</Label>
                <Input
                  id="woreda"
                  value={formData.woreda}
                  onChange={(e) => updateFormData('woreda', e.target.value)}
                  placeholder={locale === 'am' ? 'ወረዳ' : 'Woreda'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zone">{t('complaints.zone')} *</Label>
                <Input
                  id="zone"
                  value={formData.zone}
                  onChange={(e) => updateFormData('zone', e.target.value)}
                  placeholder={locale === 'am' ? 'ዞን' : 'Zone'}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Complaint Details */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>{locale === 'am' ? 'የአቤቱታ ዝርዝር' : 'Complaint Details'}</CardTitle>
            <CardDescription>
              {locale === 'am' ? 'አቤቱታዎን በዝርዝር ይግለጹ' : 'Describe your complaint in detail'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">{t('complaints.type')} *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => updateFormData('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={locale === 'am' ? 'የአቤቱታ ዓይነት ይምረጡ' : 'Select complaint type'} />
                </SelectTrigger>
                <SelectContent>
                  {complaintTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {t(type.labelKey as keyof typeof import('@/lib/i18n/translations/en').default)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">{t('complaints.subject')} *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => updateFormData('subject', e.target.value)}
                placeholder={locale === 'am' ? 'የአቤቱታ ርዕስ' : 'Brief subject of complaint'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('complaints.description')} *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder={locale === 'am' ? 'አቤቱታዎን በዝርዝር ይግለጹ...' : 'Describe your complaint in detail...'}
                rows={6}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Attachments */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('complaints.attachments')}</CardTitle>
            <CardDescription>
              {locale === 'am' ? 'ተጨማሪ ሰነዶች ካሉዎት ይጫኑ' : 'Upload any supporting documents'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
              <Upload className="mx-auto size-12 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">
                {t('complaints.uploadFiles')}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t('complaints.maxFileSize')} | {t('complaints.supportedFormats')}
              </p>
              <Button variant="outline" className="mt-4">
                {locale === 'am' ? 'ፋይሎችን ይምረጡ' : 'Choose Files'}
              </Button>
            </div>

            {/* Summary */}
            <div className="rounded-lg bg-muted/50 p-4">
              <h4 className="font-medium text-foreground">
                {locale === 'am' ? 'ማጠቃለያ' : 'Summary'}
              </h4>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('complaints.fullName')}:</span>
                  <span className="font-medium">{formData.fullName || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('complaints.phone')}:</span>
                  <span className="font-medium">{formData.phone || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('complaints.type')}:</span>
                  <span className="font-medium">
                    {formData.type ? t(`complaints.types.${formData.type}` as keyof typeof import('@/lib/i18n/translations/en').default) : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('complaints.subject')}:</span>
                  <span className="font-medium">{formData.subject || '-'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="mr-2 size-4" />
          {t('common.previous')}
        </Button>
        
        {currentStep < 3 ? (
          <Button onClick={nextStep}>
            {t('common.next')}
            <ChevronRight className="ml-2 size-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit}>
            {t('common.submit')}
          </Button>
        )}
      </div>
    </div>
  )
}
