'use client'

import Link from 'next/link'
import { 
  Send,
  Search,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Phone,
  MapPin,
} from 'lucide-react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { RoleSidebar } from '@/components/dashboard/role-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { useI18n } from '@/lib/i18n/context'
import { useAuth } from '@/lib/auth/context'
import { crimeReports } from '@/lib/cms-data/mock-data'

export function CommunityDashboard() {
  const { locale } = useI18n()
  const { user } = useAuth()

  // Get user's reports (mock - in real app would filter by user)
  const myReports = crimeReports.filter(r => !r.isAnonymous)

  const quickActions = [
    {
      title: locale === 'am' ? 'ወንጀል ሪፖርት ያድርጉ' : 'Report a Crime',
      description: locale === 'am' ? 'አዲስ የወንጀል ሪፖርት ያቅርቡ' : 'Submit a new crime report',
      href: '/dashboard/report',
      icon: Send,
      color: 'bg-primary text-primary-foreground',
    },
    {
      title: locale === 'am' ? 'ጉዳይ ይከታተሉ' : 'Track Your Case',
      description: locale === 'am' ? 'የጉዳይዎን ሁኔታ ይመልከቱ' : 'Check the status of your case',
      href: '/dashboard/track',
      icon: Search,
      color: 'bg-info/10 text-info-foreground',
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Clock className="size-4 text-warning-foreground" />
      case 'acknowledged':
        return <CheckCircle2 className="size-4 text-info-foreground" />
      case 'converted_to_fir':
        return <CheckCircle2 className="size-4 text-success-foreground" />
      case 'rejected':
        return <AlertCircle className="size-4 text-destructive" />
      default:
        return <Clock className="size-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-warning/10 text-warning-foreground border-warning/20'
      case 'acknowledged':
        return 'bg-info/10 text-info-foreground border-info/20'
      case 'converted_to_fir':
        return 'bg-success/10 text-success-foreground border-success/20'
      case 'rejected':
        return 'bg-destructive/10 text-destructive border-destructive/20'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <SidebarProvider>
      <RoleSidebar />
      <SidebarInset>
        <DashboardHeader 
          title="Community Portal" 
          titleAm="የማህበረሰብ መግቢያ" 
        />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="space-y-6">
            {/* Welcome */}
            <div className="rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
              <h2 className="text-xl font-bold text-foreground">
                {locale === 'am' ? `እንኳን ደህና መጡ፣ ${user?.fullNameAm}` : `Welcome, ${user?.fullName}`}
              </h2>
              <p className="mt-1 text-muted-foreground">
                {locale === 'am' 
                  ? 'ወንጀል ሪፖርት ያድርጉ ወይም ያሉትን ጉዳዮች ይከታተሉ'
                  : 'Report crimes or track your existing cases'
                }
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 sm:grid-cols-2">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Card className="h-full transition-all hover:border-primary/50 hover:shadow-md">
                    <CardContent className="flex items-center gap-4 p-6">
                      <div className={`rounded-lg p-3 ${action.color}`}>
                        <action.icon className="size-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                      <ArrowRight className="ml-auto size-5 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Track Case by Reference */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {locale === 'am' ? 'ጉዳይ በቁጥር ይፈልጉ' : 'Track Case by Reference'}
                </CardTitle>
                <CardDescription>
                  {locale === 'am' 
                    ? 'የሪፖርት ቁጥርዎን ያስገቡ'
                    : 'Enter your report reference number'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input 
                    placeholder={locale === 'am' ? 'ለምሳሌ: JIG-RPT-2026-0012' : 'e.g., JIG-RPT-2026-0012'} 
                    className="flex-1"
                  />
                  <Button className="gap-2">
                    <Search className="size-4" />
                    {locale === 'am' ? 'ፈልግ' : 'Search'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* My Reports */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>
                    {locale === 'am' ? 'የኔ ሪፖርቶች' : 'My Reports'}
                  </CardTitle>
                  <CardDescription>
                    {locale === 'am' ? 'ያቀረቧቸው የወንጀል ሪፖርቶች' : 'Crime reports you have submitted'}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {myReports.length > 0 ? (
                  <div className="space-y-4">
                    {myReports.map((report) => (
                      <div 
                        key={report.id}
                        className="rounded-lg border p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            {getStatusIcon(report.status)}
                            <div>
                              <p className="font-medium text-foreground">{report.reportNumber}</p>
                              <p className="text-sm text-muted-foreground capitalize">
                                {report.crimeType.replace('_', ' ')}
                              </p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(report.status)}>
                            {report.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">
                          {report.description}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3" />
                            {report.incidentLocation}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {report.submittedAt.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    {locale === 'am' ? 'ሪፖርት አልቀረበም' : 'No reports submitted yet'}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {locale === 'am' ? 'እርዳታ ይፈልጋሉ?' : 'Need Help?'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-lg border p-4">
                    <Phone className="size-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{locale === 'am' ? 'ስልክ' : 'Phone'}</p>
                      <p className="text-sm text-muted-foreground">+251 25 775 1234</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border p-4">
                    <MapPin className="size-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{locale === 'am' ? 'አድራሻ' : 'Address'}</p>
                      <p className="text-sm text-muted-foreground">Jijiga, Somali Region</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
