'use client'

import { useAuth } from '@/lib/auth/context'
import { criminalCases } from '@/lib/cms-data/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FileSearch, Search, Eye, Package, Camera, FileText } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { useState } from 'react'

const typeIcons: Record<string, React.ReactNode> = {
  physical: <Package className="h-4 w-4" />,
  digital: <FileText className="h-4 w-4" />,
  documentary: <FileText className="h-4 w-4" />,
  photographic: <Camera className="h-4 w-4" />,
}

const typeColors: Record<string, string> = {
  physical: 'bg-blue-100 text-blue-800',
  digital: 'bg-purple-100 text-purple-800',
  documentary: 'bg-orange-100 text-orange-800',
  photographic: 'bg-green-100 text-green-800',
}

export default function EvidencePage() {
  const { user, isLoading } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  if (!user) {
    redirect('/login')
  }

  // Get all evidence from all cases
  const allEvidence = criminalCases.flatMap(c => 
    c.evidence.map(ev => ({
      ...ev,
      caseId: c.id,
      caseNumber: c.caseNumber,
      crimeType: c.fir.crimeType,
    }))
  )

  const filteredEvidence = allEvidence.filter(ev => 
    ev.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ev.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ev.evidenceType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const physicalEvidence = allEvidence.filter(e => e.evidenceType === 'physical')
  const digitalEvidence = allEvidence.filter(e => e.evidenceType === 'digital')
  const documentaryEvidence = allEvidence.filter(e => e.evidenceType === 'documentary')

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Evidence</h1>
        <p className="text-muted-foreground">Manage case evidence and chain of custody</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Evidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileSearch className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{allEvidence.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Physical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{physicalEvidence.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Digital</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">{digitalEvidence.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Documentary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-600" />
              <span className="text-2xl font-bold text-orange-600">{documentaryEvidence.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evidence Repository</CardTitle>
          <CardDescription>All evidence collected across cases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search evidence..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evidence ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Case</TableHead>
                <TableHead>Collected By</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvidence.map((evidence) => (
                <TableRow key={`${evidence.caseId}-${evidence.id}`}>
                  <TableCell className="font-medium font-mono text-sm">{evidence.id}</TableCell>
                  <TableCell className="max-w-xs truncate">{evidence.description}</TableCell>
                  <TableCell>
                    <Badge className={typeColors[evidence.evidenceType] || 'bg-gray-100 text-gray-800'}>
                      <span className="mr-1">{typeIcons[evidence.evidenceType]}</span>
                      {evidence.evidenceType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`/dashboard/cases/${evidence.caseId}`} className="text-primary hover:underline">
                      {evidence.caseNumber}
                    </Link>
                  </TableCell>
                  <TableCell>{evidence.collectedBy}</TableCell>
                  <TableCell>{evidence.storageLocation}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/cases/${evidence.caseId}`}>
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
