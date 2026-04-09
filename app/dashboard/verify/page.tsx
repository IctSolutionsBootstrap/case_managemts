'use client'

import { useState } from 'react'
import { 
  FileSearch, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Clock, 
  ShieldCheck,
  Filter,
  ArrowRight,
  FileText,
  AlertCircle
} from 'lucide-react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { RoleSidebar } from '@/components/dashboard/role-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { useI18n } from '@/lib/i18n/context'
import { useAuth } from '@/lib/auth/context'
import { mockDocuments } from '@/lib/cms-data/mock-data'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import Link from 'next/link'

const docTypeColors: Record<string, string> = {
  fir_report: 'bg-blue-100 text-blue-800 border-blue-200',
  charge_sheet: 'bg-purple-100 text-purple-800 border-purple-200',
  witness_statement: 'bg-green-100 text-green-800 border-green-200',
  evidence_report: 'bg-orange-100 text-orange-800 border-orange-200',
  investigation_report: 'bg-indigo-100 text-indigo-800 border-indigo-200',
}

export default function VerifyDocumentsPage() {
  const { locale } = useI18n()
  const { user } = useAuth()
  
  // Local state to simulate verification actions
  const [documents, setDocuments] = useState(mockDocuments.filter(d => !d.isVerified))
  const [processingId, setProcessingId] = useState<string | null>(null)

  const handleVerify = (id: string) => {
    setProcessingId(id)
    setTimeout(() => {
      setDocuments(prev => prev.filter(d => d.id !== id))
      setProcessingId(null)
    }, 800)
  }

  const handleReject = (id: string) => {
    setProcessingId(id)
    setTimeout(() => {
      setDocuments(prev => prev.filter(d => d.id !== id))
      setProcessingId(null)
    }, 800)
  }

  return (
    <SidebarProvider>
      <RoleSidebar />
      <SidebarInset>
        <DashboardHeader 
          title="Pending Verification" 
          titleAm="ለማረጋገጫ የሚጠበቁ" 
        />
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                  <FileSearch className="size-8 text-primary" />
                  {locale === 'am' ? 'የሰነድ ማረጋገጫ' : 'Document Verification'}
                </h1>
                <p className="text-muted-foreground mt-1 text-lg">
                  {locale === 'am' 
                    ? `በመጠባበቅ ላይ ያሉ ${documents.length} ሰነዶች` 
                    : `Review and verify the metadata of ${documents.length} pending legal documents.`}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Filter className="size-4" /> Filter
                </Button>
                <Badge variant="outline" className="px-4 py-2 text-sm font-semibold bg-primary/5 text-primary border-primary/20">
                  {documents.length} Actions Required
                </Badge>
              </div>
            </div>

            {/* Verification Queue */}
            <Card className="border-none shadow-xl overflow-hidden bg-white/50 backdrop-blur-sm">
              <CardContent className="p-0">
                {documents.length > 0 ? (
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="py-4 pl-6">Document Details</TableHead>
                        <TableHead>Source Case</TableHead>
                        <TableHead>Contributor</TableHead>
                        <TableHead>Uploaded At</TableHead>
                        <TableHead className="text-right pr-6">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.map((doc) => (
                        <TableRow key={doc.id} className="group hover:bg-muted/30 transition-colors">
                          <TableCell className="py-4 pl-6">
                            <div className="flex items-start gap-3">
                              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <FileText className="size-5 text-primary" />
                              </div>
                              <div className="space-y-1">
                                <p className="font-bold text-foreground leading-none">{doc.title}</p>
                                <Badge variant="outline" className={cn("text-[10px] h-5 px-1.5 font-medium uppercase tracking-wider", docTypeColors[doc.documentType] || 'bg-gray-100')}>
                                  {doc.documentType.replace(/_/g, ' ')}
                                </Badge>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <span className="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                {doc.caseId.toUpperCase()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-0.5">
                              <p className="text-sm font-medium">{doc.uploadedBy}</p>
                              <p className="text-xs text-muted-foreground font-medium uppercase tracking-tight">
                                {doc.uploadedByRole}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="size-4 opacity-70" />
                              {format(new Date(doc.uploadedAt), 'MMM d, p')}
                            </div>
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="sm" className="h-9 gap-2">
                                <Eye className="size-4" /> Preview
                              </Button>
                              <div className="h-4 w-px bg-border mx-1" />
                              <Button 
                                size="sm" 
                                className="h-9 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-100"
                                onClick={() => handleVerify(doc.id)}
                                disabled={processingId === doc.id}
                              >
                                {processingId === doc.id ? 'Processing...' : <><CheckCircle className="size-4 mr-2" /> Verify</>}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-9 border-destructive/20 text-destructive hover:bg-destructive/10"
                                onClick={() => handleReject(doc.id)}
                                disabled={processingId === doc.id}
                              >
                                <XCircle className="size-4 mr-2" /> Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
                    <div className="size-20 rounded-full bg-green-50 flex items-center justify-center mb-6">
                      <ShieldCheck className="size-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold">Queue Empty</h2>
                    <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                      All submitted documents have been verified. There are no pending cases requiring your attention at this time.
                    </p>
                    <Button variant="outline" className="mt-8 gap-2" asChild>
                      <Link href="/dashboard/documents">
                        View Repository <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Protocol Notice */}
            <Card className="border-none shadow-md bg-gradient-to-r from-primary/5 to-transparent">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="size-6 text-primary shrink-0 mt-1" />
                  <div className="space-y-1">
                    <h3 className="font-bold">Verification Protocol</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      As a Document Officer, you are responsible for ensuring that all digital files match the case metadata. 
                      Verified documents become part of the official legal record and are used by prosecutors and judges during court proceedings.
                      Please preview each file to ensure legibility and correct categorization before clicking verify.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
