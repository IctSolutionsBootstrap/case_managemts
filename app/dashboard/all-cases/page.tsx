'use client'

import { useEffect, useState } from 'react'
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
import { criminalCases } from '@/lib/cms-data/mock-data'
import { Search, Filter, Eye, FileText, ArrowUpDown, Building2 } from 'lucide-react'
import { format } from 'date-fns'
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
  'remand': 'bg-warning',
}

export default function AllCasesPage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
    if (!isLoading && user && user.role !== 'bureau_admin') {
      router.push('/dashboard')
    }
  }, [user, isLoading, isAuthenticated, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Filter cases
  const filteredCases = criminalCases
    .filter(c => {
      const matchesSearch = c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.fir.firNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.fir.crimeDescription.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
    })

  return (
    <SidebarProvider>
      <RoleSidebar />
      <SidebarInset>
        <DashboardHeader 
          title="Global Case Oversight" 
          titleAm="አጠቃላይ የጉዳይ ቁጥጥር" 
        />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="space-y-6 max-w-[1600px] mx-auto">
            
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                  <Building2 className="size-8 text-primary" />
                  All Regional Cases
                </h1>
                <p className="text-muted-foreground mt-1 text-lg">
                  Complete view of every criminal case across all districts and departments.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <FileText className="size-4" />
                  Generate Archive Report
                </Button>
              </div>
            </div>

            {/* Filters Bar */}
            <Card className="border-none shadow-sm bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by Case ID, FIR, or Description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-background"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[220px] bg-background">
                      <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="under_investigation">Investigation</SelectItem>
                      <SelectItem value="remand">Remand</SelectItem>
                      <SelectItem value="prosecution_review">Prosecution</SelectItem>
                      <SelectItem value="trial">Trial</SelectItem>
                      <SelectItem value="execution">Execution</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="bg-background shrink-0"
                    onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Main Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="py-4 px-6">Case Number</TableHead>
                      <TableHead>Crime Type</TableHead>
                      <TableHead>Current Status</TableHead>
                      <TableHead>Assigned Dept</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Filed Date</TableHead>
                      <TableHead className="text-right px-6">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCases.map((c) => (
                      <TableRow key={c.id} className="hover:bg-muted/20">
                        <TableCell className="font-mono text-sm py-4 px-6">{c.caseNumber}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {c.fir.crimeType.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-2">
                            <span className={`size-2 rounded-full ${statusColors[c.status] || 'bg-gray-400'}`} />
                            <span className="text-sm font-medium capitalize">
                              {c.status.replace(/_/g, ' ')}
                            </span>
                          </span>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-foreground">
                            {c.status === 'under_investigation' ? 'Police' :
                             c.status === 'prosecution_review' ? 'Prosecution' :
                             ['trial', 'remand'].includes(c.status) ? 'Court' : 'Correctional'}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary"
                            className={
                              c.status === 'remand' ? 'bg-warning/10 text-warning-foreground border-warning/20' :
                              c.status === 'trial' ? 'bg-primary/10 text-primary border-primary/20' : ''
                            }
                          >
                            Normal
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {format(new Date(c.createdAt), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="text-right px-6">
                          <Link href={`/dashboard/cases/${c.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredCases.length === 0 && (
                  <div className="py-20 text-center">
                    <p className="text-muted-foreground">No cases found matching your filters.</p>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
