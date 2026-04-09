'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import { RoleSidebar } from '@/components/dashboard/role-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Clock, ArrowRight, Filter, Search, Shield } from 'lucide-react'
import { criminalCases } from '@/lib/cms-data/mock-data'
import { useI18n } from '@/lib/i18n/context'
import Link from 'next/link'
import { format } from 'date-fns'

export default function ViolationsPage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const { locale } = useI18n()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
    if (!isLoading && user && user.role !== 'bureau_admin') {
      router.push('/dashboard')
    }
  }, [user, isLoading, isAuthenticated, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Get all violated timers
  const violations = criminalCases.flatMap(c => 
    c.legalTimers
      .filter(t => t.isViolated)
      .map(timer => ({
        ...timer,
        caseId: c.id,
        caseNumber: c.caseNumber,
        crimeType: c.fir.crimeType,
        responsibleOfficer: c.assignedOfficer || 'Unassigned',
      }))
  )

  return (
    <SidebarProvider>
      <RoleSidebar />
      <SidebarInset>
        <DashboardHeader 
          title="Legal Violations" 
          titleAm="የህግ ጥሰቶች" 
        />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="space-y-6 max-w-6xl mx-auto">
            
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-destructive flex items-center gap-3">
                  <AlertTriangle className="size-8" />
                  Active Violations
                </h1>
                <p className="text-muted-foreground mt-1 text-lg">
                  {violations.length} legal deadlines have been breached and require immediate resolution.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Filter className="size-4" />
                  Filter
                </Button>
                <Button className="gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  <AlertTriangle className="size-4" />
                  Export Urgent List
                </Button>
              </div>
            </div>

            {/* Violation Cards */}
            <div className="grid gap-6">
              {violations.length === 0 ? (
                <Card className="border-dashed py-12">
                  <CardContent className="flex flex-col items-center justify-center text-center">
                    <div className="size-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                      <Clock className="size-8 text-success" />
                    </div>
                    <h3 className="text-xl font-semibold">No active violations</h3>
                    <p className="text-muted-foreground max-w-xs mt-2">
                      All legal deadlines are currently being met across all departments.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                violations.map((violation, idx) => (
                  <Card key={idx} className="overflow-hidden border-l-4 border-l-destructive shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row items-stretch">
                        <div className="flex-1 p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <Badge variant="destructive" className="animate-pulse">
                              {violation.type.replace(/_/g, ' ').toUpperCase()}
                            </Badge>
                            <span className="text-sm font-mono text-muted-foreground">{violation.caseNumber}</span>
                          </div>
                          
                          <h3 className="text-xl font-bold mb-2">
                            Deadline Expired: {format(new Date(violation.deadline), 'PPpp')}
                          </h3>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Responsible</p>
                              <p className="text-sm font-medium mt-1">{violation.responsibleOfficer}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Crime Type</p>
                              <p className="text-sm font-medium mt-1 capitalize">{violation.crimeType.replace('_', ' ')}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Hours Overdue</p>
                              <p className="text-sm font-bold text-destructive mt-1">
                                {Math.abs(violation.remainingHours)} Hours
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-muted/30 p-6 flex items-center justify-center border-t md:border-t-0 md:border-l">
                          <Link href={`/dashboard/cases/${violation.caseId}`}>
                            <Button className="gap-2 group">
                              View Case
                              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Alert System Notice */}
            <Card className="bg-destructive/5 border-destructive/20 mt-8">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <Shield className="size-5" />
                  Bureau Enforcement Protocol
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-destructive/80 leading-relaxed">
                  The Justice Bureau Administrator is notified automatically when a violation exceeds 24 hours. Officers and prosecutors associated with these cases are required to submit an Exception Report explaining the delay. Failure to comply with Constitutional time limits may result in judicial dismissal of the case.
                </p>
              </CardContent>
            </Card>

          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
