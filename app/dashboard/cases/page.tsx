'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import { RoleSidebar } from '@/components/dashboard/role-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { mockCases } from '@/lib/cms-data/mock-data'
import { Search, Filter, Eye, FileText, Plus, ArrowUpDown } from 'lucide-react'
import { format } from 'date-fns'
import { useState } from 'react'
import Link from 'next/link'

const statusColors: Record<string, string> = {
  'under_investigation': 'bg-blue-500',
  'awaiting_prosecutor': 'bg-yellow-500',
  'prosecution_review': 'bg-orange-500',
  'charges_filed': 'bg-indigo-500',
  'awaiting_trial': 'bg-purple-500',
  'in_trial': 'bg-pink-500',
  'sentenced': 'bg-red-500',
  'serving_sentence': 'bg-red-700',
  'released': 'bg-green-500',
  'closed': 'bg-gray-500',
  'dismissed': 'bg-gray-400',
  'appealed': 'bg-amber-500',
}

export default function CasesPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Filter cases based on user role
  const getVisibleCases = () => {
    let visibleCases = [...mockCases]
    
    switch (user.role) {
      case 'police':
        visibleCases = mockCases.filter(c => 
          c.status === 'under_investigation' || 
          c.assignedPoliceId === user.id
        )
        break
      case 'prosecutor':
        visibleCases = mockCases.filter(c => 
          ['awaiting_prosecutor', 'prosecution_review', 'charges_filed', 'awaiting_trial', 'in_trial'].includes(c.status) ||
          c.assignedProsecutorId === user.id
        )
        break
      case 'judge':
        visibleCases = mockCases.filter(c => 
          ['awaiting_trial', 'in_trial', 'sentenced', 'appealed'].includes(c.status) ||
          c.assignedJudgeId === user.id
        )
        break
      case 'prison':
        visibleCases = mockCases.filter(c => 
          ['sentenced', 'serving_sentence', 'released'].includes(c.status)
        )
        break
      case 'lawyer':
        visibleCases = mockCases.filter(c => c.assignedLawyerId === user.id)
        break
      case 'community':
        visibleCases = mockCases.filter(c => c.isPublic === true)
        break
      case 'bureau':
      case 'document_officer':
        // Full access
        break
    }

    // Apply search filter
    if (searchTerm) {
      visibleCases = visibleCases.filter(c => 
        c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      visibleCases = visibleCases.filter(c => c.status === statusFilter)
    }

    // Apply sort
    visibleCases.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
    })

    return visibleCases
  }

  const cases = getVisibleCases()
  const canCreateCase = ['police', 'bureau', 'document_officer'].includes(user.role)

  return (
    <SidebarProvider>
      <RoleSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Cases</h1>
                <p className="text-muted-foreground">
                  {cases.length} case{cases.length !== 1 ? 's' : ''} found
                </p>
              </div>
              {canCreateCase && (
                <Button asChild>
                  <Link href="/dashboard/cases/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Register New Case
                  </Link>
                </Button>
              )}
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search cases..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="under_investigation">Under Investigation</SelectItem>
                      <SelectItem value="awaiting_prosecutor">Awaiting Prosecutor</SelectItem>
                      <SelectItem value="prosecution_review">Prosecution Review</SelectItem>
                      <SelectItem value="charges_filed">Charges Filed</SelectItem>
                      <SelectItem value="awaiting_trial">Awaiting Trial</SelectItem>
                      <SelectItem value="in_trial">In Trial</SelectItem>
                      <SelectItem value="sentenced">Sentenced</SelectItem>
                      <SelectItem value="serving_sentence">Serving Sentence</SelectItem>
                      <SelectItem value="released">Released</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Cases Table */}
            <Card>
              <CardHeader>
                <CardTitle>Case List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Case Number</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Crime Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Date Filed</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cases.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No cases found matching your criteria
                          </TableCell>
                        </TableRow>
                      ) : (
                        cases.map((caseItem) => (
                          <TableRow key={caseItem.id}>
                            <TableCell className="font-mono text-sm">
                              {caseItem.caseNumber}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {caseItem.title}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {caseItem.crimeType.replace('_', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${statusColors[caseItem.status]} text-white`}>
                                {caseItem.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  caseItem.priority === 'urgent' ? 'destructive' :
                                  caseItem.priority === 'high' ? 'default' : 'secondary'
                                }
                              >
                                {caseItem.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {format(new Date(caseItem.createdAt), 'MMM d, yyyy')}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="icon" asChild>
                                  <Link href={`/dashboard/cases/${caseItem.id}`}>
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                </Button>
                                <Button variant="ghost" size="icon" asChild>
                                  <Link href={`/dashboard/cases/${caseItem.id}/documents`}>
                                    <FileText className="h-4 w-4" />
                                  </Link>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
