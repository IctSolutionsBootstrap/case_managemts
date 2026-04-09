'use client'

import { useState } from 'react'
import { 
  Hourglass, 
  Search, 
  Filter, 
  Clock, 
  AlertOctagon, 
  CheckCircle2, 
  FileWarning,
  Scale,
  Calendar,
  AlertTriangle,
  PlayCircle,
  MoreVertical,
  Timer
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { RoleSidebar } from '@/components/dashboard/role-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { useI18n } from '@/lib/i18n/context'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// Mock Data for Prosecution Deadlines
const deadlineCases = [
  {
    id: 'dl-001',
    caseNumber: 'JIG-FIR-2026-088',
    suspectName: 'Ahmed Barkhadle',
    offenseType: 'Aggravated Assault',
    timerType: '48-hour Remand',
    startTime: new Date(Date.now() - 44 * 60 * 60 * 1000).toISOString(), // 44 hours ago
    maxHours: 48,
    actionRequired: 'File Formal Charges',
    status: 'critical' // < 4 hours left
  },
  {
    id: 'dl-002',
    caseNumber: 'JIG-FIR-2026-092',
    suspectName: 'Fatima Abdi',
    offenseType: 'Theft',
    timerType: '48-hour Remand',
    startTime: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), // 25 hours ago
    maxHours: 48,
    actionRequired: 'Review Evidence Entry',
    status: 'warning' // > 24 hours elapsed
  },
  {
    id: 'dl-003',
    caseNumber: 'JIG-PR-2026-441',
    suspectName: 'Hassan Ali',
    offenseType: 'Fraud',
    timerType: '15-day Trial Prep',
    startTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    maxHours: 15 * 24, // 15 days in hours
    actionRequired: 'Submit Subpoena List',
    status: 'critical'
  },
  {
    id: 'dl-004',
    caseNumber: 'JIG-FIR-2026-079',
    suspectName: 'Mohammed Yusuf',
    offenseType: 'Vandalism',
    timerType: '48-hour Remand',
    startTime: new Date(Date.now() - 50 * 60 * 60 * 1000).toISOString(), // 50 hours ago (Overdue)
    maxHours: 48,
    actionRequired: 'Immediate Release / File Charges',
    status: 'overdue'
  },
  {
    id: 'dl-005',
    caseNumber: 'JIG-PR-2026-460',
    suspectName: 'Amina Jama',
    offenseType: 'Embezzlement',
    timerType: '72-hour Response',
    startTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    maxHours: 72,
    actionRequired: 'Response to Defense Motion',
    status: 'safe' // Plenty of time
  }
]

export default function DeadlinesPage() {
  const { locale } = useI18n()
  const [searchTerm, setSearchTerm] = useState('')
  const [caseList, setCaseList] = useState(deadlineCases)
  const [isEmergencyDialogOpen, setIsEmergencyDialogOpen] = useState(false)
  const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false)
  const [selectedProcessCase, setSelectedProcessCase] = useState<any>(null)

  const stats = [
    { label: locale === 'am' ? 'ባለፉት ጊዜያት' : 'Overdue', value: '1', icon: AlertOctagon, color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200' },
    { label: locale === 'am' ? 'በቀጣይ 24 ሰዓት' : 'Critical (< 24h)', value: '2', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200' },
    { label: locale === 'am' ? 'ንቁ ቁጥጥሮች' : 'Active Trackers', value: '5', icon: Timer, color: 'text-indigo-600', bg: 'bg-indigo-100', border: 'border-indigo-200' },
    { label: locale === 'am' ? 'የተጠናቀቁ' : 'Cleared Today', value: '8', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200' },
  ]

  const calculateTimeRemaining = (startTime: string, maxHours: number) => {
    const start = new Date(startTime).getTime()
    const now = new Date().getTime()
    const elapsedMs = now - start
    const elapsedHours = elapsedMs / (1000 * 60 * 60)
    const remainingHours = maxHours - elapsedHours

    if (remainingHours <= 0) {
      return { 
        text: `OVERDUE BY ${Math.abs(Math.round(remainingHours))}h`, 
        color: 'text-red-700 bg-red-100 border-red-300 shadow-[0_0_10px_rgba(220,38,38,0.3)]',
        isOverdue: true
      }
    }
    
    if (remainingHours < 5) {
      return { 
        text: `${remainingHours.toFixed(1)} HOURS LEFT`, 
        color: 'text-red-700 bg-red-50 border-red-200 animate-pulse',
        isOverdue: false
      }
    }

    if (remainingHours < 24) {
      return { 
        text: `${Math.round(remainingHours)} HOURS LEFT`, 
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        isOverdue: false
      }
    }

    return { 
      text: `${Math.round(remainingHours / 24)} DAYS LEFT`, 
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      isOverdue: false
    }
  }

  const filteredCases = caseList.filter(c => 
    c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.suspectName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleProcessSubmit = () => {
    if (selectedProcessCase) {
      setCaseList(caseList.filter(c => c.id !== selectedProcessCase.id))
      setIsProcessDialogOpen(false)
      setSelectedProcessCase(null)
    }
  }

  return (
    <SidebarProvider>
      <RoleSidebar />
      <SidebarInset>
        <DashboardHeader 
          title="Constitutional & Statutory Deadlines" 
          titleAm="የሕገ መንግሥት እና ሕጋዊ የጊዜ ገደቦች" 
        />
        <main className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50/50">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 text-slate-900">
                  <Hourglass className="size-8 text-red-600" />
                  {locale === 'am' ? 'የጊዜ ገደቦች' : 'Prosecution Deadlines'}
                </h1>
                <p className="text-slate-600 mt-1.5 text-lg font-medium">
                  {locale === 'am' 
                    ? 'የእስር ገደቦችን እና የክስ ጊዜዎችን መከታተያ' 
                    : 'Monitor mandatory constitutional custody limits and statutory filing obligations.'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2 border-slate-300 text-slate-700 hover:bg-slate-100 font-bold shadow-sm" asChild>
                  <Link href="/dashboard/schedule">
                    <Calendar className="size-4" /> Court Calendar
                  </Link>
                </Button>
                <Dialog open={isEmergencyDialogOpen} onOpenChange={setIsEmergencyDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 bg-slate-900 hover:bg-slate-800 shadow-md font-bold" onClick={() => setIsEmergencyDialogOpen(true)}>
                      <FileWarning className="size-4" /> Emergency Filing
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="size-5" /> Expedited Emergency Filing
                      </DialogTitle>
                      <DialogDescription>
                        Submit an immediate motion or charge outside of the standard queue. Uses priority review routing.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                         <Label>Case Identifier / Target</Label>
                         <Input placeholder="e.g. Suspect Name or Case ID" />
                      </div>
                      <div className="space-y-2">
                         <Label>Motion Type</Label>
                         <Select defaultValue="habeas">
                           <SelectTrigger>
                             <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="habeas">Habeas Corpus Response</SelectItem>
                             <SelectItem value="remand">Emergency Remand Extension</SelectItem>
                             <SelectItem value="injunction">Immediate Injunction/Seizure</SelectItem>
                           </SelectContent>
                         </Select>
                      </div>
                      <div className="space-y-2">
                         <Label>Urgent Justification</Label>
                         <textarea 
                           className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                           placeholder="Flight risk, evidence destruction, etc..."
                         />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsEmergencyDialogOpen(false)}>Cancel</Button>
                      <Button className="bg-red-600 hover:bg-red-700" onClick={() => setIsEmergencyDialogOpen(false)}>Submit Emergency File</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Critical Operations HUD */}
            <div className="grid gap-4 md:grid-cols-4">
              {stats.map((stat, i) => (
                <Card key={i} className={cn("shadow-sm overflow-hidden group hover:shadow-md transition-all bg-white border-b-4", stat.border)}>
                  <CardContent className="p-0">
                    <div className="flex items-center gap-4 p-5">
                      <div className={cn("size-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg)}>
                        <stat.icon className={cn("size-6", stat.color)} />
                      </div>
                      <div>
                        <p className="text-3xl font-black text-slate-900 leading-none">{stat.value}</p>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Statutory Tracking Matrix */}
            <Card className="shadow-lg overflow-hidden border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b bg-white">
                <div>
                  <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Scale className="size-5 text-slate-400" /> Statutory Tracking Matrix
                  </CardTitle>
                  <CardDescription className="font-medium text-slate-500 mt-1">Live tracking of active remands and mandated prosecutorial actions.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input 
                      placeholder="Search cases/suspects..." 
                      className="pl-9 w-[280px] h-9 bg-slate-50 border-slate-200"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="sm" className="h-9 gap-2 font-bold border-slate-200">
                    <Filter className="size-4" /> Filters
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 bg-white">
                <Table>
                  <TableHeader className="bg-slate-50/80">
                    <TableRow className="border-slate-200">
                      <TableHead className="pl-6 h-12 text-slate-900 font-black uppercase text-[10px] tracking-widest">Case Particulars</TableHead>
                      <TableHead className="h-12 text-slate-900 font-black uppercase text-[10px] tracking-widest">Statutory Obligation</TableHead>
                      <TableHead className="h-12 text-slate-900 font-black uppercase text-[10px] tracking-widest">Time Remaining</TableHead>
                      <TableHead className="h-12 text-slate-900 font-black uppercase text-[10px] tracking-widest">Required Action</TableHead>
                      <TableHead className="text-right pr-6 h-12 text-slate-900 font-black uppercase text-[10px] tracking-widest">Manage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCases.map((c) => {
                      const timeData = calculateTimeRemaining(c.startTime, c.maxHours)
                      
                      return (
                      <TableRow key={c.id} className={cn("transition-colors border-b-slate-100 last:border-0 group hover:bg-slate-50", timeData.isOverdue && "bg-red-50/50 hover:bg-red-50")}>
                        <TableCell className="pl-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-black text-sm text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer">
                              {c.suspectName}
                            </span>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{c.caseNumber}</span>
                              <div className="size-1 rounded-full bg-slate-300" />
                              <span className="text-[10px] text-slate-500 font-medium">{c.offenseType}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                             <Clock className={cn("size-3.5", timeData.isOverdue ? "text-red-500" : "text-slate-400")} />
                             <span className="font-bold text-xs text-slate-700">{c.timerType}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("font-black tracking-widest text-[9px] px-2.5 py-1 uppercase rounded-md border", timeData.color)}>
                            {timeData.text}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={cn("text-xs font-bold", timeData.isOverdue ? "text-red-700" : "text-slate-700")}>
                             {c.actionRequired}
                          </span>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                           <div className="flex justify-end gap-1.5">
                             <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-indigo-700 font-bold bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-800 text-[10px] px-3" onClick={() => {
                               setSelectedProcessCase(c)
                               setIsProcessDialogOpen(true)
                             }}>
                               <PlayCircle className="size-3.5" /> PROCESS
                             </Button>
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md">
                               <MoreVertical className="size-4" />
                             </Button>
                           </div>
                        </TableCell>
                      </TableRow>
                    )})}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Information Alert */}
            <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-start gap-4">
               <div className="size-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                  <Scale className="size-5 text-indigo-600" />
               </div>
               <div className="space-y-1">
                  <h4 className="font-black text-indigo-950 uppercase tracking-tight text-sm">Constitutional Briefing: Remand Limits</h4>
                  <p className="text-sm font-medium text-indigo-800/80 leading-relaxed max-w-4xl">
                    Article 19(3) of the FDRE Constitution mandates that persons arrested have the right to be brought before a court within 
                    <strong className="font-bold text-indigo-900 mx-1">48 hours</strong> of their arrest. Cases that breach this timeline 
                    without a formal extension approved by the magistrate will trigger an immediate administrative review.
                  </p>
               </div>
            </div>

            {/* Simulated Process Action Dialog */}
            <Dialog open={isProcessDialogOpen} onOpenChange={setIsProcessDialogOpen}>
              <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                   <DialogTitle className="flex items-center gap-2">
                      <PlayCircle className="size-5 text-indigo-600" /> Executive Action
                   </DialogTitle>
                   <DialogDescription>Resolve the pending statutory obligation for this case.</DialogDescription>
                </DialogHeader>
                {selectedProcessCase && (
                  <div className="space-y-4 py-4">
                    <div className="p-3 bg-slate-50 border rounded-lg text-sm flex gap-2">
                       <span className="font-bold text-slate-700">{selectedProcessCase.suspectName}</span>
                       <span className="text-slate-400 font-mono text-xs mt-0.5">{selectedProcessCase.caseNumber}</span>
                    </div>
                    <div className="space-y-2">
                      <Label>Required Action</Label>
                      <Input value={selectedProcessCase.actionRequired} readOnly className="bg-slate-100 font-bold text-slate-700" />
                    </div>
                    <div className="space-y-2 pt-2 border-t">
                      <Label>Execution Method</Label>
                      <Select defaultValue="direct">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="direct">Direct Electronic Filing</SelectItem>
                          <SelectItem value="court">In-Person Magistrate Review</SelectItem>
                          <SelectItem value="delegated">Delegate to Assistant Prosecutor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsProcessDialogOpen(false)}>Cancel</Button>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2" onClick={handleProcessSubmit}>
                    <CheckCircle2 className="size-4" /> Finalize Action
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
