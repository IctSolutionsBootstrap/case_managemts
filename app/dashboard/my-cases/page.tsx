'use client'

import { useAuth } from '@/lib/auth/context'
import { criminalCases } from '@/lib/cms-data/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Eye, FileText, Calendar } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { redirect } from 'next/navigation'

const statusColors: Record<string, string> = {
  fir_registered: 'bg-blue-100 text-blue-800',
  under_investigation: 'bg-yellow-100 text-yellow-800',
  investigation_complete: 'bg-orange-100 text-orange-800',
  sent_to_prosecutor: 'bg-purple-100 text-purple-800',
  under_prosecution_review: 'bg-indigo-100 text-indigo-800',
  charges_filed: 'bg-pink-100 text-pink-800',
  awaiting_trial: 'bg-cyan-100 text-cyan-800',
  in_trial: 'bg-amber-100 text-amber-800',
  sentenced: 'bg-red-100 text-red-800',
  acquitted: 'bg-green-100 text-green-800',
  case_closed: 'bg-gray-100 text-gray-800',
}

export default function MyCasesPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  if (!user) {
    redirect('/login')
  }

  // Filter cases based on user role
  const myCases = criminalCases.filter(c => {
    switch (user.role) {
      case 'police':
        return c.assignedOfficer === user.id
      case 'prosecutor':
        return c.assignedProsecutor === user.id
      case 'judge':
        return c.assignedJudge === user.id
      case 'lawyer':
        return c.assignedLawyer === user.id
      default:
        return false
    }
  })

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Cases</h1>
        <p className="text-muted-foreground">Cases assigned to you</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myCases.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {myCases.filter(c => !['case_closed', 'acquitted'].includes(c.status)).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">With Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {myCases.filter(c => c.legalTimers.some(t => t.remainingHours < 48)).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Cases</CardTitle>
          <CardDescription>All cases currently assigned to you</CardDescription>
        </CardHeader>
        <CardContent>
          {myCases.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No cases assigned to you yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case Number</TableHead>
                  <TableHead>Crime Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Filed Date</TableHead>
                  <TableHead>Deadlines</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myCases.map((caseItem) => (
                  <TableRow key={caseItem.id}>
                    <TableCell className="font-medium">{caseItem.caseNumber}</TableCell>
                    <TableCell>{caseItem.fir.crimeType}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[caseItem.status] || 'bg-gray-100 text-gray-800'}>
                        {caseItem.status.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(caseItem.createdAt), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      {caseItem.legalTimers.filter(t => t.remainingHours < 48).length > 0 ? (
                        <Badge variant="destructive">
                          {caseItem.legalTimers.filter(t => t.remainingHours < 48).length} urgent
                        </Badge>
                      ) : (
                        <Badge variant="outline">On track</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/cases/${caseItem.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
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
