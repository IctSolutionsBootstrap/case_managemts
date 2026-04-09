'use client'

import { useAuth } from '@/lib/auth/context'
import { mockHearings, criminalCases } from '@/lib/cms-data/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Calendar, Clock, MapPin, Eye } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { redirect } from 'next/navigation'

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  postponed: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function HearingsPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  if (!user) {
    redirect('/login')
  }

  // Get hearings based on user role
  const hearings = mockHearings.map(hearing => {
    const caseData = criminalCases.find(c => c.id === hearing.caseId)
    return { ...hearing, case: caseData }
  })

  const upcomingHearings = hearings.filter(h => h.status === 'scheduled')
  const completedHearings = hearings.filter(h => h.status === 'completed')

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Hearings</h1>
        <p className="text-muted-foreground">Manage court hearings and schedules</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Hearings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hearings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{upcomingHearings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedHearings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {hearings.filter(h => {
                const hearingDate = new Date(h.scheduledDate)
                const now = new Date()
                const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
                return hearingDate >= now && hearingDate <= weekFromNow
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Hearings</CardTitle>
          <CardDescription>Scheduled court hearings</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingHearings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No upcoming hearings scheduled.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Court Room</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingHearings.map((hearing) => (
                  <TableRow key={hearing.id}>
                    <TableCell className="font-medium">
                      {hearing.case?.caseNumber || 'Unknown'}
                    </TableCell>
                    <TableCell className="capitalize">{hearing.hearingType}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {format(new Date(hearing.scheduledDate), 'MMM d, yyyy')}
                        <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                        {format(new Date(hearing.scheduledDate), 'h:mm a')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {hearing.courtRoom}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[hearing.status]}>
                        {hearing.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/cases/${hearing.caseId}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Past Hearings</CardTitle>
          <CardDescription>Completed court hearings</CardDescription>
        </CardHeader>
        <CardContent>
          {completedHearings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No completed hearings yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedHearings.map((hearing) => (
                  <TableRow key={hearing.id}>
                    <TableCell className="font-medium">
                      {hearing.case?.caseNumber || 'Unknown'}
                    </TableCell>
                    <TableCell className="capitalize">{hearing.hearingType}</TableCell>
                    <TableCell>{format(new Date(hearing.scheduledDate), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{hearing.outcome || 'No outcome recorded'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/cases/${hearing.caseId}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
