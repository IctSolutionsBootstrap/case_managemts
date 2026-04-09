'use client'

import Link from 'next/link'
import { 
  FolderOpen,
  Calendar,
  Clock,
  FileText,
  ArrowRight,
  Scale,
  Users,
} from 'lucide-react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RoleSidebar } from '@/components/dashboard/role-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { useI18n } from '@/lib/i18n/context'
import { criminalCases } from '@/lib/cms-data/mock-data'

export function LawyerDashboard() {
  const { locale } = useI18n()

  // Get cases assigned to this lawyer
  const myCases = criminalCases.filter(c => c.assignedLawyer === 'lawyer-001')
  
  // Get upcoming hearings
  const myHearings = myCases.flatMap(c => 
    c.hearings
      .filter(h => h.status === 'scheduled')
      .map(h => ({ ...h, caseNumber: c.caseNumber, courtCaseNumber: c.courtCaseNumber }))
  ).sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())

  const statsCards = [
    {
      title: locale === 'am' ? 'የኔ ጉዳዮች' : 'My Cases',
      value: myCases.length,
      icon: FolderOpen,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: locale === 'am' ? 'ንቁ ችሎቶች' : 'Active Hearings',
      value: myHearings.length,
      icon: Calendar,
      color: 'bg-info/10 text-info-foreground',
    },
    {
      title: locale === 'am' ? 'ሰነዶች' : 'Documents',
      value: 12,
      icon: FileText,
      color: 'bg-success/10 text-success-foreground',
    },
    {
      title: locale === 'am' ? 'ደንበኞች' : 'Clients',
      value: myCases.reduce((acc, c) => acc + c.suspects.length, 0),
      icon: Users,
      color: 'bg-warning/10 text-warning-foreground',
    },
  ]

  return (
    <SidebarProvider>
      <RoleSidebar />
      <SidebarInset>
        <DashboardHeader 
          title="Lawyer Dashboard" 
          titleAm="የጠበቃ ዳሽቦርድ" 
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

            {/* Upcoming Hearings */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="size-5" />
                    {locale === 'am' ? 'የሚመጡ ችሎቶች' : 'Upcoming Hearings'}
                  </CardTitle>
                  <CardDescription>
                    {locale === 'am' ? 'የተቀጠሩ የፍርድ ቤት ቀናት' : 'Scheduled court dates'}
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
                {myHearings.length > 0 ? (
                  <div className="space-y-4">
                    {myHearings.map((hearing) => (
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
                          <p className="text-sm text-muted-foreground capitalize">
                            {hearing.type} Hearing - Session #{hearing.hearingNumber}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="size-3" />
                            {hearing.scheduledDate.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {hearing.status}
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

            {/* My Cases */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>
                    {locale === 'am' ? 'የኔ ጉዳዮች' : 'My Cases'}
                  </CardTitle>
                  <CardDescription>
                    {locale === 'am' ? 'የተመደቡልዎት ጉዳዮች' : 'Cases assigned to you'}
                  </CardDescription>
                </div>
                <Link href="/dashboard/my-cases">
                  <Button variant="outline" size="sm" className="gap-2">
                    {locale === 'am' ? 'ሁሉንም ይመልከቱ' : 'View All'}
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {myCases.length > 0 ? (
                  <div className="space-y-4">
                    {myCases.map((caseItem) => (
                      <div 
                        key={caseItem.id}
                        className="flex items-center gap-4 rounded-lg border p-4"
                      >
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                          <Scale className="size-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{caseItem.courtCaseNumber}</p>
                            <Badge variant="outline" className="capitalize">
                              {caseItem.fir.crimeType.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Client: {caseItem.suspects[0]?.fullName}
                          </p>
                        </div>
                        <Badge className={
                          caseItem.status === 'trial' ? 'bg-warning/10 text-warning-foreground border-warning/20' :
                          'bg-muted text-muted-foreground'
                        }>
                          {caseItem.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    {locale === 'am' ? 'የተመደበ ጉዳይ የለም' : 'No cases assigned'}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
