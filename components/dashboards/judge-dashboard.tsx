'use client'

import Link from 'next/link'
import { 
  Calendar, 
  Gavel,
  Scale,
  Clock,
  Users,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RoleSidebar } from '@/components/dashboard/role-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { useI18n } from '@/lib/i18n/context'
import { criminalCases, getCourtStats } from '@/lib/cms-data/mock-data'

export function JudgeDashboard() {
  const { locale } = useI18n()
  const stats = getCourtStats()

  // Get all hearings
  const allHearings = criminalCases.flatMap(c => 
    c.hearings.map(h => ({ ...h, caseNumber: c.caseNumber, courtCaseNumber: c.courtCaseNumber }))
  )
  const upcomingHearings = allHearings
    .filter(h => h.status === 'scheduled')
    .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())

  const statsCards = [
    {
      title: locale === 'am' ? 'ንቁ ጉዳዮች' : 'Active Cases',
      value: stats.activeCases,
      icon: Scale,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: locale === 'am' ? 'የተቀጠሩ ችሎቶች' : 'Scheduled Hearings',
      value: stats.scheduledHearings,
      icon: Calendar,
      color: 'bg-info/10 text-info-foreground',
    },
    {
      title: locale === 'am' ? 'የተጠናቀቁ ችሎቶች' : 'Completed Hearings',
      value: stats.completedHearings,
      icon: CheckCircle2,
      color: 'bg-success/10 text-success-foreground',
    },
    {
      title: locale === 'am' ? 'የሚጠበቁ ፍርዶች' : 'Pending Judgments',
      value: stats.pendingJudgments,
      icon: Gavel,
      color: 'bg-warning/10 text-warning-foreground',
    },
  ]

  return (
    <SidebarProvider>
      <RoleSidebar />
      <SidebarInset>
        <DashboardHeader 
          title="Court Dashboard" 
          titleAm="የፍርድ ቤት ዳሽቦርድ" 
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

            {/* Legal Timeline Reference */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">
                  {locale === 'am' ? 'የህግ የጊዜ ገደቦች' : 'Legal Time Constraints'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border bg-background p-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Clock className="size-4 text-destructive" />
                      48 Hours
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {locale === 'am' 
                        ? 'ከእስር በኋላ ለመጀመሪያ ጊዜ ፍርድ ቤት መቅረብ'
                        : 'First court appearance after arrest (FDRE Constitution Art. 19(3))'
                      }
                    </p>
                  </div>
                  <div className="rounded-lg border bg-background p-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Clock className="size-4 text-warning-foreground" />
                      14 Days
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {locale === 'am'
                        ? 'የፖሊስ ምርመራ ጊዜ በአንድ ክፍለ ጊዜ'
                        : 'Police remand per session (Criminal Procedure Code Art. 59)'
                      }
                    </p>
                  </div>
                  <div className="rounded-lg border bg-background p-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Clock className="size-4 text-info-foreground" />
                      15 Days
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {locale === 'am'
                        ? 'የዓቃቤ ህግ ውሳኔ ጊዜ'
                        : 'Prosecutor decision time (Criminal Procedure Code Art. 109)'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Hearings */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>
                    {locale === 'am' ? 'የሚመጡ ችሎቶች' : 'Upcoming Hearings'}
                  </CardTitle>
                  <CardDescription>
                    {locale === 'am' ? 'በቀጣይ ቀናት የተቀጠሩ' : 'Scheduled for upcoming days'}
                  </CardDescription>
                </div>
                <Link href="/dashboard/hearings">
                  <Button variant="outline" size="sm" className="gap-2">
                    {locale === 'am' ? 'ሁሉንም ይመልከቱ' : 'View All'}
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {upcomingHearings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingHearings.map((hearing) => (
                      <div 
                        key={hearing.id}
                        className="flex items-center gap-4 rounded-lg border p-4"
                      >
                        <div className="flex size-12 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <span className="text-lg font-bold">
                            {hearing.scheduledDate.getDate()}
                          </span>
                          <span className="text-xs">
                            {hearing.scheduledDate.toLocaleDateString('en', { month: 'short' })}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{hearing.courtCaseNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {hearing.type.charAt(0).toUpperCase() + hearing.type.slice(1)} Hearing - Session #{hearing.hearingNumber}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="size-3" />
                            {hearing.scheduledDate.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                            <span>|</span>
                            <Users className="size-3" />
                            {hearing.attendees?.length || 0} attendees
                          </div>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {hearing.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    {locale === 'am' ? 'የተቀጠረ ችሎት የለም' : 'No upcoming hearings'}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Trial Cases */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {locale === 'am' ? 'በችሎት ላይ ያሉ ጉዳዮች' : 'Cases in Trial'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {criminalCases
                    .filter(c => c.status === 'trial')
                    .map((caseItem) => (
                      <div 
                        key={caseItem.id}
                        className="flex items-center gap-4 rounded-lg border p-4"
                      >
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                          <Scale className="size-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{caseItem.courtCaseNumber}</p>
                            <Badge variant="outline">{caseItem.courtRoom}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {caseItem.charges?.join(' | ')}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {caseItem.hearings.filter(h => h.status === 'completed').length} hearing(s) completed
                          </p>
                        </div>
                        <div className="text-right">
                          {caseItem.verdict ? (
                            <Badge className={
                              caseItem.verdict === 'convicted' ? 'bg-destructive/10 text-destructive' :
                              caseItem.verdict === 'acquitted' ? 'bg-success/10 text-success-foreground' :
                              'bg-muted'
                            }>
                              {caseItem.verdict}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">In Progress</Badge>
                          )}
                        </div>
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
