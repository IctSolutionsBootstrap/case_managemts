'use client'

import Link from 'next/link'
import { 
  FileText, 
  Clock, 
  AlertTriangle,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Shield,
  Plus,
  Timer,
} from 'lucide-react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RoleSidebar } from '@/components/dashboard/role-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { useI18n } from '@/lib/i18n/context'
import { criminalCases, getPoliceStats } from '@/lib/cms-data/mock-data'

export function PoliceDashboard() {
  const { locale } = useI18n()
  const stats = getPoliceStats()

  // Get cases with active timers
  const casesWithTimers = criminalCases.filter(c => 
    c.legalTimers.length > 0 && c.assignedOfficer === 'police-001'
  )

  const statsCards = [
    {
      title: locale === 'am' ? 'ንቁ ጉዳዮች' : 'Active Cases',
      value: stats.totalActiveCases,
      icon: FileText,
      trend: '+2 this week',
      trendUp: true,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: locale === 'am' ? 'በምርመራ ላይ' : 'Under Investigation',
      value: stats.underInvestigation,
      icon: Shield,
      color: 'bg-info/10 text-info-foreground',
    },
    {
      title: locale === 'am' ? 'በእስር ክትትል' : 'In Remand',
      value: stats.inRemand,
      icon: Users,
      color: 'bg-warning/10 text-warning-foreground',
    },
    {
      title: locale === 'am' ? 'ጊዜው ያለፈ' : 'Overdue Deadlines',
      value: stats.overdueDeadlines,
      icon: AlertTriangle,
      trend: 'Requires attention',
      trendUp: false,
      color: stats.overdueDeadlines > 0 ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success-foreground',
    },
  ]

  return (
    <SidebarProvider>
      <RoleSidebar />
      <SidebarInset>
        <DashboardHeader 
          title="Police Dashboard" 
          titleAm="የፖሊስ ዳሽቦርድ" 
        />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard/fir/create">
                <Button className="gap-2">
                  <Plus className="size-4" />
                  {locale === 'am' ? 'አዲስ ኤፍአይአር' : 'New FIR'}
                </Button>
              </Link>
              <Link href="/dashboard/timers">
                <Button variant="outline" className="gap-2">
                  <Timer className="size-4" />
                  {locale === 'am' ? 'የህግ ሰዓቶች' : 'Legal Timers'}
                </Button>
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {statsCards.map((stat, index) => (
                <Card key={index} className="relative overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className={`rounded-lg p-2.5 ${stat.color}`}>
                        <stat.icon className="size-5" />
                      </div>
                      {stat.trend && (
                        <div className={`flex items-center gap-1 text-xs font-medium ${
                          stat.trendUp ? 'text-success-foreground' : 'text-destructive'
                        }`}>
                          {stat.trendUp ? (
                            <TrendingUp className="size-3" />
                          ) : (
                            <TrendingDown className="size-3" />
                          )}
                          <span className="hidden sm:inline">{stat.trend}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Legal Timers Alert */}
            {casesWithTimers.length > 0 && (
              <Card className="border-warning/50 bg-warning/5">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-warning-foreground">
                    <Clock className="size-5" />
                    {locale === 'am' ? 'ንቁ የህግ ሰዓቶች' : 'Active Legal Timers'}
                  </CardTitle>
                  <CardDescription>
                    {locale === 'am' 
                      ? 'እነዚህ ጉዳዮች በህጋዊ የጊዜ ገደቦች ውስጥ ናቸው'
                      : 'These cases have legal deadline constraints'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {casesWithTimers.slice(0, 3).map((caseItem) => (
                      <div key={caseItem.id} className="rounded-lg border bg-background p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-medium text-foreground">{caseItem.caseNumber}</p>
                            <p className="text-sm text-muted-foreground">
                              {caseItem.fir.crimeDescription.substring(0, 50)}...
                            </p>
                          </div>
                          <Badge 
                            variant={caseItem.legalTimers[0]?.isViolated ? 'destructive' : 'secondary'}
                          >
                            {caseItem.legalTimers[0]?.isViolated 
                              ? (locale === 'am' ? 'ጊዜው አልፏል' : 'OVERDUE')
                              : `${caseItem.legalTimers[0]?.remainingHours}h left`
                            }
                          </Badge>
                        </div>
                        {caseItem.legalTimers.map((timer, idx) => (
                          <div key={idx} className="mt-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                {timer.type === '48_hour_appearance' && '48-Hour Court Appearance'}
                                {timer.type === 'remand_14_day' && '14-Day Remand Period'}
                                {timer.type === 'prosecutor_15_day' && '15-Day Prosecutor Review'}
                              </span>
                              <span className={timer.isViolated ? 'text-destructive font-medium' : 'text-foreground'}>
                                {timer.isViolated 
                                  ? 'VIOLATION' 
                                  : `${timer.remainingHours} hours remaining`
                                }
                              </span>
                            </div>
                            <Progress 
                              value={timer.isViolated ? 100 : Math.max(0, 100 - (timer.remainingHours / (timer.type === '48_hour_appearance' ? 48 : 336) * 100))} 
                              className={`mt-2 h-2 ${timer.isViolated ? '[&>div]:bg-destructive' : ''}`}
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Cases */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>
                    {locale === 'am' ? 'የቅርብ ጊዜ ጉዳዮች' : 'Recent Cases'}
                  </CardTitle>
                  <CardDescription>
                    {locale === 'am' ? 'የተመደቡልዎት ጉዳዮች' : 'Cases assigned to you'}
                  </CardDescription>
                </div>
                <Link href="/dashboard/cases">
                  <Button variant="outline" size="sm" className="gap-2">
                    {locale === 'am' ? 'ሁሉንም ይመልከቱ' : 'View All'}
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {criminalCases
                    .filter(c => c.assignedOfficer === 'police-001')
                    .slice(0, 5)
                    .map((caseItem) => (
                      <div 
                        key={caseItem.id}
                        className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-accent/50"
                      >
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                          <FileText className="size-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{caseItem.caseNumber}</p>
                            <Badge variant="outline" className="capitalize">
                              {caseItem.fir.crimeType.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {caseItem.fir.crimeDescription}
                          </p>
                        </div>
                        <div className="text-right hidden sm:block">
                          <Badge 
                            className={
                              caseItem.status === 'remand' ? 'bg-warning/10 text-warning-foreground border-warning/20' :
                              caseItem.status === 'under_investigation' ? 'bg-info/10 text-info-foreground border-info/20' :
                              'bg-muted text-muted-foreground'
                            }
                          >
                            {caseItem.status.replace('_', ' ')}
                          </Badge>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {caseItem.suspects.length} suspect(s)
                          </p>
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
