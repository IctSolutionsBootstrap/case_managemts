'use client'

import { useState } from 'react'
import { Search, Calendar, MapPin, User, FileText, Clock, XCircle, Scale } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/lib/i18n/context'
import { findCaseByNumber, CaseInfo } from '@/lib/mock-data'
import { gregorianToEthiopian, formatEthiopianDate } from '@/lib/ethiopian-calendar'

export function CaseTracker() {
  const { t, locale } = useI18n()
  const [caseNumber, setCaseNumber] = useState('')
  const [caseInfo, setCaseInfo] = useState<CaseInfo | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = () => {
    setIsSearching(true)
    setNotFound(false)
    
    setTimeout(() => {
      const found = findCaseByNumber(caseNumber)
      if (found) {
        setCaseInfo(found)
        setNotFound(false)
      } else {
        setCaseInfo(null)
        setNotFound(true)
      }
      setIsSearching(false)
    }, 500)
  }

  const formatDate = (date: Date) => {
    if (locale === 'am') {
      const ethDate = gregorianToEthiopian(date)
      return formatEthiopianDate(ethDate, 'am', 'long')
    }
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Search Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('caseTracking.title')}</CardTitle>
          <CardDescription>{t('caseTracking.enterCaseNumber')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="CIV-2018-0234"
                value={caseNumber}
                onChange={(e) => setCaseNumber(e.target.value)}
                className="pl-10"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={!caseNumber || isSearching}>
              {isSearching ? (locale === 'am' ? 'በመፈለግ ላይ...' : 'Searching...') : t('caseTracking.search')}
            </Button>
          </div>

          {/* Sample case numbers */}
          <div className="mt-4">
            <p className="text-xs text-muted-foreground">
              {locale === 'am' ? 'ለሙከራ የሚሆኑ የጉዳይ ቁጥሮች:' : 'Sample case numbers for testing:'}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {['CIV-2018-0234', 'FAM-2018-0089'].map((ref) => (
                <button
                  key={ref}
                  onClick={() => setCaseNumber(ref)}
                  className="rounded bg-muted px-2 py-1 text-xs font-mono text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  {ref}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Not Found */}
      {notFound && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex flex-col items-center py-8 text-center">
            <XCircle className="size-12 text-destructive" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              {t('caseTracking.notFound')}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {locale === 'am' 
                ? 'እባክዎ የጉዳይ ቁጥሩን ያረጋግጡ እና እንደገና ይሞክሩ።' 
                : 'Please verify the case number and try again.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Case Details */}
      {caseInfo && (
        <>
          {/* Main Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="size-5 text-primary" />
                    {caseInfo.caseNumber}
                  </CardTitle>
                  <CardDescription className="mt-1">{caseInfo.title}</CardDescription>
                </div>
                <Badge variant="default" className="bg-primary">
                  {caseInfo.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                  <FileText className="size-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">{locale === 'am' ? 'የጉዳይ ዓይነት' : 'Case Type'}</p>
                    <p className="font-medium">{caseInfo.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                  <Calendar className="size-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">{locale === 'am' ? 'የቀረበበት ቀን' : 'Filed Date'}</p>
                    <p className="font-medium">{formatDate(caseInfo.filedDate)}</p>
                  </div>
                </div>
                {caseInfo.judge && (
                  <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                    <User className="size-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t('caseTracking.judge')}</p>
                      <p className="font-medium">{caseInfo.judge}</p>
                    </div>
                  </div>
                )}
                {caseInfo.courtRoom && (
                  <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                    <MapPin className="size-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t('caseTracking.courtRoom')}</p>
                      <p className="font-medium">{caseInfo.courtRoom}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Parties */}
              <div className="mt-6">
                <h4 className="font-medium text-foreground">{t('caseTracking.parties')}</h4>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-sm text-muted-foreground">{locale === 'am' ? 'ከሳሽ' : 'Plaintiff'}</p>
                    <p className="mt-1 font-medium">{caseInfo.parties.plaintiff}</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-sm text-muted-foreground">{locale === 'am' ? 'ተከሳሽ' : 'Defendant'}</p>
                    <p className="mt-1 font-medium">{caseInfo.parties.defendant}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Hearing */}
          {caseInfo.nextHearing && (
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="flex items-center gap-4 py-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Clock className="size-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('caseTracking.nextHearing')}</p>
                  <p className="text-lg font-semibold text-foreground">{formatDate(caseInfo.nextHearing)}</p>
                  {caseInfo.courtRoom && (
                    <p className="text-sm text-muted-foreground">{caseInfo.courtRoom}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>{t('caseTracking.timeline')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-6 pl-8">
                <div className="absolute left-3 top-2 h-[calc(100%-1rem)] w-0.5 bg-border" />
                
                {caseInfo.timeline.map((event, index) => {
                  const isLast = index === caseInfo.timeline.length - 1
                  
                  return (
                    <div key={index} className="relative">
                      <div className={`absolute -left-5 flex size-6 items-center justify-center rounded-full ${
                        isLast ? 'bg-primary' : 'bg-muted'
                      }`}>
                        <div className={`size-2 rounded-full ${isLast ? 'bg-primary-foreground' : 'bg-muted-foreground'}`} />
                      </div>
                      
                      <div className="rounded-lg border border-border p-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-foreground">{event.event}</h4>
                          <span className="text-sm text-muted-foreground">{formatDate(event.date)}</span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
