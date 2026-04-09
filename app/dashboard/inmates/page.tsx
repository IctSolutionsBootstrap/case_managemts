'use client'

import { useAuth } from '@/lib/auth/context'
import { inmates, criminalCases } from '@/lib/cms-data/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Users, Search, Eye, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import { format, differenceInDays } from 'date-fns'
import { redirect } from 'next/navigation'
import { useState } from 'react'

const statusColors: Record<string, string> = {
  pre_trial: 'bg-yellow-100 text-yellow-800',
  serving: 'bg-blue-100 text-blue-800', // Corrected from serving_sentence
  awaiting_transfer: 'bg-purple-100 text-purple-800',
  released: 'bg-green-100 text-green-800',
}

export default function InmatesPage() {
  const { user, isLoading } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  if (!user) {
    redirect('/login')
  }

  // Map inmates to include case info
  const inmateData = inmates.map(inmate => {
    const caseData = criminalCases.find(c => c.id === inmate.caseId)
    return { ...inmate, case: caseData }
  })

  const filteredInmates = inmateData.filter(inmate => 
    (inmate.suspect?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (inmate.inmateNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (inmate.case?.caseNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const currentInmates = inmateData.filter(i => i.status !== 'released')
  const preTrialInmates = inmateData.filter(i => i.status === 'pre_trial')
  const servingSentence = inmateData.filter(i => i.status === 'serving_sentence')

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Inmates</h1>
        <p className="text-muted-foreground">Manage prison inmates and detainees</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Inmates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{currentInmates.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pre-Trial Detention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{preTrialInmates.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Serving Sentence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{servingSentence.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Releases This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {inmateData.filter(i => {
                if (!i.releaseDate) return false
                const releaseDate = new Date(i.releaseDate)
                const now = new Date()
                return releaseDate.getMonth() === now.getMonth() && 
                       releaseDate.getFullYear() === now.getFullYear() &&
                       releaseDate >= now
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inmate Registry</CardTitle>
          <CardDescription>All inmates in the facility</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search inmates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Inmate Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Case</TableHead>
                <TableHead>Admission Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time Served</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInmates.map((inmate) => (
                <TableRow key={inmate.id}>
                  <TableCell className="font-medium">{inmate.inmateNumber}</TableCell>
                  <TableCell>{inmate.suspect?.fullName || 'Unknown'}</TableCell>
                  <TableCell>
                    <Link href={`/dashboard/cases/${inmate.caseId}`} className="text-primary hover:underline">
                      {inmate.case?.caseNumber || inmate.caseId}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {format(new Date(inmate.admissionDate), 'MMM d, yyyy')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[inmate.status]}>
                      {inmate.status.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {differenceInDays(new Date(), new Date(inmate.admissionDate))} days
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/cases/${inmate.caseId}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
