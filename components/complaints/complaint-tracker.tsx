'use client'

import { useState } from 'react'
import { Search, CheckCircle2, Clock, FileSearch, AlertCircle, XCircle, FileText } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/lib/i18n/context'
import { findComplaintByReference, Complaint, ComplaintStatus, getStatusColor } from '@/lib/mock-data'

const statusIcons: Record<ComplaintStatus, typeof CheckCircle2> = {
  pending: Clock,
  under_review: FileSearch,
  investigating: AlertCircle,
  resolved: CheckCircle2,
  closed: FileText,
  rejected: XCircle,
}

export function ComplaintTracker() {
  const { t, locale } = useI18n()
  const [referenceNumber, setReferenceNumber] = useState('')
  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = () => {
    setIsSearching(true)
    setNotFound(false)
    
    // Simulate API delay
    setTimeout(() => {
      const found = findComplaintByReference(referenceNumber)
      if (found) {
        setComplaint(found)
        setNotFound(false)
      } else {
        setComplaint(null)
        setNotFound(true)
      }
      setIsSearching(false)
    }, 500)
  }

  const getStatusLabel = (status: ComplaintStatus): string => {
    const labels: Record<ComplaintStatus, string> = {
      pending: t('complaints.status.pending'),
      under_review: t('complaints.status.underReview'),
      investigating: t('complaints.status.investigating'),
      resolved: t('complaints.status.resolved'),
      closed: t('complaints.status.closed'),
      rejected: t('complaints.status.rejected'),
    }
    return labels[status]
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Search Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('complaints.track')}</CardTitle>
          <CardDescription>{t('complaints.enterReference')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="MOJ-2018-JJG-00142"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="pl-10"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={!referenceNumber || isSearching}>
              {isSearching ? (locale === 'am' ? 'በመፈለግ ላይ...' : 'Searching...') : t('common.search')}
            </Button>
          </div>

          {/* Sample reference numbers for testing */}
          <div className="mt-4">
            <p className="text-xs text-muted-foreground">
              {locale === 'am' ? 'ለሙከራ የሚሆኑ ማጣቀሻዎች:' : 'Sample references for testing:'}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {['MOJ-2018-JJG-00142', 'MOJ-2018-JJG-00138', 'MOJ-2018-JJG-00135'].map((ref) => (
                <button
                  key={ref}
                  onClick={() => setReferenceNumber(ref)}
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
              {locale === 'am' ? 'አቤቱታ አልተገኘም' : 'Complaint Not Found'}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {locale === 'am' 
                ? 'እባክዎ የማጣቀሻ ቁጥሩን ያረጋግጡ እና እንደገና ይሞክሩ።' 
                : 'Please verify the reference number and try again.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Complaint Details */}
      {complaint && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {t('complaints.reference')}: {complaint.referenceNumber}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {t(`complaints.types.${complaint.type}` as keyof typeof import('@/lib/i18n/translations/en').default)}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(complaint.status)}>
                  {getStatusLabel(complaint.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Subject and Description */}
              <div>
                <h4 className="font-medium text-foreground">{t('complaints.subject')}</h4>
                <p className="mt-1 text-muted-foreground">{complaint.subject}</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">{t('complaints.description')}</h4>
                <p className="mt-1 text-muted-foreground">{complaint.description}</p>
              </div>

              {/* Info Grid */}
              <div className="grid gap-4 rounded-lg bg-muted/50 p-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">{locale === 'am' ? 'የቀረበበት ቀን' : 'Submitted Date'}</p>
                  <p className="font-medium">{complaint.submittedAt.toLocaleDateString(locale === 'am' ? 'am-ET' : 'en-US')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{locale === 'am' ? 'የመጨረሻ ዝማኔ' : 'Last Updated'}</p>
                  <p className="font-medium">{complaint.updatedAt.toLocaleDateString(locale === 'am' ? 'am-ET' : 'en-US')}</p>
                </div>
                {complaint.assignedTo && (
                  <div className="sm:col-span-2">
                    <p className="text-sm text-muted-foreground">{locale === 'am' ? 'የተመደበለት' : 'Assigned To'}</p>
                    <p className="font-medium">{complaint.assignedTo}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>{locale === 'am' ? 'የአቤቱታ ታሪክ' : 'Complaint Timeline'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-6 pl-8">
                {/* Timeline line */}
                <div className="absolute left-3 top-2 h-[calc(100%-1rem)] w-0.5 bg-border" />
                
                {complaint.timeline.map((event, index) => {
                  const StatusIcon = statusIcons[event.status]
                  const isLast = index === complaint.timeline.length - 1
                  
                  return (
                    <div key={index} className="relative">
                      {/* Timeline dot */}
                      <div className={`absolute -left-5 flex size-6 items-center justify-center rounded-full ${
                        isLast ? 'bg-primary' : 'bg-muted'
                      }`}>
                        <StatusIcon className={`size-3 ${isLast ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                      </div>
                      
                      <div className="rounded-lg border border-border p-4">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className={getStatusColor(event.status)}>
                            {getStatusLabel(event.status)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {event.date.toLocaleDateString(locale === 'am' ? 'am-ET' : 'en-US')}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{event.note}</p>
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
