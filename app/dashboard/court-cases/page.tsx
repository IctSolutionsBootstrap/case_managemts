'use client'

import { useState } from 'react'
import { 
  Gavel, 
  Search, 
  Filter, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  MoreVertical,
  ChevronRight,
  FolderOpen,
  User,
  Scale
} from 'lucide-react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { RoleSidebar } from '@/components/dashboard/role-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { useI18n } from '@/lib/i18n/context'
import { criminalCases } from '@/lib/cms-data/mock-data'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function CourtCasesPage() {
  const { locale } = useI18n()
  const [searchTerm, setSearchTerm] = useState('')
  const [isDocketDialogOpen, setIsDocketDialogOpen] = useState(false)
  const [caseList, setCaseList] = useState(criminalCases)
  
  const stats = [
    { label: locale === 'am' ? 'ገባሪ ጉዳዮች' : 'Active Docket', value: caseList.length.toString(), icon: FolderOpen, color: 'text-blue-500', bg: 'bg-blue-100' },
    { label: locale === 'am' ? 'የሚጠበቁ መደበኛ ጥያቄዎች' : 'Pending Arraignments', value: '12', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-100' },
    { label: locale === 'am' ? 'በሂደት ላይ ያሉ ሙግቶች' : 'Ongoing Trials', value: '8', icon: Gavel, color: 'text-purple-500', bg: 'bg-purple-100' },
    { label: locale === 'am' ? 'የተሰጡ ውሳኔዎች' : 'Decisions (Month)', value: '15', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-100' },
  ]

  const statusColors: Record<string, string> = {
    investigation: 'bg-blue-100 text-blue-700 border-blue-200',
    trial: 'bg-purple-100 text-purple-700 border-purple-200',
    sentencing: 'bg-amber-100 text-amber-700 border-amber-200',
    closed: 'bg-green-100 text-green-700 border-green-200',
    appealed: 'bg-red-100 text-red-700 border-red-200',
  }

  const filteredCases = caseList.filter(c => 
    c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleFinalizeRegistry = () => {
    // Simulate adding a new case
    const newCase = {
      id: `new-${Date.now()}`,
      caseNumber: `JIG-CR-2026-${Math.floor(Math.random() * 900) + 100}`,
      title: "New Registered Case vs. The State",
      caseType: "Criminal",
      status: "investigation",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: "Initial docket entry created via portal.",
      severity: "medium"
    }
    
    setCaseList([newCase, ...caseList])
    setIsDocketDialogOpen(false)
  }

  return (
    <SidebarProvider>
      <RoleSidebar />
      <SidebarInset>
        <DashboardHeader 
          title="Active Court Docket" 
          titleAm="ገባሪ የፍርድ ቤት መዝገብ" 
        />
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                  <Scale className="size-8 text-indigo-700" />
                  {locale === 'am' ? 'የፍርድ ቤት ጉዳዮች' : 'Active Court Docket'}
                </h1>
                <p className="text-muted-foreground mt-1 text-lg">
                  {locale === 'am' 
                    ? 'በፍርድ ቤት ሂደት ላይ ያሉ ጉዳዮችን ማስተዳደሪያ' 
                    : 'Manage and track criminal and civil cases through the judicial process.'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50" asChild>
                  <Link href="/dashboard/schedule">
                    <Calendar className="size-4" /> Hearing Calendar
                  </Link>
                </Button>
                <Dialog open={isDocketDialogOpen} onOpenChange={setIsDocketDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 bg-indigo-700 hover:bg-indigo-800 shadow-lg shadow-indigo-100" onClick={() => setIsDocketDialogOpen(true)}>
                      <Plus className="size-4" /> New Docket Entry
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <FolderOpen className="size-5 text-indigo-600" />
                        Initial Case Docketing
                      </DialogTitle>
                      <DialogDescription>
                        Register a new case into the judicial system and assign an initial docket number.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="caseType">Case Category</Label>
                          <Select defaultValue="criminal">
                            <SelectTrigger id="caseType">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="criminal">Criminal (High Court)</SelectItem>
                              <SelectItem value="civil">Civil Litigation</SelectItem>
                              <SelectItem value="admin">Administrative Review</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="urgency">Filing Urgency</Label>
                          <Select defaultValue="standard">
                            <SelectTrigger id="urgency">
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="emergency">Emergency / Interim</SelectItem>
                              <SelectItem value="standard">Standard Filing</SelectItem>
                              <SelectItem value="appeal">Expedited Appeal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title">Case Title (Parties)</Label>
                        <Input id="title" placeholder="e.g. State vs. John Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Preliminary Charge / Claim Summary</Label>
                        <textarea 
                          id="description" 
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Briefly describe the nature of the filing..."
                        />
                      </div>
                      <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-100">
                        <div className="flex items-start gap-3">
                          <Scale className="size-5 text-indigo-600 mt-0.5" />
                          <div className="space-y-1">
                            <p className="text-xs font-black text-indigo-900 uppercase">Automatic Allocation</p>
                            <p className="text-[11px] text-indigo-700 leading-tight">
                              Initial Arraignment date will be automatically set within 48 hours. 
                              The next available Judge will be assigned upon document verification.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDocketDialogOpen(false)}>Save as Draft</Button>
                      <Button type="button" className="bg-indigo-700 hover:bg-indigo-800" onClick={handleFinalizeRegistry}>Finalize Registry</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-4">
              {stats.map((stat, i) => (
                <Card key={i} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-4 p-5">
                      <div className={cn("size-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg)}>
                        <stat.icon className={cn("size-6", stat.color)} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Docket Table */}
            <Card className="border-none shadow-xl overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b bg-white">
                <div>
                  <CardTitle className="text-xl font-bold text-slate-800">Judicial Registry</CardTitle>
                  <CardDescription>Live tracking of cases assigned to the Jijiga High Court.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search cases..." 
                      className="pl-9 w-[250px] h-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="sm" className="h-9 gap-2">
                    <Filter className="size-4" /> Filters
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="pl-6 h-12 text-slate-700 font-bold uppercase text-[10px] tracking-wider">Case Reference</TableHead>
                      <TableHead className="h-12 text-slate-700 font-bold uppercase text-[10px] tracking-wider">Litigant/Subject</TableHead>
                      <TableHead className="h-12 text-slate-700 font-bold uppercase text-[10px] tracking-wider">Legal Status</TableHead>
                      <TableHead className="h-12 text-slate-700 font-bold uppercase text-[10px] tracking-wider">Next Hearing</TableHead>
                      <TableHead className="text-right pr-6 h-12 text-slate-700 font-bold uppercase text-[10px] tracking-wider">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCases.map((c) => (
                      <TableRow key={c.id} className="hover:bg-indigo-50/30 transition-colors border-b last:border-0 group">
                        <TableCell className="pl-6 py-4">
                          <div className="flex flex-col">
                            <Link href={`/dashboard/cases/${c.id}`} className="font-bold text-sm text-indigo-700 hover:underline">
                              {c.caseNumber}
                            </Link>
                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight mt-0.5">{c.caseType}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="size-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                              <User className="size-4" />
                            </div>
                            <div className="flex flex-col">
                              <p className="font-bold text-sm text-slate-800">{(c.title || 'Unknown Case').split(' vs ')[0]}</p>
                              <p className="text-[11px] text-muted-foreground">vs. {(c.title || '').split(' vs ')[1] || 'The State'}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("capitalize px-2 py-0.5 h-auto text-[9px] font-bold tracking-tighter rounded-md", statusColors[c.status] || 'bg-slate-100')}>
                            {c.status.replace(/_/g, ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                             <Calendar className="size-4 text-slate-400" />
                             <span className="font-semibold text-slate-700">
                               {c.status === 'trial' ? 'APR 12, 2026' : 'PENDING'}
                             </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 group-hover:text-slate-600 transition-colors hover:bg-slate-100">
                            <MoreVertical className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Grid for Guidelines and Pending */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-none shadow-lg bg-indigo-900 text-white overflow-hidden relative md:col-span-2">
                 <div className="absolute right-[-30px] bottom-[-30px] opacity-10">
                    <Scale className="size-64" />
                 </div>
                 <CardContent className="p-8">
                    <h3 className="text-2xl font-bold">Judicial Guidelines & Deadlines</h3>
                    <p className="text-indigo-200 mt-3 text-lg leading-relaxed max-w-xl">
                      As per the MoJ Decree 2025, all final judgments must be documented within **15 business days** of the last hearing. 
                      Delay notifications will be automatically triggered to the Bureau Administrator.
                    </p>
                    <div className="flex gap-4 mt-8">
                       <Button variant="secondary" className="font-bold gap-2 text-indigo-900 border-none shadow-lg">
                          Docket Manual <ChevronRight className="size-4" />
                       </Button>
                       <Button variant="outline" className="font-bold gap-2 text-white border-indigo-400 hover:bg-indigo-800">
                          Review Protocols
                       </Button>
                    </div>
                 </CardContent>
              </Card>

              <Card className="border-none shadow-xl bg-white overflow-hidden">
                 <CardHeader className="pb-4 border-b">
                    <CardTitle className="text-lg flex items-center gap-2 font-bold text-slate-800">
                       <AlertCircle className="size-5 text-amber-500" />
                       Pending Assignment
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="p-0">
                    <div className="divide-y">
                       {[1, 2, 3, 4].map((_, i) => (
                         <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                               <div className="size-2 rounded-full bg-amber-500 shrink-0" />
                               <div>
                                  <p className="text-xs font-bold text-slate-800">JIG-AR-2026-00{i+4}</p>
                                  <p className="text-[10px] text-muted-foreground font-medium">Arrived: 2h ago</p>
                               </div>
                            </div>
                            <Button size="sm" variant="ghost" className="h-7 px-2 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50/50 hover:bg-indigo-50">
                               Assign
                            </Button>
                         </div>
                       ))}
                    </div>
                    <Button variant="ghost" className="w-full h-10 text-[11px] font-bold text-slate-400 hover:text-slate-600 border-t rounded-none">
                       View All Pending ({12})
                    </Button>
                 </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
