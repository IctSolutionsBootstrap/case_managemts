'use client'

import Link from 'next/link'
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  Timer,
  Send,
  Search,
  Briefcase,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n/context'
import { dashboardStats } from '@/lib/mock-data'
import { DashboardChart } from './dashboard-chart'

export function DashboardContent() {
  const { t, locale } = useI18n()

  const statsCards = [
    {
      titleKey: 'dashboard.totalComplaints' as const,
      value: dashboardStats.totalComplaints,
      icon: FileText,
      trend: '+12%',
      trendUp: true,
      color: 'bg-primary/10 text-primary',
      borderColor: 'border-primary/20',
    },
    {
      titleKey: 'dashboard.pendingCases' as const,
      value: dashboardStats.pendingCases,
      icon: Clock,
      trend: '-5%',
      trendUp: false,
      color: 'bg-warning/10 text-warning-foreground',
      borderColor: 'border-warning/20',
    },
    {
      titleKey: 'dashboard.resolvedCases' as const,
      value: dashboardStats.resolvedCases,
      icon: CheckCircle2,
      trend: '+18%',
      trendUp: true,
      color: 'bg-success/10 text-success-foreground',
      borderColor: 'border-success/20',
    },
    {
      titleKey: 'dashboard.avgResolutionTime' as const,
      value: `${dashboardStats.avgResolutionDays}`,
      suffix: t('dashboard.days'),
      icon: Timer,
      trend: '-2 days',
      trendUp: true,
      color: 'bg-info/10 text-info-foreground',
      borderColor: 'border-info/20',
    },
  ]

  const quickActions = [
    {
      titleKey: 'complaints.submit' as const,
      descriptionKey: 'nav.submitComplaint' as const,
      href: '/complaints/submit',
      icon: Send,
    },
    {
      titleKey: 'complaints.track' as const,
      descriptionKey: 'nav.trackComplaint' as const,
      href: '/complaints/track',
      icon: Search,
    },
    {
      titleKey: 'services.title' as const,
      descriptionKey: 'nav.services' as const,
      href: '/services',
      icon: Briefcase,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
        <h2 className="text-2xl font-bold text-foreground">
          {t('dashboard.welcome')}
        </h2>
        <p className="mt-1 text-muted-foreground">
          {t('app.description')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.titleKey} className={`border ${stat.borderColor} relative overflow-hidden`}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className={`rounded-lg p-2.5 ${stat.color}`}>
                  <stat.icon className="size-5" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trendUp ? 'text-success-foreground' : 'text-destructive'
                }`}>
                  {stat.trendUp ? (
                    <TrendingUp className="size-3" />
                  ) : (
                    <TrendingDown className="size-3" />
                  )}
                  {stat.trend}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">{t(stat.titleKey)}</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {stat.value}
                  {stat.suffix && <span className="ml-1 text-sm font-normal text-muted-foreground">{stat.suffix}</span>}
                </p>
              </div>
            </CardContent>
            {/* Decorative element */}
            <div className="absolute -right-4 -bottom-4 size-24 rounded-full bg-primary/5" />
          </Card>
        ))}
      </div>

      {/* Charts and Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart Section */}
        <div className="lg:col-span-2">
          <DashboardChart />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.quickActions')}</CardTitle>
            <CardDescription>
              {locale === 'am' ? 'ፈጣን ተግባራት' : 'Get started quickly'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <div className="group flex items-center gap-4 rounded-lg border border-border p-4 transition-all hover:border-primary/50 hover:bg-accent">
                  <div className="rounded-lg bg-primary/10 p-2.5 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <action.icon className="size-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{t(action.titleKey)}</p>
                    <p className="text-sm text-muted-foreground">{t(action.descriptionKey)}</p>
                  </div>
                  <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
            <CardDescription>
              {locale === 'am' ? 'የቅርብ ጊዜ ተግባራት' : 'Latest updates and activities'}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            {t('dashboard.viewAll')}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardStats.recentActivity.map((activity, index) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 rounded-lg border border-border p-4"
              >
                <div className={`size-2 rounded-full ${
                  activity.type === 'complaint_submitted' ? 'bg-primary' :
                  activity.type === 'case_resolved' ? 'bg-success' :
                  'bg-info'
                }`} />
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {activity.type === 'complaint_submitted' && (locale === 'am' ? 'አዲስ አቤቱታ ገብቷል' : 'New Complaint Submitted')}
                    {activity.type === 'case_resolved' && (locale === 'am' ? 'ጉዳይ ተፈትቷል' : 'Case Resolved')}
                    {activity.type === 'hearing_scheduled' && (locale === 'am' ? 'ችሎት ተቀጥሯል' : 'Hearing Scheduled')}
                  </p>
                  <p className="text-sm text-muted-foreground">{activity.reference}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.date.toLocaleDateString(locale === 'am' ? 'am-ET' : 'en-US')}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
