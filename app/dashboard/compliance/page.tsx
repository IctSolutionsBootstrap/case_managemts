'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import { RoleSidebar } from '@/components/dashboard/role-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertTriangle, Shield, Clock, Download, ArrowLeft } from 'lucide-react'
import { criminalCases } from '@/lib/cms-data/mock-data'
import { useI18n } from '@/lib/i18n/context'
import Link from 'next/link'

export default function CompliancePage() {
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

  // Calculate compliance data
  const complianceData = criminalCases.map(c => ({
    id: c.id,
    caseNumber: c.caseNumber,
    title: c.fir.firNumber,
    crimeType: c.fir.crimeType,
    '48hrRule': !c.legalTimers.some(t => t.type === '48_hour_appearance' && t.isViolated),
    'remand': !c.legalTimers.some(t => t.type === 'remand_14_day' && t.isViolated),
    'prosecutor': !c.legalTimers.some(t => t.type === 'prosecutor_15_day' && t.isViolated),
    status: c.status
  }))

  const stats = {
    total: complianceData.length,
    passed48hr: complianceData.filter(d => d['48hrRule']).length,
    passedRemand: complianceData.filter(d => d['remand']).length,
    passedProsecutor: complianceData.filter(d => d['prosecutor']).length,
  }

  const overallRate = Math.round(((stats.passed48hr + stats.passedRemand + stats.passedProsecutor) / (stats.total * 3)) * 100)

  return (
    <SidebarProvider>
      <RoleSidebar />
      <SidebarInset>
        <DashboardHeader 
          title="Legal Compliance" 
          titleAm="የህግ ተገዢነት" 
        />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="space-y-6 max-w-7xl mx-auto">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export Audit Logs
              </Button>
            </div>

            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Legal Compliance Monitoring
              </h1>
              <p className="text-muted-foreground">
                Audit of adherence to Ethiopian criminal procedure time limits
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Overall Adherence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{overallRate}%</div>
                  <p className="text-xs text-muted-foreground mt-1">Weighted average</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">48-Hour Integrity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{Math.round((stats.passed48hr / stats.total) * 100)}%</div>
                  <p className="text-xs text-success-foreground mt-1">{stats.passed48hr}/{stats.total} compliant</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Remand Cycle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{Math.round((stats.passedRemand / stats.total) * 100)}%</div>
                  <p className="text-xs text-success-foreground mt-1">{stats.passedRemand}/{stats.total} compliant</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Prosecution Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{Math.round((stats.passedProsecutor / stats.total) * 100)}%</div>
                  <p className="text-xs text-warning-foreground mt-1">{stats.passedProsecutor}/{stats.total} compliant</p>
                </CardContent>
              </Card>
            </div>

            {/* Compliance Table */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Audit Table</CardTitle>
                <CardDescription>Real-time status of all active case deadlines</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Case ID</TableHead>
                      <TableHead className="text-center">48-Hour Rule</TableHead>
                      <TableHead className="text-center">14-Day Remand</TableHead>
                      <TableHead className="text-center">15-Day Prosecutor</TableHead>
                      <TableHead>Current Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complianceData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-mono">{row.caseNumber}</TableCell>
                        <TableCell className="text-center">
                          {row['48hrRule'] ? (
                            <CheckCircle2 className="mx-auto h-5 w-5 text-success" />
                          ) : (
                            <AlertTriangle className="mx-auto h-5 w-5 text-destructive" />
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {row['remand'] ? (
                            <CheckCircle2 className="mx-auto h-5 w-5 text-success" />
                          ) : (
                            <AlertTriangle className="mx-auto h-5 w-5 text-destructive" />
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {row['prosecutor'] ? (
                            <CheckCircle2 className="mx-auto h-5 w-5 text-success" />
                          ) : (
                            <AlertTriangle className="mx-auto h-5 w-5 text-destructive" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {row.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Legislative Context */}
            <div className="bg-muted/50 p-6 rounded-lg border">
              <div className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-muted-foreground shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold">Legal Context Note</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    According to the FDRE Constitution and Criminal Procedure, suspects must appear in court within 48 hours of arrest. 
                    Remand periods are granted by the court in 14-day cycles, and prosecutors have 15 days to review police investigation results.
                    Violations noted above require immediate internal disciplinary review.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
