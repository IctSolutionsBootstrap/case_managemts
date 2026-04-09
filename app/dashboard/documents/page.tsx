'use client'

import { useAuth } from '@/lib/auth/context'
import { mockDocuments, criminalCases } from '@/lib/cms-data/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead, TableBody as TBody, TableCell as TCell } from '@/components/ui/table'
import { FileText, Download, Eye, Search, Upload, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { redirect } from 'next/navigation'
import { useState } from 'react'

const docTypeColors: Record<string, string> = {
  fir_report: 'bg-blue-100 text-blue-800',
  charge_sheet: 'bg-purple-100 text-purple-800',
  witness_statement: 'bg-green-100 text-green-800',
  evidence_report: 'bg-orange-100 text-orange-800',
  court_order: 'bg-red-100 text-red-800',
  judgment: 'bg-indigo-100 text-indigo-800',
  appeal: 'bg-pink-100 text-pink-800',
}

export default function DocumentsPage() {
  const { user, isLoading } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  if (!user) {
    redirect('/login')
  }

  // Map documents to include case info
  const documents = mockDocuments.map(doc => {
    const caseData = criminalCases.find(c => c.id === doc.caseId)
    return { ...doc, case: caseData }
  })

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.documentType && doc.documentType.toLowerCase().includes(searchTerm.toLowerCase())) ||
    doc.case?.caseNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const verifiedDocs = documents.filter(d => d.isVerified)
  const pendingDocs = documents.filter(d => !d.isVerified)

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Documents</h1>
          <p className="text-muted-foreground">Legal documents repository</p>
        </div>
        {['police', 'prosecutor', 'document_officer'].includes(user.role) && (
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{verifiedDocs.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <span className="text-2xl font-bold text-orange-600">{pendingDocs.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {documents.filter(d => {
                const docDate = new Date(d.uploadedAt)
                const now = new Date()
                return docDate.getMonth() === now.getMonth() && docDate.getFullYear() === now.getFullYear()
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Repository</CardTitle>
          <CardDescription>All legal documents in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Case</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocs.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{doc.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={docTypeColors[doc.documentType] || 'bg-gray-100 text-gray-800'}>
                      {doc.documentType ? doc.documentType.replace(/_/g, ' ') : 'document'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`/dashboard/cases/${doc.caseId}`} className="text-primary hover:underline">
                      {doc.case?.caseNumber || doc.caseId}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{doc.uploadedBy}</p>
                      <p className="text-xs text-muted-foreground">{doc.uploadedByRole}</p>
                    </div>
                  </TableCell>
                  <TableCell>{format(new Date(doc.uploadedAt), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    {doc.isVerified ? (
                      <Badge className="bg-green-100 text-green-800">Verified</Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
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
