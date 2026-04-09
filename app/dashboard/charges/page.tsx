'use client'

import { useState } from 'react'
import { 
  Gavel, 
  Search, 
  Filter, 
  FileText, 
  CheckCircle2, 
  Scale,
  Calendar,
  AlertTriangle,
  FolderOpen,
  Download,
  Eye,
  ShieldAlert,
  Printer
} from 'lucide-react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RoleSidebar } from '@/components/dashboard/role-sidebar'

import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { useI18n } from '@/lib/i18n/context'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

// Mock Data for Filed Charges
const filedCharges = [
  {
    id: 'indict-2026-001',
    caseNumber: 'JIG-PR-2026-112',
    defendant: 'Hussein Abdi',
    leadProsecutor: 'Zewdu Tadesse',
    primaryCharges: ['Art. 532 (Aggravated Robbery)', 'Art. 544 (Assault)'],
    filingDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending_arraignment',
    severity: 'high'
  },
  {
    id: 'indict-2026-002',
    caseNumber: 'JIG-CV-2026-88',
    defendant: 'Netsanet Logistics LLC',
    leadProsecutor: 'Zewdu Tadesse',
    primaryCharges: ['Art. 411 (Tax Evasion)', 'Art. 415 (Corporate Fraud)'],
    filingDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'in_trial',
    severity: 'medium'
  },
  {
    id: 'indict-2026-003',
    caseNumber: 'JIG-PR-2026-145',
    defendant: 'Mahmoud Farah',
    leadProsecutor: 'Zewdu Tadesse',
    primaryCharges: ['Art. 680 (Public Order Disturbance)'],
    filingDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'sentencing',
    severity: 'low'
  },
  {
    id: 'indict-2026-004',
    caseNumber: 'JIG-PR-2026-150',
    defendant: 'Sara Mohammed',
    leadProsecutor: 'Zewdu Tadesse',
    primaryCharges: ['Art. 390 (Embezzlement)'],
    filingDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending_arraignment',
    severity: 'high'
  }
]

export default function ChargesPage() {
  const { locale } = useI18n()
  const [searchTerm, setSearchTerm] = useState('')
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [selectedCharge, setSelectedCharge] = useState<any>(null)
  const [isDraftOpen, setIsDraftOpen] = useState(false)

  const stats = [
    { label: locale === 'am' ? 'ንቁ ክሶች' : 'Active Prosecutions', value: '42', icon: Scale, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: locale === 'am' ? 'በዚህ ወር የቀረቡ' : 'Charges Filed (Month)', value: '18', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: locale === 'am' ? 'የሚጠበቁ መደበኛ ጥያቄዎች' : 'Pending Arraignment', value: '8', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: locale === 'am' ? 'የቅጣት ስኬት መጠን' : 'Conviction Rate', value: '84%', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ]

  const statusColors: Record<string, string> = {
    pending_arraignment: 'bg-amber-100 text-amber-700 border-amber-200',
    in_trial: 'bg-purple-100 text-purple-700 border-purple-200',
    sentencing: 'bg-emerald-100 text-emerald-700 border-emerald-200'
  }

  const filteredCharges = filedCharges.filter(c => 
    c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.defendant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleReviewCharge = (charge: any) => {
    setSelectedCharge(charge)
    setIsViewerOpen(true)
  }

  return (
    <SidebarProvider>
      <RoleSidebar />
      <SidebarInset>
        <DashboardHeader 
          title="Prosecution Ledger: Filed Charges" 
          titleAm="የዓቃቤ ሕግ መዝገብ፡ የቀረቡ ክሶች" 
        />
        <main className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50/50">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 text-slate-900">
                  <Gavel className="size-8 text-indigo-700" />
                  {locale === 'am' ? 'የቀረቡ ክሶች መዝገብ' : 'Master Indictment Registry'}
                </h1>
                <p className="text-slate-600 mt-1.5 text-lg font-medium">
                  {locale === 'am' 
                    ? 'በዓቃቤ ሕግ የቀረቡ ህጋዊ ክሶች ማህደር' 
                    : 'The official ledger of all formal criminal charges submitted to the High Court.'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Dialog open={isDraftOpen} onOpenChange={setIsDraftOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 bg-indigo-700 hover:bg-indigo-800 shadow-md font-bold" onClick={() => setIsDraftOpen(true)}>
                      <FolderOpen className="size-4" /> Draft New Charge
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                         <Gavel className="size-5 text-indigo-700" /> Draft Formal Indictment
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                       <div className="space-y-2">
                          <Label>Select Active Case File</Label>
                          <Select defaultValue="jig-fir-088">
                            <SelectTrigger>
                              <SelectValue placeholder="Select case..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="jig-fir-088">JIG-FIR-2026-088 (Ahmed Barkhadle)</SelectItem>
                              <SelectItem value="jig-fir-092">JIG-FIR-2026-092 (Fatima Abdi)</SelectItem>
                              <SelectItem value="jig-pr-460">JIG-PR-2026-460 (Amina Jama)</SelectItem>
                            </SelectContent>
                          </Select>
                       </div>
                       <div className="space-y-2">
                          <Label>Primary Statutory Citation</Label>
                          <Input placeholder="e.g. Art. 532 (Aggravated Assault)" />
                       </div>
                       <div className="space-y-2">
                          <Label>Additional Citations (Optional)</Label>
                          <Input placeholder="Comma separated statutes" />
                       </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                      <Button variant="outline" onClick={() => setIsDraftOpen(false)}>Cancel</Button>
                      <Button className="bg-indigo-700 hover:bg-indigo-800" onClick={() => setIsDraftOpen(false)}>Author & Submit Charge</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-4">
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

            {/* Indictment Registry Table */}
            <Card className="shadow-xl overflow-hidden border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b bg-white">
                <div>
                  <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <ShieldAlert className="size-5 text-indigo-500" /> Filed Prosecutions
                  </CardTitle>
                  <CardDescription className="font-medium text-slate-500 mt-1">Formal legal actions maintained by the prosecution bureau.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input 
                      placeholder="Search defendants or IDs..." 
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
                      <TableHead className="pl-6 h-12 text-slate-900 font-black uppercase text-[10px] tracking-widest">Indictment Ref</TableHead>
                      <TableHead className="h-12 text-slate-900 font-black uppercase text-[10px] tracking-widest">Defendant</TableHead>
                      <TableHead className="h-12 text-slate-900 font-black uppercase text-[10px] tracking-widest">Primary Statutory Charges</TableHead>
                      <TableHead className="h-12 text-slate-900 font-black uppercase text-[10px] tracking-widest">Filing Details</TableHead>
                      <TableHead className="text-right pr-6 h-12 text-slate-900 font-black uppercase text-[10px] tracking-widest">Manage Document</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCharges.map((c) => (
                      <TableRow key={c.id} className="transition-colors border-b-slate-100 last:border-0 group hover:bg-slate-50">
                        <TableCell className="pl-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-black text-sm text-indigo-700 tracking-tight">
                              {c.id.toUpperCase()}
                            </span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">{c.caseNumber}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                           <p className="font-bold text-sm text-slate-800">{c.defendant}</p>
                           <Badge variant="outline" className={cn("px-1.5 py-0.5 h-auto text-[9px] font-black uppercase tracking-wider mt-1 border", statusColors[c.status])}>
                             {c.status.replace('_', ' ')}
                           </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {c.primaryCharges.map((charge, idx) => (
                               <span key={idx} className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded w-max">
                                 {charge}
                               </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                             <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                               <Calendar className="size-3" /> {format(new Date(c.filingDate), 'MMM d, yyyy')}
                             </div>
                             <span className="text-[10px] text-slate-500 font-medium mt-0.5">By: {c.leadProsecutor}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                           <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-indigo-700 font-bold bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-800 text-[10px] px-3" onClick={() => handleReviewCharge(c)}>
                             <Eye className="size-3.5" /> REVIEW
                           </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Charge Sheet Interactive Viewer (Print Simulation) */}
            <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
              <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="border-b pb-4 mb-4">
                  <DialogTitle className="flex items-center justify-between text-slate-900">
                     <span className="flex items-center gap-3">
                       <FileText className="size-6 text-indigo-700" />
                       Formal Charge Sheet Explorer
                     </span>
                     <Button size="sm" variant="outline" className="gap-2 font-bold" onClick={() => window.print()}>
                       <Printer className="size-4" /> Print Document
                     </Button>
                  </DialogTitle>
                </DialogHeader>
                {selectedCharge && (
                  <div className="bg-white p-10 border border-slate-200 shadow-sm mx-auto w-full prose prose-slate">
                     {/* Official Document Header */}
                     <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
                        <div>
                           <div className="flex items-center gap-2 mb-2">
                             <Scale className="size-8 text-slate-900" />
                             <h2 className="text-xl font-black uppercase tracking-widest text-slate-900 m-0">Jijiga Bureau of Justice</h2>
                           </div>
                           <p className="text-sm font-bold text-slate-600 tracking-wider uppercase">Prosecution Office - High Court Detachment</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-sm font-bold text-slate-900 m-0">INDICTMENT FILED</p>
                          <p className="text-xs font-mono text-slate-600 m-0">{format(new Date(selectedCharge.filingDate), 'PPP, hh:mm a')}</p>
                        </div>
                     </div>
                     
                     {/* Case Particulars Grid */}
                     <div className="grid grid-cols-2 gap-8 mb-10 p-6 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="space-y-4">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Defendant</span>
                            <span className="text-base font-bold text-slate-900">{selectedCharge.defendant}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">State Custodian / Prosecutor</span>
                            <span className="text-sm font-bold text-slate-700">{selectedCharge.leadProsecutor}</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Court Case File</span>
                            <span className="text-sm font-mono font-bold text-indigo-700">{selectedCharge.caseNumber}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Indictment Reference</span>
                            <span className="text-sm font-mono font-bold text-slate-700">{selectedCharge.id.toUpperCase()}</span>
                          </div>
                        </div>
                     </div>

                     {/* The Charges */}
                     <div className="mb-10">
                        <h3 className="text-lg font-black uppercase tracking-widest text-red-700 border-b border-red-200 pb-2 mb-4">Statutory Charges</h3>
                        <p className="text-sm font-medium leading-relaxed text-slate-800 mb-4">
                          The Prosecution Office of the Jijiga Bureau of Justice, by this official indictment, brings forth the following criminal charges against <strong>{selectedCharge.defendant}</strong> for direct violation of the penal code:
                        </p>
                        <ul className="space-y-3 list-none pl-0">
                           {selectedCharge.primaryCharges.map((charge: string, idx: number) => (
                             <li key={idx} className="flex items-center gap-3 p-3 bg-red-50 border-l-4 border-red-600 rounded">
                               <ShieldAlert className="size-5 text-red-600 shrink-0" />
                               <span className="font-bold text-red-900 text-sm tracking-tight">{charge}</span>
                             </li>
                           ))}
                        </ul>
                     </div>

                     {/* Legal Boilerplate */}
                     <div className="text-justify space-y-4 text-xs leading-relaxed text-slate-500 border-t pt-6">
                        <p>
                          It is alleged that the defendant did, knowingly and willfully, commit the acts outlined in the attached evidentiary dossier, constituting offenses under the statutory codes listed above. The State requests that the defendant be held to answer for these charges before the High Court.
                        </p>
                        <p>
                          This document serves as the formal instrument of prosecution. The defendant retains all constitutional rights, including the presumption of innocence until proven guilty beyond a reasonable doubt in a court of law.
                        </p>
                     </div>

                     {/* Signatures */}
                     <div className="mt-16 pt-8 border-t border-slate-200 flex justify-between items-end">
                        <div className="text-center">
                           <div className="w-48 h-px bg-slate-400 mb-2" />
                           <p className="font-bold text-xs text-slate-900 uppercase tracking-wider">{selectedCharge.leadProsecutor}</p>
                           <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Chief Prosecutor</p>
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
