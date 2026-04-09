'use client'

import { useAuth } from '@/lib/auth/context'
import { criminalCases } from '@/lib/cms-data/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Users, Search, Eye, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { useState } from 'react'

const custodyColors: Record<string, string> = {
  in_custody: 'bg-red-100 text-red-800',
  released_on_bail: 'bg-yellow-100 text-yellow-800',
  released: 'bg-green-100 text-green-800',
  at_large: 'bg-orange-100 text-orange-800',
}

export default function SuspectsPage() {
  const { user, isLoading } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  if (!user) {
    redirect('/login')
  }

  // Get all suspects from all cases
  const allSuspects = criminalCases.flatMap(c => 
    c.suspects.map(suspect => ({
      ...suspect,
      caseId: c.id,
      caseNumber: c.caseNumber,
      crimeType: c.fir.crimeType,
    }))
  )

  const filteredSuspects = allSuspects.filter(suspect => 
    suspect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    suspect.caseNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const inCustody = allSuspects.filter(s => s.custodyStatus === 'in_custody')
  const atLarge = allSuspects.filter(s => s.custodyStatus === 'at_large')
  const onBail = allSuspects.filter(s => s.custodyStatus === 'released_on_bail')

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Suspects</h1>
        <p className="text-muted-foreground">Manage suspects and custody status</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Suspects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{allSuspects.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Custody</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{inCustody.length}</div>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">At Large</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span className="text-2xl font-bold text-orange-600">{atLarge.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">On Bail</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{onBail.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Suspect Registry</CardTitle>
          <CardDescription>All suspects in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search suspects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Case</TableHead>
                <TableHead>Crime Type</TableHead>
                <TableHead>Age/Gender</TableHead>
                <TableHead>Custody Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuspects.map((suspect) => (
                <TableRow key={`${suspect.caseId}-${suspect.id}`}>
                  <TableCell className="font-medium">{suspect.name}</TableCell>
                  <TableCell>
                    <Link href={`/dashboard/cases/${suspect.caseId}`} className="text-primary hover:underline">
                      {suspect.caseNumber}
                    </Link>
                  </TableCell>
                  <TableCell>{suspect.crimeType}</TableCell>
                  <TableCell>
                    {suspect.age || 'Unknown'} / {suspect.gender || 'Unknown'}
                  </TableCell>
                  <TableCell>
                    <Badge className={custodyColors[suspect.custodyStatus] || 'bg-gray-100 text-gray-800'}>
                      {suspect.custodyStatus.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/cases/${suspect.caseId}`}>
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
