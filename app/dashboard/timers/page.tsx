'use client'

import { useAuth } from '@/lib/auth/context'
import { criminalCases } from '@/lib/cms-data/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Clock, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default function TimersPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  if (!user) {
    redirect('/login')
  }

  // Get all timers from all cases
  const allTimers = criminalCases.flatMap(c => 
    c.legalTimers.map(timer => ({
      ...timer,
      caseId: c.id,
      caseNumber: c.caseNumber,
      crimeType: c.fir.crimeType,
    }))
  )

  const violatedTimers = allTimers.filter(t => t.isViolated)
  const urgentTimers = allTimers.filter(t => !t.isViolated && t.remainingHours < 24)
  const warningTimers = allTimers.filter(t => !t.isViolated && t.remainingHours >= 24 && t.remainingHours < 48)
  const onTrackTimers = allTimers.filter(t => !t.isViolated && t.remainingHours >= 48)

  const getTimerProgress = (timer: typeof allTimers[0]) => {
    if (timer.isViolated) return 100
    const totalHours = timer.maxHours
    const elapsed = totalHours - timer.remainingHours
    return Math.min(100, (elapsed / totalHours) * 100)
  }

  const formatRemainingTime = (hours: number) => {
    if (hours < 0) return 'Violated'
    if (hours < 24) return `${Math.floor(hours)}h ${Math.floor((hours % 1) * 60)}m`
    return `${Math.floor(hours / 24)}d ${Math.floor(hours % 24)}h`
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Legal Timers</h1>
        <p className="text-muted-foreground">Monitor case deadlines and legal time limits</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Violated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-2xl font-bold text-red-600">{violatedTimers.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Urgent (&lt;24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <span className="text-2xl font-bold text-orange-600">{urgentTimers.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">Warning (&lt;48h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-600">{warningTimers.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800">On Track</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{onTrackTimers.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {violatedTimers.length > 0 && (
        <Card className="border-red-300">
          <CardHeader>
            <CardTitle className="text-red-800">Violated Deadlines</CardTitle>
            <CardDescription>These cases have exceeded their legal time limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {violatedTimers.map((timer, index) => (
              <div key={`${timer.caseId}-${timer.type}-${index}`} className="rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <Link href={`/dashboard/cases/${timer.caseId}`} className="font-semibold text-red-800 hover:underline">
                      {timer.caseNumber}
                    </Link>
                    <p className="text-sm text-red-600">{timer.crimeType}</p>
                  </div>
                  <Badge variant="destructive">{timer.type.replace(/_/g, ' ')}</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-red-600">Time Limit: {timer.maxHours}h</span>
                    <span className="text-red-800 font-medium">VIOLATED</span>
                  </div>
                  <Progress value={100} className="h-2 bg-red-200" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {urgentTimers.length > 0 && (
        <Card className="border-orange-300">
          <CardHeader>
            <CardTitle className="text-orange-800">Urgent - Less than 24 Hours</CardTitle>
            <CardDescription>These deadlines require immediate attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {urgentTimers.map((timer, index) => (
              <div key={`${timer.caseId}-${timer.type}-${index}`} className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <Link href={`/dashboard/cases/${timer.caseId}`} className="font-semibold text-orange-800 hover:underline">
                      {timer.caseNumber}
                    </Link>
                    <p className="text-sm text-orange-600">{timer.crimeType}</p>
                  </div>
                  <Badge className="bg-orange-600">{timer.type.replace(/_/g, ' ')}</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-orange-600">Time Limit: {timer.maxHours}h</span>
                    <span className="text-orange-800 font-medium">{formatRemainingTime(timer.remainingHours)} remaining</span>
                  </div>
                  <Progress value={getTimerProgress(timer)} className="h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Active Timers</CardTitle>
          <CardDescription>Complete list of all case deadlines</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {allTimers.filter(t => !t.isViolated).map((timer, index) => (
            <div key={`${timer.caseId}-${timer.type}-${index}`} className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <Link href={`/dashboard/cases/${timer.caseId}`} className="font-semibold hover:underline">
                    {timer.caseNumber}
                  </Link>
                  <p className="text-sm text-muted-foreground">{timer.crimeType}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{timer.type.replace(/_/g, ' ')}</Badge>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/cases/${timer.caseId}`}>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Time Limit: {timer.maxHours}h</span>
                  <span className={timer.remainingHours < 48 ? 'text-orange-600 font-medium' : 'text-muted-foreground'}>
                    {formatRemainingTime(timer.remainingHours)} remaining
                  </span>
                </div>
                <Progress value={getTimerProgress(timer)} className="h-2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
