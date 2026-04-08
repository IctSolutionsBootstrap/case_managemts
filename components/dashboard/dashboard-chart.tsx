'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { useI18n } from '@/lib/i18n/context'
import { dashboardStats } from '@/lib/mock-data'

const chartConfig = {
  count: {
    label: 'Complaints',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

export function DashboardChart() {
  const { locale } = useI18n()

  const monthLabels: Record<string, { en: string; am: string }> = {
    Meskerem: { en: 'Meskerem', am: 'መስከረም' },
    Tikimt: { en: 'Tikimt', am: 'ጥቅምት' },
    Hidar: { en: 'Hidar', am: 'ህዳር' },
    Tahsas: { en: 'Tahsas', am: 'ታህሳስ' },
    Tir: { en: 'Tir', am: 'ጥር' },
    Yekatit: { en: 'Yekatit', am: 'የካቲት' },
    Megabit: { en: 'Megabit', am: 'መጋቢት' },
  }

  const chartData = dashboardStats.complaintsTrend.map(item => ({
    month: monthLabels[item.month]?.[locale === 'am' ? 'am' : 'en'] || item.month,
    count: item.count,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {locale === 'am' ? 'የአቤቱታ አዝማሚያ' : 'Complaints Trend'}
        </CardTitle>
        <CardDescription>
          {locale === 'am' ? 'ወርሃዊ የአቤቱታ ስርጭት' : 'Monthly complaint distribution'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
                tick={{ fill: 'var(--muted-foreground)' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
                tick={{ fill: 'var(--muted-foreground)' }}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="var(--chart-1)"
                strokeWidth={2}
                fill="url(#colorCount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
