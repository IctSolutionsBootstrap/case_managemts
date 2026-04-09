'use client'

import Link from 'next/link'
import { 
  FileText, 
  Clock, 
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Gavel,
  FileSearch,
} from 'lucide-react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RoleSidebar } from '@/components/dashboard/role-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { useI18n } from '@/lib/i18n/context'
import { criminalCases, getProsecutorStats } from '@/lib/cms-data/mock-data'

export function ProsecutorDashboard() {
  const { locale } = useI18n()
  const stats = getProsecutorStats()

  // Get pending review cases
  const pendingCases = criminalCases.filter(c => c.status === 'prosecution_review')

  const statsCards = [
    {
      title: locale === 'am' ? 'በመጠባበቅ ላይ' : 'Pending Review',
      value: stats.pendingReview,
      icon: FileSearch,
      color: 'bg-warning/10 text-warning-foreground',
    },
    {
      title: locale === 'am' ? 'የጸደቁ' : 'Approved',
      value: stats.approvedThisMonth,
      icon: CheckCircle2,
      color: 'bg-success/10 text-success-foreground',
    },
    {
      title: locale === 'am' ? 'የተቀረቡ ክሶች' : 'Charges Filed',
      value: stats.totalChargesFiled,
      icon: Gavel,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: locale === 'am' ? 'ጊዜው ያለፈ' : 'Overdue Reviews',
      value: stats.overdueReviews,
      icon: AlertTriangle,
      color: stats.overdueReviews > 0 ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success-foreground',
    },
  ]

  return (
    <SidebarProvider>
      <RoleSidebar />
      <SidebarInset>
        <DashboardHeader 
          title="Prosecutor Dashboard" 
          titleAm="የዓቃቤ ህግ ዳሽቦርድ" 
        />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {statsCards.map((stat, index) => (
                <Card key={index} className="relative overflow-hidden">
                  <CardContent className="p-5">
                    <div className={`rounded-lg p-2.5 ${stat.color} w-fit`}>
                      <stat.icon className="size-5" />
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 15-Day Review Deadline Alert */}
            <Card className="border-info/50 bg-info/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-info-foreground">
                  <Clock className="size-5" />
                  {locale === 'am' ? 'የ15 ቀን ግምገማ ገደብ' : '15-Day Review Deadline'}
                </CardTitle>
                <CardDescription>
                  {locale === 'am'
                    ? 'በኢትዮጵያ የወንጀል ሕግ ቁጥር 109 መሰረት በ15 ቀናት ውስጥ ውሳኔ መስጠት ያስፈልጋል'
                    : 'Per Criminal Procedure Code Art. 109, decision must be made within 15 days'
                  }
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Pending Review Cases */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>
                    {locale === 'am' ? 'ግምገማ የሚጠበቁ ጉዳዮች' : 'Cases Pending Review'}
                  </CardTitle>
                  <CardDescription>
                    {locale === 'am' ? 'ከፖሊስ የቀረቡ ጉዳዮች' : 'Cases submitted by police for review'}
                  </CardDescription>
                </div>
                <Link href="/dashboard/review">
                  <Button variant="outline" size="sm" className="gap-2">
                    {locale === 'am' ? 'ሁሉንም ይመልከቱ' : 'View All'}
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {pendingCases.length > 0 ? (
                  <div className="space-y-4">
                    {pendingCases.map((caseItem) => {
                      const timer = caseItem.legalTimers.find(t => t.type === 'prosecutor_15_day')
                      return (
                        <div 
                          key={caseItem.id}
                          className="rounded-lg border p-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-foreground">{caseItem.caseNumber}</p>
                                <Badge variant="outline" className="capitalize">
                                  {caseItem.fir.crimeType.replace('_', ' ')}
                                </Badge>
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {caseItem.fir.crimeDescription}
                              </p>
                              <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                                <span>{caseItem.suspects.length} suspect(s)</span>
                                <span>|</span>
                                <span>{caseItem.evidence.length} evidence item(s)</span>
                                <span>|</span>
                                <span>{caseItem.witnesses.length} witness(es)</span>
                              </div>
                            </div>
                          </div>
                          
                          {timer && (
                            <div className="mt-4">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Review Deadline</span>
                                <span className={timer.isViolated ? 'text-destructive font-medium' : 'text-foreground'}>
                                  {timer.isViolated 
                                    ? 'OVERDUE' 
                                    : `${Math.floor(timer.remainingHours / 24)} days remaining`
                                  }
                                </span>
                              </div>
                              <Progress 
                                value={timer.isViolated ? 100 : Math.max(0, 100 - (timer.remainingHours / 360 * 100))} 
                                className={`mt-2 h-2 ${timer.isViolated ? '[&>div]:bg-destructive' : ''}`}
                              />
                            </div>
                          )}

                          <div className="mt-4 flex gap-2">
                            <Button size="sm" className="gap-1">
                              <CheckCircle2 className="size-4" />
                              {locale === 'am' ? 'አጽድቅ' : 'Approve'}
                            </Button>
                            <Button size="sm" variant="outline" className="gap-1">
                              <FileText className="size-4" />
                              {locale === 'am' ? 'ተጨማሪ መረጃ' : 'Request Info'}
                            </Button>
                            <Button size="sm" variant="destructive" className="gap-1">
                              <XCircle className="size-4" />
                              {locale === 'am' ? 'ውድቅ' : 'Reject'}
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    {locale === 'am' ? 'ግምገማ የሚጠብቅ ጉዳይ የለም' : 'No cases pending review'}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cases with Charges Filed */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {locale === 'am' ? 'ክስ የቀረበባቸው ጉዳዮች' : 'Cases with Charges Filed'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {criminalCases
                    .filter(c => c.chargesFiledDate)
                    .slice(0, 3)
                    .map((caseItem) => (
                      <div 
                        key={caseItem.id}
                        className="flex items-center gap-4 rounded-lg border p-4"
                      >
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                          <Gavel className="size-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{caseItem.courtCaseNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {caseItem.charges?.join(', ')}
                          </p>
                        </div>
                        <Badge>{caseItem.status.replace('_', ' ')}</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
