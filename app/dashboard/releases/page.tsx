'use client'

import { useState } from 'react'
import { 
  LogOut, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  Calendar,
  UserCheck,
  FileText,
  Briefcase,
  ExternalLink,
  Plus,
  ArrowRight,
  MoreVertical,
  History,
  AlertCircle,
  ShieldAlert,
  ChevronRight,
  Gavel
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
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { RoleSidebar } from '@/components/dashboard/role-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { useI18n } from '@/lib/i18n/context'
import { inmates as initialInmates } from '@/lib/cms-data/mock-data'
import { format, isAfter, isBefore, addDays } from 'date-fns'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function ReleasesPage() {
  const { locale } = useI18n()
  const [searchTerm, setSearchTerm] = useState('')
  const [inmateList, setInmateList] = useState(initialInmates)
  const [currentProtocolStep, setCurrentProtocolStep] = useState(2) // Start at step 3 (index 2)
  const [activeInmateId, setActiveInmateId] = useState<string | null>(null)
  const [isParoleDialogOpen, setIsParoleDialogOpen] = useState(false)
  const [isProtocolDialogOpen, setIsProtocolDialogOpen] = useState(false)
  
  const now = new Date('2026-04-09')
  
  const upcomingReleases = inmateList.filter(i => 
    i.status === 'serving' && 
    isAfter(new Date(i.sentenceEndDate), now) && 
    isBefore(new Date(i.sentenceEndDate), addDays(now, 90))
  ).sort((a, b) => new Date(a.sentenceEndDate).getTime() - new Date(b.sentenceEndDate).getTime())

  const completedReleases = inmateList.filter(i => i.status === 'released')

  const stats = [
    { label: 'Released Today', value: '1', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-100' },
    { label: 'Releases This Week', value: '3', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-100' },
    { label: 'Parole Reviews', value: '5', icon: FileText, color: 'text-amber-500', bg: 'bg-amber-100' },
    { label: 'Total Historical', value: completedReleases.length.toString(), icon: History, color: 'text-slate-500', bg: 'bg-slate-100' },
  ]

  const handleCompleteStep = () => {
    if (currentProtocolStep < 3) {
      setCurrentProtocolStep(prev => prev + 1)
    } else {
      // Finalize discharge
      if (activeInmateId) {
        setInmateList(prev => prev.map(i => 
          i.id === activeInmateId 
            ? { ...i, status: 'released', releaseDate: new Date() } 
            : i
        ))
        setIsProtocolDialogOpen(false)
        setActiveInmateId(null)
        setCurrentProtocolStep(2)
      }
    }
  }

  const startProtocol = (id: string) => {
    setActiveInmateId(id)
    setCurrentProtocolStep(2) // Default to step 3 for the demo
    setIsProtocolDialogOpen(true)
  }

  return (
    <SidebarProvider>
      <RoleSidebar />
      <SidebarInset>
        <DashboardHeader 
          title="Inmate Releases" 
          titleAm="የእስረኞች መልቀቂያ" 
        />
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                  <ShieldCheck className="size-8 text-green-600" />
                  {locale === 'am' ? 'የእስረኞች መልቀቂያ' : 'Inmate Release Management'}
                </h1>
                <p className="text-muted-foreground mt-1 text-lg">
                  {locale === 'am' 
                    ? 'የእስረኞችን መለቀቅ እና ሂደቶችን ማስተዳደሪያ' 
                    : 'Monitor upcoming discharges and manage formal inmate release protocols.'}
                </p>
              </div>
              
              <Dialog open={isParoleDialogOpen} onOpenChange={setIsParoleDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2 bg-green-600 hover:bg-green-700 shadow-lg shadow-green-100">
                    <Plus className="size-5" /> Schedule Parole Review
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                       <Gavel className="size-5 text-primary" />
                       Schedule Parole Hearing
                    </DialogTitle>
                    <DialogDescription>
                      Create a formal parole review request for an eligible inmate.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Inmate Number</Label>
                      <Input placeholder="e.g. JIG-INM-..." />
                    </div>
                    <div className="space-y-2">
                      <Label>Review Type</Label>
                      <Select defaultValue="periodic">
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="periodic">Periodic Sentence Review</SelectItem>
                          <SelectItem value="behavioral">Good Behavior Commutation</SelectItem>
                          <SelectItem value="parole">Parole Eligibility Hearing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Hearing Date (Proposed)</Label>
                      <Input type="date" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsParoleDialogOpen(false)}>Cancel</Button>
                    <Button onClick={() => setIsParoleDialogOpen(false)}>Submit Request</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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

            {/* Upcoming Releases Table */}
            <Card className="border-none shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
                <div>
                  <CardTitle className="text-xl">Upcoming Discharges (Next 90 Days)</CardTitle>
                  <CardDescription>Inmates scheduled for release based on sentence completion.</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by ID..." 
                    className="pl-9 w-[200px] h-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="pl-6 h-12 text-slate-700">Inmate</TableHead>
                      <TableHead className="h-12 text-slate-700">Sentence Completion</TableHead>
                      <TableHead className="h-12 text-slate-700">Facility Status</TableHead>
                      <TableHead className="h-12 text-slate-700">Protocol Status</TableHead>
                      <TableHead className="text-right pr-6 h-12 text-slate-700">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingReleases.length > 0 ? (
                      upcomingReleases.map((inmate) => (
                        <TableRow key={inmate.id} className="hover:bg-muted/20 transition-colors border-b last:border-0">
                          <TableCell className="pl-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="size-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs border border-slate-200">
                                {inmate.suspect?.fullName?.charAt(0) || 'U'}
                              </div>
                              <div className="flex flex-col">
                                <p className="font-bold text-sm text-slate-800">{inmate.suspect?.fullName || 'Unknown'}</p>
                                <code className="text-[10px] text-muted-foreground">{inmate.inmateNumber}</code>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-green-600">{format(new Date(inmate.sentenceEndDate), 'MMM d, yyyy')}</span>
                              <span className="text-[10px] text-muted-foreground uppercase">{inmate.remainingDays} Days Left</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-[10px] px-1.5 py-0 h-5 font-normal">
                              {inmate.cellBlock}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                               <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-green-500 w-[75%]" />
                               </div>
                               <span className="text-[10px] font-bold text-slate-500">75%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <Button size="sm" variant="outline" className="h-8 gap-1.5 border-green-200 text-green-700 hover:bg-green-50 font-medium px-3 text-xs" onClick={() => startProtocol(inmate.id)}>
                              <LogOut className="size-3.5" /> Start Protocol
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-20 text-muted-foreground italic">
                           No upcoming releases found within the next 90 days.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Historical Releases Log */}
            <Card className="border-none shadow-xl overflow-hidden bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
                <CardTitle className="text-lg flex items-center gap-2 font-bold text-slate-700">
                  <History className="size-5 text-slate-400" />
                  Historical Release Records ({completedReleases.length})
                </CardTitle>
                <Button variant="ghost" size="sm" className="gap-1 text-primary h-8 px-2 font-semibold hover:bg-primary/5">
                  Full Archives <ArrowRight className="size-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid divide-y">
                  {completedReleases.length > 0 ? (
                    completedReleases.map((release) => (
                      <div key={release.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-center gap-4">
                           <div className="size-11 rounded-full bg-green-100 flex items-center justify-center text-green-600 border border-green-200">
                              <UserCheck className="size-6" />
                           </div>
                           <div className="flex flex-col">
                              <p className="font-bold text-sm text-slate-800">{release.suspect?.fullName}</p>
                              <div className="flex items-center gap-3 mt-0.5">
                                 <span className="text-[10px] text-muted-foreground font-mono">{release.inmateNumber}</span>
                                 <Badge variant="outline" className="text-[9px] h-4 py-0 bg-green-50 text-green-700 border-green-200 px-1.5 font-bold">DISCHARGED</Badge>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-6 mt-4 md:mt-0">
                           <div className="text-right">
                              <p className="text-[10px] uppercase text-slate-400 font-bold tracking-tight">Release Date</p>
                              <p className="text-sm font-bold mt-1 text-slate-700">
                                {release.releaseDate ? format(new Date(release.releaseDate), 'MMM d, yyyy') : 'Jan 10, 2026'}
                              </p>
                           </div>
                           <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-slate-900 border border-transparent hover:bg-slate-100">
                              <ExternalLink className="size-4" />
                           </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground italic">
                       No historical releases found.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Shared Discharge Protocol Dialog */}
            <Dialog open={isProtocolDialogOpen} onOpenChange={setIsProtocolDialogOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                    <ShieldCheck className="size-6 text-green-600" />
                    Interactive Discharge Protocol
                  </DialogTitle>
                  <DialogDescription className="text-sm">
                    Step-by-step verification process for official facility discharge.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  {[
                    { title: "Judicial Order", desc: "Court release warrant verified and filed.", step: 0 },
                    { title: "Biometrics", desc: "Exit fingerprints captured and matched.", step: 1 },
                    { title: "Personal Effects", desc: "Return of logged property and valuables.", step: 2 },
                    { title: "Final Clearance", desc: "Digital sign-off by Facility Supervisor.", step: 3 }
                  ].map((s, i) => (
                    <div key={i} className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border transition-all",
                      currentProtocolStep > s.step ? "bg-green-50 text-green-800 border-green-100" : 
                      currentProtocolStep === s.step ? "bg-primary/5 text-primary border-primary/20 shadow-md ring-1 ring-primary/20" :
                      "bg-white border-slate-200 text-slate-400 grayscale opacity-60"
                    )}>
                      {currentProtocolStep > s.step ? (
                        <CheckCircle2 className="size-5 shrink-0" />
                      ) : (
                        <div className={cn("size-5 rounded-full border-2 shrink-0 flex items-center justify-center text-[10px] font-bold", 
                          currentProtocolStep === s.step ? "border-primary" : "border-slate-200")}>
                          {s.step + 1}
                        </div>
                      )}
                      <div className="text-sm space-y-0.5">
                        <p className="font-bold uppercase tracking-tight text-[10px]">Step {s.step + 1}: {s.title}</p>
                        <p className={cn("font-medium", currentProtocolStep === s.step ? "text-slate-900" : "")}>{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setIsProtocolDialogOpen(false)}>Cancel</Button>
                  <Button className="flex-1 bg-green-600 hover:bg-green-700 h-10 font-bold" onClick={handleCompleteStep}>
                    {currentProtocolStep < 3 ? "Complete Current Step" : "Finalize Discharge"}
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
