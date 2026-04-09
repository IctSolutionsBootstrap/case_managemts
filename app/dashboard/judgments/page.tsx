'use client'

import { useState } from 'react'
import { 
  FileSignature, 
  Search, 
  Scale, 
  BookOpen, 
  CheckCircle2, 
  Check,
  AlertCircle,
  FileText,
  Gavel,
  ChevronRight,
  Download,
  Filter,
  Eye,
  PenTool
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
import { criminalCases } from '@/lib/cms-data/mock-data'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { format } from 'date-fns'

export default function JudgmentsPage() {
  const { locale } = useI18n()
  const [searchTerm, setSearchTerm] = useState('')
  const [isDraftDialogOpen, setIsDraftDialogOpen] = useState(false)
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false)
  const [selectedJudgment, setSelectedJudgment] = useState<any>(null)
  const [verdict, setVerdict] = useState<string>('')
  
  // Mock data for judgments
  const [judgments, setJudgments] = useState([
    {
      id: 'judg-001',
      caseNumber: 'JIG-CR-2025-0142',
      title: 'State vs. Ali Hassan',
      verdict: 'guilty',
      sentence: '5 Years Imprisonment',
      issuedDate: '2026-03-15',
      status: 'published'
    },
    {
      id: 'judg-002',
      caseNumber: 'JIG-CV-2025-0891',
      title: 'Abdi Enterprises vs. City Admin',
      verdict: 'settled',
      sentence: 'N/A',
      issuedDate: '2026-03-28',
      status: 'published'
    },
    {
      id: 'judg-003',
      caseNumber: 'JIG-CR-2026-0004',
      title: 'State vs. Muna Ahmed',
      verdict: 'acquitted',
      sentence: 'Immediate Release',
      issuedDate: '2026-04-02',
      status: 'published'
    }
  ])

  const stats = [
    { label: locale === 'am' ? 'በಕರ ረቂቆች' : 'Pending Drafts', value: '3', icon: PenTool, color: 'text-amber-500', bg: 'bg-amber-100' },
    { label: locale === 'am' ? 'ባለፈው ወር የታተሙ' : 'Published (Month)', value: '18', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-100' },
    { label: locale === 'am' ? 'ይግባኝ የተጠየቀባቸው' : 'Appealed Cases', value: '4', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-100' },
    { label: locale === 'am' ? 'በግምገማ ላይ ያሉ' : 'Under Review', value: '2', icon: Eye, color: 'text-blue-500', bg: 'bg-blue-100' },
  ]

  const verdictColors: Record<string, string> = {
    guilty: 'bg-red-50 text-red-700 border-red-200',
    acquitted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dismissed: 'bg-slate-50 text-slate-700 border-slate-200',
    settled: 'bg-blue-50 text-blue-700 border-blue-200'
  }

  const handlePublish = () => {
    // Simulate adding a new published judgment
    const newDoc = {
      id: `judg-00${judgments.length + 1}`,
      caseNumber: 'JIG-CR-REQUESTED',
      title: 'New Published Resolution',
      verdict: verdict || 'guilty',
      sentence: verdict === 'guilty' ? 'Pending Assessment' : 'Immediate Release',
      issuedDate: new Date().toISOString(),
      status: 'published'
    }
    setJudgments([newDoc, ...judgments])
    setIsDraftDialogOpen(false)
  }

  const filteredJudgments = judgments.filter(j => 
    j.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pendingDecisions = criminalCases.filter(c => c.status === 'sentencing' || c.status === 'trial')

  return (
    <SidebarProvider>
      <RoleSidebar />
      <SidebarInset>
        <DashboardHeader 
          title="Judicial Judgments" 
          titleAm="የፍርድ ውሳኔዎች" 
        />
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                  <FileSignature className="size-8 text-slate-800" />
                  {locale === 'am' ? 'የፍርድ ውሳኔዎች' : 'Judicial Judgments & Decrees'}
                </h1>
                <p className="text-muted-foreground mt-1 text-lg">
                  {locale === 'am' 
                    ? 'የመጨረሻ ውሳኔዎችን መጻፊያ እና ማህደር' 
                    : 'Draft, review, and formally publish legal decisions and sentencing orders.'}
                </p>
              </div>
              <Dialog open={isDraftDialogOpen} onOpenChange={setIsDraftDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2 bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-200" onClick={() => setIsDraftDialogOpen(true)}>
                    <PenTool className="size-5" /> Draft Decision
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                       <Gavel className="size-5 text-slate-700" />
                       Formal Decision Drafting
                    </DialogTitle>
                    <DialogDescription>
                      Issue a final ruling for a concluded trial. This will become part of the official court record.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-6 py-4">
                     <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4 shadow-inner">
                        <div className="space-y-2">
                           <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Select Concluded Case</Label>
                           <Select>
                             <SelectTrigger className="bg-white">
                               <SelectValue placeholder="Choose a pending case..." />
                             </SelectTrigger>
                             <SelectContent>
                               {pendingDecisions.map(c => (
                                 <SelectItem key={c.id} value={c.id}>
                                   {c.caseNumber} - {(c.title || '').split(' vs ')[0]}
                                 </SelectItem>
                               ))}
                             </SelectContent>
                           </Select>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Final Verdict</Label>
                           <Select value={verdict} onValueChange={setVerdict}>
                             <SelectTrigger>
                               <SelectValue placeholder="Select outcome" />
                             </SelectTrigger>
                             <SelectContent>
                               <SelectItem value="guilty">Guilty (Conviction)</SelectItem>
                               <SelectItem value="acquitted">Acquitted (Not Guilty)</SelectItem>
                               <SelectItem value="dismissed">Case Dismissed</SelectItem>
                               <SelectItem value="settled">Settled (Civil)</SelectItem>
                             </SelectContent>
                           </Select>
                        </div>
                        <div className="space-y-2">
                           <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Primary Sentence / Order</Label>
                           <Input placeholder="e.g. 5 Years, $10,000 Fine, N/A" />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Judgment Summary (Decree Text)</Label>
                        <div className="border rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-slate-900 focus-within:ring-offset-2 transition-all">
                           <div className="bg-slate-100 border-b p-2 flex gap-2">
                              {/* Rich text mock toolbar */}
                              <Button variant="ghost" size="icon" className="h-6 w-6"><span className="font-serif font-bold">B</span></Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6"><span className="font-serif italic">I</span></Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6"><span className="font-serif underline">U</span></Button>
                           </div>
                           <textarea 
                             className="w-full h-40 p-4 text-sm font-serif leading-relaxed resize-none focus:outline-none"
                             placeholder="The court finds that the evidence presented..."
                           />
                        </div>
                     </div>
                  </div>

                  <DialogFooter className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mr-auto">
                       <Check className="size-4" /> Auto-saved just now
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsDraftDialogOpen(false)}>Save Draft</Button>
                      <Button onClick={handlePublish} className="bg-slate-900 hover:bg-slate-800 text-white gap-2">
                         <FileSignature className="size-4" /> Publish Decree
                      </Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-4">
              {stats.map((stat, i) => (
                <Card key={i} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all bg-white">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-4 p-5">
                      <div className={cn("size-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg)}>
                        <stat.icon className={cn("size-6", stat.color)} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                        <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Archive List */}
            <Card className="border-none shadow-xl overflow-hidden bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
                <div>
                  <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <BookOpen className="size-5 text-slate-400" /> Judgment Archive
                  </CardTitle>
                  <CardDescription>Official ledger of all published decisions.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search judgments..." 
                      className="pl-9 w-[250px] h-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="sm" className="h-9 gap-2">
                    <Filter className="size-4" /> Attributes
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow>
                      <TableHead className="pl-6 h-14 text-slate-700 font-bold uppercase text-[10px] tracking-wider">Document Ref</TableHead>
                      <TableHead className="h-14 text-slate-700 font-bold uppercase text-[10px] tracking-wider">Case Particulars</TableHead>
                      <TableHead className="h-14 text-slate-700 font-bold uppercase text-[10px] tracking-wider">Verdict</TableHead>
                      <TableHead className="h-14 text-slate-700 font-bold uppercase text-[10px] tracking-wider">Sentence/Order</TableHead>
                      <TableHead className="text-right pr-6 h-14 text-slate-700 font-bold uppercase text-[10px] tracking-wider">Document</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJudgments.map((j) => (
                      <TableRow key={j.id} className="hover:bg-slate-50 transition-colors border-b last:border-0 group">
                        <TableCell className="pl-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-slate-800">
                              {j.id.toUpperCase()}
                            </span>
                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight mt-0.5">{j.caseNumber}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                           <p className="font-bold text-sm text-slate-700">{j.title.split(' vs ')[0]}</p>
                           <p className="text-[11px] text-muted-foreground">vs. {j.title.split(' vs ')[1] || 'The State'}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("capitalize px-2.5 py-0.5 h-auto text-[10px] font-black tracking-widest rounded uppercase", verdictColors[j.verdict] || 'bg-slate-100')}>
                            {j.verdict}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-semibold text-slate-600">
                             {j.sentence}
                          </span>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex justify-end gap-2">
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-slate-700 transition-colors bg-slate-50 hover:bg-slate-200" onClick={() => {
                               setSelectedJudgment(j)
                               setIsPrintDialogOpen(true)
                             }}>
                               <FileText className="size-4" />
                             </Button>
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-400 group-hover:text-indigo-600 transition-colors bg-indigo-50 hover:bg-indigo-100" onClick={() => {
                               setSelectedJudgment(j)
                               setIsPrintDialogOpen(true)
                             }}>
                               <Download className="size-4" />
                             </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Print Document Dialog Simulation */}
            <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
              <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="border-b pb-4">
                  <DialogTitle className="flex items-center justify-between">
                     <span className="flex items-center gap-2">
                       <FileSignature className="size-5 text-slate-700" />
                       Decree Viewer
                     </span>
                     <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => window.print()}
                     >
                       <Download className="size-4" /> Print Document
                     </Button>
                  </DialogTitle>
                </DialogHeader>
                {selectedJudgment && (
                  <div className="bg-white p-12 mt-4 border border-slate-200 shadow-sm mx-auto w-full prose prose-slate">
                     {/* Formal Letterhead */}
                     <div className="text-center border-b-2 border-slate-900 pb-6 mb-8">
                        <Scale className="size-16 mx-auto text-slate-900 mb-4" />
                        <h2 className="text-2xl font-serif font-bold uppercase tracking-widest text-slate-900 m-0">The High Court of Jijiga</h2>
                        <p className="text-sm font-serif text-slate-600 tracking-wider uppercase mt-2">Somali Regional State, Ethiopia</p>
                     </div>
                     
                     <div className="flex justify-between items-end mb-8 text-sm font-serif">
                        <div>
                          <p><strong>Case Number:</strong> {selectedJudgment.caseNumber}</p>
                          <p><strong>Decree Ref:</strong> {selectedJudgment.id.toUpperCase()}</p>
                        </div>
                        <div className="text-right">
                          <p><strong>Date Issued:</strong> {format(new Date(selectedJudgment.issuedDate), 'MMMM d, yyyy')}</p>
                          <p><strong>Presiding:</strong> Hon. Bereket Tessema</p>
                        </div>
                     </div>

                     <div className="text-center mb-10">
                        <h3 className="text-xl font-bold font-serif italic text-slate-900">{selectedJudgment.title}</h3>
                     </div>

                     <div className="space-y-6 font-serif text-slate-800 leading-relaxed text-justify">
                        <p>
                          This court, having heard all arguments, reviewed the testimonies, and examined the evidence presented in the matter of <strong>{selectedJudgment.title}</strong>, hereby delivers the following ruling:
                        </p>
                        <p className="p-4 bg-slate-50 border-l-4 border-slate-300 font-medium">
                          The court finds the defendant <strong>{selectedJudgment.verdict.toUpperCase()}</strong> of the primary charges.
                        </p>
                        <p>
                          In accordance with the statutory guidelines of the MoJ Judicial Decree of 2025, and upon finding aforementioned facts, the court orders the following sentence and/or resolution:
                        </p>
                        <p className="text-center font-bold text-lg uppercase tracking-wider py-4 border-y border-dashed border-slate-300">
                           {selectedJudgment.sentence}
                        </p>
                        <p>
                          This order shall be executed immediately. Both parties reserve the right to file an appeal within fifteen (15) business days from the date of issuance recorded above.
                        </p>
                     </div>

                     <div className="mt-20 pt-8 border-t border-slate-200 flex justify-end">
                        <div className="text-center">
                           <div className="w-48 h-px bg-slate-400 mb-2" />
                           <p className="font-serif font-bold text-sm text-slate-900">Hon. Bereket Tessema</p>
                           <p className="font-serif text-xs text-slate-500 italic">High Court Presiding Judge</p>
                        </div>
                     </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>

          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
