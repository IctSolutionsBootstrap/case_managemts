'use client'

import Link from 'next/link'
import { 
  Users,
  Clock,
  Calendar,
  ArrowRight,
  Shield,
  UserCheck,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RoleSidebar } from '@/components/dashboard/role-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { useI18n } from '@/lib/i18n/context'
import { inmates, getPrisonStats } from '@/lib/cms-data/mock-data'

export function PrisonDashboard() {
  const { locale } = useI18n()
  const stats = getPrisonStats()

  // Inmates with upcoming releases
  const upcomingReleases = inmates
    .filter(i => i.remainingDays <= 90 && i.status === 'serving')
    .sort((a, b) => a.remainingDays - b.remainingDays)

  const statsCards = [
    {
      title: locale === 'am' ? 'ጠቅላላ እስረኞች' : 'Total Inmates',
      value: stats.totalInmates,
      icon: Users,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: locale === 'am' ? 'አዲስ ገቢዎች' : 'New Admissions',
      value: stats.newAdmissions,
      description: locale === 'am' ? 'ባለፉት 30 ቀናት' : 'Last 30 days',
      icon: UserCheck,
      color: 'bg-info/10 text-info-foreground',
    },
    {
      title: locale === 'am' ? 'የሚቀርቡ ልቀቃዎች' : 'Upcoming Releases',
      value: stats.upcomingReleases,
      description: locale === 'am' ? 'በ90 ቀናት ውስጥ' : 'Within 90 days',
      icon: Calendar,
      color: 'bg-success/10 text-success-foreground',
    },
    {
      title: locale === 'am' ? 'የተሞላ መጠን' : 'Occupancy Rate',
      value: `${stats.occupancyRate}%`,
      icon: Shield,
      color: 'bg-warning/10 text-warning-foreground',
    },
  ]

  return (
    <SidebarProvider>
      <RoleSidebar />
      <SidebarInset>
        <DashboardHeader 
          title="Prison Dashboard" 
          titleAm="የማረሚያ ዳሽቦርድ" 
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
                      {stat.description && (
                        <p className="text-xs text-muted-foreground">{stat.description}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Upcoming Releases */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="size-5" />
                    {locale === 'am' ? 'የሚቀርቡ ልቀቃዎች' : 'Upcoming Releases'}
                  </CardTitle>
                  <CardDescription>
                    {locale === 'am' ? 'በቀጣይ 90 ቀናት ውስጥ የሚለቀቁ' : 'Inmates to be released within 90 days'}
                  </CardDescription>
                </div>
                <Link href="/dashboard/releases">
                  <Button variant="outline" size="sm" className="gap-2">
                    {locale === 'am' ? 'ሁሉንም ይመልከቱ' : 'View All'}
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {upcomingReleases.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingReleases.map((inmate) => {
                      const progressPercent = ((inmate.sentenceDurationMonths * 30 - inmate.remainingDays) / (inmate.sentenceDurationMonths * 30)) * 100
                      return (
                        <div 
                          key={inmate.id}
                          className="rounded-lg border p-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                {inmate.suspect.fullName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{inmate.suspect.fullName}</p>
                                <p className="text-sm text-muted-foreground">{inmate.inmateNumber}</p>
                              </div>
                            </div>
                            <Badge 
                              className={
                                inmate.remainingDays <= 30 
                                  ? 'bg-success/10 text-success-foreground border-success/20' 
                                  : 'bg-warning/10 text-warning-foreground border-warning/20'
                              }
                            >
                              {inmate.remainingDays} {locale === 'am' ? 'ቀናት ቀርቷል' : 'days left'}
                            </Badge>
                          </div>
                          
                          <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
                            <div>
                              <span className="text-muted-foreground">{locale === 'am' ? 'ክፍል' : 'Cell Block'}:</span>
                              <span className="ml-2 font-medium">{inmate.cellBlock}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">{locale === 'am' ? 'ቅጣት' : 'Sentence'}:</span>
                              <span className="ml-2 font-medium">{inmate.sentenceDurationMonths} months</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">{locale === 'am' ? 'ባህሪ' : 'Behavior'}:</span>
                              <Badge variant="outline" className={`ml-2 capitalize ${
                                inmate.behavior === 'good' ? 'text-success-foreground' :
                                inmate.behavior === 'fair' ? 'text-warning-foreground' :
                                'text-destructive'
                              }`}>
                                {inmate.behavior}
                              </Badge>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{locale === 'am' ? 'የቅጣት ግስጋሴ' : 'Sentence Progress'}</span>
                              <span>{Math.round(progressPercent)}% completed</span>
                            </div>
                            <Progress value={progressPercent} className="mt-2 h-2" />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    {locale === 'am' ? 'በቅርብ ጊዜ የሚለቀቅ እስረኛ የለም' : 'No upcoming releases'}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* All Inmates */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>
                    {locale === 'am' ? 'ሁሉም እስረኞች' : 'All Inmates'}
                  </CardTitle>
                  <CardDescription>
                    {locale === 'am' ? 'በአሁኑ ጊዜ እየተቀጡ ያሉ' : 'Currently serving sentences'}
                  </CardDescription>
                </div>
                <Link href="/dashboard/inmates">
                  <Button variant="outline" size="sm" className="gap-2">
                    {locale === 'am' ? 'ሁሉንም ይመልከቱ' : 'View All'}
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inmates.map((inmate) => (
                    <div 
                      key={inmate.id}
                      className="flex items-center gap-4 rounded-lg border p-4"
                    >
                      <div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                        {inmate.suspect.fullName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{inmate.suspect.fullName}</p>
                        <p className="text-sm text-muted-foreground">{inmate.inmateNumber}</p>
                      </div>
                      <div className="hidden sm:block text-sm text-muted-foreground">
                        {inmate.cellBlock}
                      </div>
                      <Badge variant={inmate.status === 'serving' ? 'default' : 'secondary'}>
                        {inmate.status}
                      </Badge>
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
