'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    label: string
  }
  className?: string
  iconColor?: string
  selected?: boolean
  onClick?: () => void
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  className,
  iconColor = 'bg-primary/10 text-primary',
  selected = false,
  onClick,
}: StatCardProps) {
  const isPositive = trend && trend.value >= 0
  
  return (
    <Card 
      className={cn(
        'relative overflow-hidden transition-all',
        selected && 'ring-2 ring-primary',
        onClick && 'cursor-pointer hover:shadow-md',
        className
      )}
      onClick={onClick}
    >
      {selected && (
        <div className="absolute right-3 top-3">
          <div className="size-2 rounded-full bg-primary animate-pulse" />
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {title}
            </span>
            <span className="text-2xl font-bold tracking-tight">
              {value}
            </span>
            {trend && (
              <div className="flex items-center gap-1 text-xs">
                {isPositive ? (
                  <ArrowUpRight className="size-3 text-success" />
                ) : (
                  <ArrowDownRight className="size-3 text-destructive" />
                )}
                <span className={isPositive ? 'text-success' : 'text-destructive'}>
                  {isPositive ? '+' : ''}{trend.value}%
                </span>
                <span className="text-muted-foreground">{trend.label}</span>
              </div>
            )}
          </div>
          <div className={cn('flex size-10 items-center justify-center rounded-lg', iconColor)}>
            <Icon className="size-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
