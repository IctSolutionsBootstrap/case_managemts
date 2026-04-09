'use client'

import { useState } from 'react'
import { 
  FileSearch, 
  Search, 
  Filter, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  Shield,
  FileText,
  XCircle,
  Eye,
  MessageSquare,
  Scale
} from 'lucide-react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
} from '@/components/ui/dialog'
import { RoleSidebar } from '@/components/dashboard/role-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { useI18n } from '@/lib/i18n/context'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

// Mock Data for Cases Pending Review
const pendingReviewQueue = [
  {
    id: 'JIG-FIR-RES-401',
    defendant: 'Kaleb Tadesse',
    offense: 'Embezzlement (Art. 390)',
    policeOfficer: 'Insp. Getachew',
    submissionDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    status: 'urgent',
    timeRemaining: '42h 15m',
    evidenceCount: 14,
    summary: 'Evidence suggests structured diversion of state funds. Auditor logs attached.'
  },
  {
    id: 'JIG-FIR-RES-402',
    defendant: 'Aisha Mohammed',
    offense: 'Aggravated Assault (Art. 539)',
    policeOfficer: 'Sgt. Ahmed Ali',
    submissionDate: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    status: 'warning',
    timeRemaining: '30h 00m',
    evidenceCount: 3,
    summary: 'Suspect apprehended after altercation. Medical report from Jijiga General pending final signature.'
  },
  {
    id: 'JIG-FIR-RES-405',
    defendant: 'Dawit Bekele',
    offense: 'Public Disturbance (Art. 680)',
    policeOfficer: 'Cpl. Samrawit',
    submissionDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'standard',
    timeRemaining: '46h 30m',
    evidenceCount: 1,
    summary: 'Minor incident reported in daily log. Witness statement available.'
  },
  {
    id: 'JIG-FIR-RES-399',
    defendant: 'Unknown Assailant',
    offense: 'Property Damage (Art. 620)',
    policeOfficer: 'Insp. Getachew',
    submissionDate: new Date(Date.now() - 32 * 60 * 60 * 1000).toISOString(),
    status: 'critical',
    timeRemaining: '16h 45m',
    evidenceCount: 5,
    summary: 'Vandalism of commercial property. CCTV footage submitted but highly degraded.'
  }
]

export default function ProsecutorReviewPage() {
  const { locale, t } = useI18n()
  const [searchTerm, setSearchTerm] = useState('')
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [activeCase, setActiveCase] = useState<any>(null)
  
  // Basic mock state management to allow dismissing things out of the UI
  const [queue, setQueue] = useState(pendingReviewQueue)

  const stats = [
    { label: locale === 'am' ? 'በመጠባበቅ ላይ ያሉ ጥያቄዎች' : 'Pending Approvals', value: queue.length.toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: locale === 'am' ? 'ከፍተኛ ትኩረት' : 'Critical Urgency (<24h)', value: queue.filter(q => q.status === 'critical').length.toString(), icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
    { label: locale === 'am' ? 'ዛሬ የተገመገሙ' : 'Reviewed Today', value: '7', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ]

  const statusConfig: Record<string, { color: string, badge: string }> = {
    critical: { color: 'text-red-700 bg-red-100 border-red-200', badge: 'CRITICAL WARNING' },
    urgent: { color: 'text-orange-700 bg-orange-100 border-orange-200', badge: 'URGENT' },
    warning: { color: 'text-amber-700 bg-amber-100 border-amber-200', badge: 'WARNING' },
    standard: { color: 'text-indigo-700 bg-indigo-100 border-indigo-200', badge: 'STANDARD' }
  }

  const filteredQueue = queue.filter(c => 
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.defendant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.offense.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEvaluate = (caseItem: any) => {
    setActiveCase(caseItem)
    setIsEvaluating(true)
  }

  const handleDisposition = (actionType: 'approve' | 'return' | 'dismiss') => {
    if (!activeCase) return
    setQueue(prev => prev.filter(c => c.id !== activeCase.id))
    setIsEvaluating(false)
    setActiveCase(null)
  }

  return (
    <SidebarProvider>
      <RoleSidebar />
      <SidebarInset>
        <DashboardHeader 
          title="Prosecution Review Portal" 
          titleAm="የዓቃቤ ሕግ ግምገማ መግቢያ" 
        />
        <main className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50/50">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 text-slate-900">
                  <FileSearch className="size-8 text-indigo-700" />
                  {locale === 'am' ? 'የግምገማ ወረፋ' : 'Pending Review Queue'}
                </h1>
                <p className="text-slate-600 mt-1.5 text-lg font-medium">
                  {locale === 'am' 
                    ? 'በፖሊስ የቀረቡ ጉዳዮች ለዓቃቤ ሕግ ውሳኔ' 
                    : 'Evaluate initial police FIRs and evidence before moving to formal indictment.'}
                </p>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-3">
              {stats.map((stat, i) => (
                <Card key={i} className="shadow-sm overflow-hidden group hover:shadow-md transition-all bg-white border-b-4 border-b-slate-200">
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

            {/* Queue Registry Table */}
            <Card className="shadow-xl overflow-hidden border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b bg-white">
                <div>
                  <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Shield className="size-5 text-indigo-500" /> Submitted Investigations
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input 
                      placeholder="Search defendants or FIR IDs..." 
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
                      <TableHead className="pl-6 h-12 text-slate-900 font-black uppercase text-[10px] tracking-widest">FIR Identifier</TableHead>
                      <TableHead className="h-12 text-slate-900 font-black uppercase text-[10px] tracking-widest">Case Particulars</TableHead>
                      <TableHead className="h-12 text-slate-900 font-black uppercase text-[10px] tracking-widest">Status / Timeline</TableHead>
                      <TableHead className="text-right pr-6 h-12 text-slate-900 font-black uppercase text-[10px] tracking-widest">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQueue.map((c) => (
                      <TableRow key={c.id} className="transition-colors border-b-slate-100 last:border-0 group hover:bg-slate-50">
                        <TableCell className="pl-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-black text-sm text-indigo-700 tracking-tight">
                              {c.id}
                            </span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">By: {c.policeOfficer}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                           <p className="font-bold text-sm text-slate-800">{c.defendant}</p>
                           <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                              <AlertCircle className="size-3 text-red-500" /> {c.offense}
                           </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col items-start gap-1">
                            <Badge variant="outline" className={cn("px-1.5 py-0.5 h-auto text-[9px] font-black uppercase tracking-wider border", statusConfig[c.status].color)}>
                              {statusConfig[c.status].badge}
                            </Badge>
                            <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                               <Clock className="size-3" /> Due in: {c.timeRemaining}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                           <Button size="sm" className="h-8 gap-1.5 font-bold bg-slate-900 hover:bg-indigo-700 text-[10px] px-4 shadow shadow-indigo-200" onClick={() => handleEvaluate(c)}>
                             <Scale className="size-3.5" /> EVALUATE
                           </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredQueue.length === 0 && (
                      <TableRow>
                         <TableCell colSpan={4} className="text-center py-10">
                            <CheckCircle2 className="size-10 text-emerald-500 mx-auto mb-2 opacity-50" />
                            <p className="text-sm font-bold text-slate-500">Queue is completely clear.</p>
                         </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Terminal Review Modal */}
            <Dialog open={isEvaluating} onOpenChange={setIsEvaluating}>
              <DialogContent className="sm:max-w-[900px] h-[85vh] p-0 flex flex-col overflow-hidden bg-slate-50 border-0 shadow-2xl">
                {activeCase && (
                  <>
                    <DialogHeader className="px-6 py-4 bg-slate-900 border-b border-slate-800 shrink-0">
                      <DialogTitle className="flex items-center justify-between text-white">
                         <div className="flex items-center gap-3">
                           <div className="p-2 bg-indigo-600 rounded">
                             <FileSearch className="size-5" />
                           </div>
                           <div className="flex flex-col">
                             <span className="text-lg font-black tracking-widest">{activeCase.id}</span>
                             <span className="text-xs font-mono text-indigo-300 font-bold uppercase">Submitted By: {activeCase.policeOfficer}</span>
                           </div>
                         </div>
                         <div className="text-right">
                           <Badge variant="outline" className={cn("px-2 py-1 text-[10px] font-black tracking-widest leading-none border-t-0 border-l-0 border-r-0 border-b-2 rounded-none bg-transparent uppercase", statusConfig[activeCase.status].color.replace('bg-', 'bg-slate-800 text-').split(' ')[0])}>
                              REMAINDER: {activeCase.timeRemaining}
                           </Badge>
                         </div>
                      </DialogTitle>
                    </DialogHeader>
                    
                    {/* Split View Content */}
                    <div className="flex-1 flex overflow-hidden">
                       
                       {/* Left Panel: Narrative */}
                       <div className="w-1/2 flex flex-col border-r border-slate-200 bg-white">
                          <div className="p-4 border-b border-slate-100 shrink-0 bg-slate-50/80">
                             <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                               <Shield className="size-4" /> Incident Abstract
                             </h3>
                          </div>
                          <div className="p-6 overflow-y-auto prose prose-sm prose-slate flex-1">
                             <p className="text-slate-800 leading-relaxed font-medium">
                               {activeCase.summary}
                             </p>
                             <div className="mt-8 pt-6 border-t border-slate-100">
                               <h4 className="text-[10px] font-black text-indigo-700 uppercase tracking-widest mb-3">Statutory Offense Classification</h4>
                               <div className="p-3 bg-red-50 border border-red-100 rounded text-red-900 font-bold text-sm">
                                 {activeCase.offense}
                               </div>
                             </div>
                             <div className="mt-6">
                               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Subject Information</h4>
                               <div className="grid grid-cols-2 gap-4">
                                  <div className="p-3 border border-slate-100 rounded">
                                     <span className="block text-[9px] text-slate-400 uppercase tracking-widest font-black mb-1">Defendant</span>
                                     <span className="block text-sm font-bold text-slate-900">{activeCase.defendant}</span>
                                  </div>
                               </div>
                             </div>
                          </div>
                       </div>
                       
                       {/* Right Panel: Evidence & Logs */}
                       <div className="w-1/2 flex flex-col bg-slate-50">
                          <div className="p-4 border-b border-slate-200 shrink-0 bg-slate-100">
                             <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                               <FileText className="size-4" /> Evidence Dossier ({activeCase.evidenceCount})
                             </h3>
                          </div>
                          <div className="flex-1 overflow-y-auto p-4 space-y-3">
                             {/* Mock Document Attachments */}
                             {Array.from({ length: Math.min(activeCase.evidenceCount, 3) }).map((_, i) => (
                               <Card key={i} className="shadow-none border-slate-200">
                                 <CardContent className="p-3 flex items-center gap-3">
                                   <div className="size-8 bg-indigo-100 rounded flex items-center justify-center shrink-0">
                                      <FileText className="size-4 text-indigo-700" />
                                   </div>
                                   <div className="flex-1">
                                      <p className="text-xs font-bold text-slate-800">Attached Record_00{i+1}.pdf</p>
                                      <p className="text-[10px] text-slate-500">Processed by Police Records</p>
                                   </div>
                                   <Button variant="ghost" size="sm" className="h-6 w-6 p-0 shrink-0"><Eye className="size-3" /></Button>
                                 </CardContent>
                               </Card>
                             ))}
                             {activeCase.evidenceCount > 3 && (
                               <div className="text-center p-2 text-xs font-bold text-indigo-600 bg-indigo-50 rounded border border-indigo-100 cursor-pointer">
                                  + View {activeCase.evidenceCount - 3} Additional Files
                               </div>
                             )}
                          </div>
                       </div>

                    </div>
                    
                    {/* Action Bar */}
                    <div className="p-4 bg-white border-t border-slate-200 shrink-0 flex items-center justify-between">
                       <Button variant="outline" className="text-slate-500 font-bold border-slate-200" onClick={() => setIsEvaluating(false)}>
                         Close Terminal
                       </Button>
                       <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 gap-1.5 font-bold text-xs"
                            onClick={() => handleDisposition('dismiss')}
                          >
                             <XCircle className="size-4" /> Dismiss Case
                          </Button>
                          <Button 
                            variant="outline" 
                            className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 gap-1.5 font-bold text-xs"
                             onClick={() => handleDisposition('return')}
                          >
                             <MessageSquare className="size-4" /> Return to Police
                          </Button>
                          <Button 
                            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 font-bold text-xs ml-4 shadow-md shadow-emerald-200"
                            onClick={() => handleDisposition('approve')}
                          >
                             <CheckCircle2 className="size-4" /> Approve & Move to Charges
                          </Button>
                       </div>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>

          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
