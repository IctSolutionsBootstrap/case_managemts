'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import { RoleSidebar } from '@/components/dashboard/role-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend,
  AreaChart,
  Area
} from 'recharts'
import { 
  Download, 
  TrendingUp, 
  Users, 
  Scale, 
  Calendar, 
  Briefcase,
  Activity,
  Filter,
  Shield
} from 'lucide-react'
import { criminalCases, getBureauStats } from '@/lib/cms-data/mock-data'
import { useI18n } from '@/lib/i18n/context'

const COLORS = ['#1a365d', '#8b1c3c', '#059669', '#d97706', '#7c3aed', '#0ea5e9']

export default function AnalyticsPage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const { locale } = useI18n()
  const [period, setPeriod] = useState('quarter')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
    // Only bureau admin can view this
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

  const bureauStats = getBureauStats()

  // Process data for charts
  const crimeTypeData = criminalCases.reduce((acc, c) => {
    const type = c.fir.crimeType.replace(/_/g, ' ')
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const pieData = Object.entries(crimeTypeData).map(([name, value]) => ({ name, value }))

  const trendData = [
    { name: 'Jan', cases: 35, resolved: 28 },
    { name: 'Feb', cases: 42, resolved: 31 },
    { name: 'Mar', cases: 38, resolved: 35 },
    { name: 'Apr', cases: 55, resolved: 42 },
    { name: 'May', cases: 48, resolved: 44 },
    { name: 'Jun', cases: 62, resolved: 50 },
  ]

  const statusDistribution = [
    { stage: 'Investigation', count: criminalCases.filter(c => c.status === 'under_investigation').length },
    { stage: 'Remand', count: criminalCases.filter(c => c.status === 'remand').length },
    { stage: 'Review', count: criminalCases.filter(c => c.status === 'prosecution_review').length },
    { stage: 'Trial', count: criminalCases.filter(c => c.status === 'trial').length },
    { stage: 'Execution', count: criminalCases.filter(c => c.status === 'execution').length },
  ]

  return (
    <SidebarProvider>
      <RoleSidebar />
      <SidebarInset>
        <DashboardHeader 
          title="System Analytics" 
          titleAm="የስርዓት ትንተና" 
        />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="space-y-8 max-w-[1600px] mx-auto">
            
            {/* Header with Filters */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  {locale === 'am' ? 'የፍትህ ስርዓት ትንተና' : 'Justice System Analytics'}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {locale === 'am' ? 'የክልሉ የፍትህ አፈጻጸም መረጃ' : 'Performance and trends for the regional justice sector'}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-[180px] bg-card border-border">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Last 30 Days</SelectItem>
                    <SelectItem value="quarter">Last Quarter</SelectItem>
                    <SelectItem value="year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  {locale === 'am' ? 'ሪፖርት አውርድ' : 'Export Report'}
                </Button>
              </div>
            </div>

            {/* Top High-Impact Metrics */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="relative overflow-hidden border-none bg-primary text-primary-foreground shadow-lg">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <Activity className="size-20" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">
                    {locale === 'am' ? 'አጠቃላይ የጉዳይ ብዛት' : 'Total Cases'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{criminalCases.length}</div>
                  <p className="text-xs mt-2 opacity-80 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {locale === 'am' ? 'የመፍታት መጠን' : 'Resolution Rate'}
                  </CardTitle>
                  <Scale className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">84.2%</div>
                  <div className="mt-4 h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-success w-[84%]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {locale === 'am' ? 'አድካሚ ጉዳዮች' : 'Pending Review'}
                  </CardTitle>
                  <Briefcase className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">156</div>
                  <p className="text-xs mt-2 text-muted-foreground">Across all departments</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {locale === 'am' ? 'የህግ ጥሰቶች' : 'Legal Violations'}
                  </CardTitle>
                  <Shield className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-destructive">{bureauStats.legalViolations}</div>
                  <p className="text-xs mt-2 text-muted-foreground">Requiring immediate attention</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Charts Grid */}
            <div className="grid gap-8 lg:grid-cols-2">
              
              {/* Case Volume Trend */}
              <Card className="shadow-sm border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>{locale === 'am' ? 'የጉዳይ መጠን ሂደት' : 'Case Volume Trend'}</CardTitle>
                  <CardDescription>Monthly comparison of new vs resolved cases</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1a365d" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#1a365d" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip />
                      <Legend verticalAlign="top" height={36}/>
                      <Area 
                        type="monotone" 
                        dataKey="cases" 
                        stroke="#1a365d" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorCases)" 
                        name="New Cases"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="resolved" 
                        stroke="#22c55e" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorResolved)" 
                        name="Resolved Cases"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Crime Type Distribution */}
              <Card className="shadow-sm border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>{locale === 'am' ? 'የወንጀል አይነቶች ስርጭት' : 'Crime Type Distribution'}</CardTitle>
                  <CardDescription>Breakdown of cases by category</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend 
                        layout="vertical" 
                        align="right" 
                        verticalAlign="middle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Stage Throughput */}
              <Card className="shadow-sm border-border lg:col-span-2 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>{locale === 'am' ? 'የጉዳይ ሂደት ደረጃዎች' : 'Workflow Stage Throughput'}</CardTitle>
                  <CardDescription>Number of active cases at each legal milestone</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis 
                        dataKey="stage" 
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}}/>
                      <Bar 
                        dataKey="count" 
                        fill="#1a365d" 
                        radius={[6, 6, 0, 0]}
                        barSize={60}
                        name="Active Cases"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

            </div>

            {/* Quick Actions / Reports */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
               <div className="p-6 rounded-xl border border-dashed border-border flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-primary/5 transition-all group">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Download className="h-6 w-6 text-primary" />
                </div>
                <div className="text-center">
                  <div className="font-semibold">Quarterly Compliance</div>
                  <div className="text-xs text-muted-foreground text-center">Last generated Apr 1, 2026</div>
                </div>
              </div>
              
              <div className="p-6 rounded-xl border border-dashed border-border flex flex-col items-center justify-center gap-4 hover:border-blue-500 hover:bg-blue-50 transition-all group">
                <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-center">
                  <div className="font-semibold font-medium">Personnel Performance</div>
                  <div className="text-xs text-muted-foreground text-center">Officer & Prosecutor metrics</div>
                </div>
              </div>

              <div className="p-6 rounded-xl border border-dashed border-border flex flex-col items-center justify-center gap-4 hover:border-orange-500 hover:bg-orange-50 transition-all group">
                <div className="size-12 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <Filter className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-center">
                  <div className="font-semibold font-medium">Deep Insights</div>
                  <div className="text-xs text-muted-foreground text-center">Custom data exploration</div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
