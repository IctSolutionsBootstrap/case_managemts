'use client'

import Link from 'next/link'
import { 
  BarChart3,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  TrendingUp,
  ArrowRight,
  Shield,
  Scale,
} from 'lucide-react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RoleSidebar } from '@/components/dashboard/role-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { useI18n } from '@/lib/i18n/context'
import { criminalCases, getBureauStats, crimeReports } from '@/lib/cms-data/mock-data'

export function BureauDashboard() {
  const { locale } = useI18n()
  const stats = getBureauStats()

  // Legal compliance data
  const complianceData = criminalCases.map(c => ({
    caseNumber: c.caseNumber,
    '48hrRule': !c.legalTimers.some(t => t.type === '48_hour_appearance' && t.isViolated),
    'remand': !c.legalTimers.some(t => t.type === 'remand_14_day' && t.isViolated),
    'prosecutor': !c.legalTimers.some(t => t.type === 'prosecutor_15_day' && t.isViolated),
  }))

  const statsCards = [
    {
      title: locale === 'am' ? 'ጠቅላላ ጉዳዮች' : 'Total Cases',
      value: stats.totalCases,
      icon: FileText,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: locale === 'am' ? 'ንቁ ጉዳዮች' : 'Active Cases',
      value: stats.activeCases,
      icon: Clock,
      color: 'bg-info/10 text-info-foreground',
    },
    {
      title: locale === 'am' ? 'የተፈቱ ጉዳዮች' : 'Resolved Cases',
      value: stats.resolvedCases,
      icon: CheckCircle2,
      color: 'bg-success/10 text-success-foreground',
    },
    {
      title: locale === 'am' ? 'የህግ ጥሰቶች' : 'Legal Violations',
      value: stats.legalViolations,
      icon: AlertTriangle,
      color: stats.legalViolations > 0 ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success-foreground',
    },
  ]

  // Case distribution by status
  const casesByStatus = [
    { status: 'Under Investigation', count: criminalCases.filter(c => c.status === 'under_investigation').length, color: 'bg-info' },
    { status: 'In Remand', count: criminalCases.filter(c => c.status === 'remand').length, color: 'bg-warning' },
    { status: 'Prosecution Review', count: criminalCases.filter(c => c.status === 'prosecution_review').length, color: 'bg-primary' },
    { status: 'Trial', count: criminalCases.filter(c => c.status === 'trial').length, color: 'bg-chart-4' },
    { status: 'Execution', count: criminalCases.filter(c => c.status === 'execution').length, color: 'bg-chart-5' },
  ]

  return (
    <SidebarProvider>
      <RoleSidebar />
      <SidebarInset>
        <DashboardHeader 
          title="Bureau Dashboard" 
          titleAm="የቢሮ ዳሽቦርድ" 
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

            {/* Key Metrics */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Compliance Rate */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="size-5" />
                    {locale === 'am' ? 'የህግ ተገዢነት መጠን' : 'Legal Compliance Rate'}
                  </CardTitle>
                  <CardDescription>
                    {locale === 'am' 
                      ? 'የህግ የጊዜ ገደቦችን ማክበር'
                      : 'Adherence to legal time constraints'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="relative size-32">
                      <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-muted"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray={`${stats.complianceRate} ${100 - stats.complianceRate}`}
                          className="text-success"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-foreground">{stats.complianceRate}%</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">48-Hour Rule</span>
                        <Badge variant="outline" className="text-success-foreground">
                          {complianceData.filter(c => c['48hrRule']).length}/{complianceData.length}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">14-Day Remand</span>
                        <Badge variant="outline" className="text-success-foreground">
                          {complianceData.filter(c => c['remand']).length}/{complianceData.length}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Prosecutor 15-Day</span>
                        <Badge variant="outline" className="text-warning-foreground">
                          {complianceData.filter(c => c['prosecutor']).length}/{complianceData.length}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Case Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="size-5" />
                    {locale === 'am' ? 'የጉዳይ ስርጭት' : 'Case Distribution'}
                  </CardTitle>
                  <CardDescription>
                    {locale === 'am' ? 'በደረጃ የተከፋፈለ' : 'Cases by current stage'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {casesByStatus.map((item, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{item.status}</span>
                          <span className="font-medium">{item.count}</span>
                        </div>
                        <Progress 
                          value={(item.count / stats.totalCases) * 100} 
                          className={`mt-1 h-2 [&>div]:${item.color}`}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Legal Compliance Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>
                    {locale === 'am' ? 'የህግ ተገዢነት ሪፖርት' : 'Legal Compliance Report'}
                  </CardTitle>
                  <CardDescription>
                    {locale === 'am' 
                      ? 'ጉዳዮች በህጋዊ የጊዜ ገደቦች ማክበር'
                      : 'Cases adherence to legal time constraints'
                    }
                  </CardDescription>
                </div>
                <Link href="/dashboard/compliance">
                  <Button variant="outline" size="sm" className="gap-2">
                    {locale === 'am' ? 'ሙሉ ሪፖርት' : 'Full Report'}
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 text-left font-medium text-muted-foreground">
                          {locale === 'am' ? 'ጉዳይ ቁጥር' : 'Case ID'}
                        </th>
                        <th className="py-3 text-center font-medium text-muted-foreground">
                          48hr Rule
                        </th>
                        <th className="py-3 text-center font-medium text-muted-foreground">
                          Remand
                        </th>
                        <th className="py-3 text-center font-medium text-muted-foreground">
                          Prosecutor
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {complianceData.map((row, idx) => (
                        <tr key={idx} className="border-b last:border-0">
                          <td className="py-3 font-medium">{row.caseNumber}</td>
                          <td className="py-3 text-center">
                            {row['48hrRule'] ? (
                              <CheckCircle2 className="mx-auto size-5 text-success-foreground" />
                            ) : (
                              <AlertTriangle className="mx-auto size-5 text-destructive" />
                            )}
                          </td>
                          <td className="py-3 text-center">
                            {row['remand'] ? (
                              <CheckCircle2 className="mx-auto size-5 text-success-foreground" />
                            ) : (
                              <AlertTriangle className="mx-auto size-5 text-destructive" />
                            )}
                          </td>
                          <td className="py-3 text-center">
                            {row['prosecutor'] ? (
                              <CheckCircle2 className="mx-auto size-5 text-success-foreground" />
                            ) : (
                              <AlertTriangle className="mx-auto size-5 text-destructive" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Crime Reports Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="size-5" />
                  {locale === 'am' ? 'የማህበረሰብ ሪፖርቶች' : 'Community Crime Reports'}
                </CardTitle>
                <CardDescription>
                  {locale === 'am' ? 'ከማህበረሰብ የቀረቡ ሪፖርቶች' : 'Reports submitted by citizens'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {crimeReports.map((report) => (
                    <div 
                      key={report.id}
                      className="flex items-center gap-4 rounded-lg border p-4"
                    >
                      <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                        <FileText className="size-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">{report.reportNumber}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {report.crimeType.replace('_', ' ')} - {report.incidentLocation}
                        </p>
                      </div>
                      <Badge className={
                        report.status === 'converted_to_fir' ? 'bg-success/10 text-success-foreground border-success/20' :
                        report.status === 'acknowledged' ? 'bg-info/10 text-info-foreground border-info/20' :
                        report.status === 'submitted' ? 'bg-warning/10 text-warning-foreground border-warning/20' :
                        'bg-muted text-muted-foreground'
                      }>
                        {report.status.replace('_', ' ')}
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
