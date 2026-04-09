'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import { RoleSidebar } from '@/components/dashboard/role-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { mockCases, mockUsers, mockHearings } from '@/lib/cms-data/mock-data'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts'
import { Download, FileText, TrendingUp, Users, Scale, Calendar } from 'lucide-react'
import { useState } from 'react'

const COLORS = ['#1a365d', '#8b1c3c', '#059669', '#d97706', '#7c3aed', '#0ea5e9']

export default function ReportsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [reportPeriod, setReportPeriod] = useState('month')

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
    // Only specific roles can view reports
    if (!isLoading && user && !['bureau', 'prosecutor', 'judge', 'police'].includes(user.role)) {
      router.push('/dashboard')
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Calculate statistics
  const casesByStatus = mockCases.reduce((acc, c) => {
    const status = c.status.replace(/_/g, ' ')
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const casesByCrimeType = mockCases.reduce((acc, c) => {
    const crimeType = c.crimeType.replace(/_/g, ' ')
    acc[crimeType] = (acc[crimeType] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const casesByDistrict = mockCases.reduce((acc, c) => {
    acc[c.district] = (acc[c.district] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const statusData = Object.entries(casesByStatus).map(([name, value]) => ({ name, value }))
  const crimeData = Object.entries(casesByCrimeType).map(([name, value]) => ({ name, value }))
  const districtData = Object.entries(casesByDistrict).map(([name, value]) => ({ name, value }))

  // Monthly trend data (mock)
  const monthlyTrend = [
    { month: 'Jan', cases: 45, resolved: 32 },
    { month: 'Feb', cases: 52, resolved: 38 },
    { month: 'Mar', cases: 48, resolved: 41 },
    { month: 'Apr', cases: 61, resolved: 45 },
    { month: 'May', cases: 55, resolved: 50 },
    { month: 'Jun', cases: 67, resolved: 52 },
  ]

  // Key metrics
  const totalCases = mockCases.length
  const activeCases = mockCases.filter(c => !['closed', 'dismissed', 'released'].includes(c.status)).length
  const resolvedCases = mockCases.filter(c => ['closed', 'released'].includes(c.status)).length
  const convictionRate = Math.round((mockCases.filter(c => c.status === 'sentenced' || c.status === 'serving_sentence').length / totalCases) * 100)
  const pendingHearings = mockHearings.filter(h => h.status === 'scheduled').length
  const avgCaseDuration = 45 // days (mock)

  return (
    <SidebarProvider>
      <RoleSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
                <p className="text-muted-foreground">
                  Justice Bureau performance metrics and case analytics
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Select value={reportPeriod} onValueChange={setReportPeriod}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{totalCases}</p>
                      <p className="text-sm text-muted-foreground">Total Cases</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{activeCases}</p>
                      <p className="text-sm text-muted-foreground">Active Cases</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Scale className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{resolvedCases}</p>
                      <p className="text-sm text-muted-foreground">Resolved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Users className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{convictionRate}%</p>
                      <p className="text-sm text-muted-foreground">Conviction Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{pendingHearings}</p>
                      <p className="text-sm text-muted-foreground">Pending Hearings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{avgCaseDuration}</p>
                      <p className="text-sm text-muted-foreground">Avg Days/Case</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Cases by Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Cases by Status</CardTitle>
                  <CardDescription>Distribution of cases across different stages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Cases by Crime Type */}
              <Card>
                <CardHeader>
                  <CardTitle>Cases by Crime Type</CardTitle>
                  <CardDescription>Breakdown of cases by offense category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={crimeData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#1a365d" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Monthly Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Case Trend</CardTitle>
                  <CardDescription>New cases vs resolved cases over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="cases" stroke="#1a365d" strokeWidth={2} name="New Cases" />
                        <Line type="monotone" dataKey="resolved" stroke="#059669" strokeWidth={2} name="Resolved" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Cases by District */}
              <Card>
                <CardHeader>
                  <CardTitle>Cases by District</CardTitle>
                  <CardDescription>Geographic distribution of cases</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={districtData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8b1c3c" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Generate Reports</CardTitle>
                <CardDescription>Download detailed reports for analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    <span>Case Summary Report</span>
                    <span className="text-xs text-muted-foreground">PDF Format</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                    <Users className="h-6 w-6" />
                    <span>Personnel Performance</span>
                    <span className="text-xs text-muted-foreground">Excel Format</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                    <Calendar className="h-6 w-6" />
                    <span>Hearing Schedule</span>
                    <span className="text-xs text-muted-foreground">Calendar Export</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
