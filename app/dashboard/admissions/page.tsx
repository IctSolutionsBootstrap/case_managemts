'use client'

import { useState } from 'react'
import { 
  UserPlus, 
  Search, 
  Filter, 
  Plus, 
  ClipboardCheck, 
  CheckCircle2, 
  Clock, 
  ShieldAlert,
  Fingerprint,
  Stethoscope,
  Briefcase,
  MoreVertical,
  Calendar,
  ChevronRight,
  UserCheck
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
import { inmates } from '@/lib/cms-data/mock-data'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function AdmissionsPage() {
  const { locale } = useI18n()
  const [searchTerm, setSearchTerm] = useState('')
  
  // Sort inmates by most recent admission
  const recentAdmissions = [...inmates].sort((a, b) => 
    new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime()
  )

  const stats = [
    { label: 'Awaiting Intake', value: '3', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-100' },
    { label: 'Admitted Today', value: '2', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-100' },
    { label: 'Medical Clearance', value: '1', icon: Stethoscope, color: 'text-blue-500', bg: 'bg-blue-100' },
    { label: 'Biometrics Pending', value: '4', icon: Fingerprint, color: 'text-purple-500', bg: 'bg-purple-100' },
  ]

  return (
    <SidebarProvider>
      <RoleSidebar />
      <SidebarInset>
        <DashboardHeader 
          title="Inmate Admissions" 
          titleAm="የእስረኞች ገቢ" 
        />
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                  <UserCheck className="size-8 text-primary" />
                  {locale === 'am' ? 'የእስረኞች ገቢ' : 'Inmate Admissions'}
                </h1>
                <p className="text-muted-foreground mt-1 text-lg">
                  {locale === 'am' 
                    ? 'አዲስ የሚገቡ እስረኞችን መመዝገቢያ እና ማስተዳደሪያ' 
                    : 'Manage the secure intake processing and registry of new arrivals.'}
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2 shadow-lg shadow-primary/20">
                    <Plus className="size-5" /> New Intake
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>New Admission Protocol</DialogTitle>
                    <DialogDescription>
                      Complete the mandatory intake checklist for the newly arrived individual.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="caseId" className="text-right">Case ID</Label>
                      <Input id="caseId" value="JIG-RPT-2026-0042" className="col-span-3" readOnly />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">Type</Label>
                      <Select defaultValue="pre_trial">
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pre_trial">Pre-Trial Detention</SelectItem>
                          <SelectItem value="sentenced">Sentenced Convict</SelectItem>
                          <SelectItem value="remand">Remand</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="cell" className="text-right">Cell Block</Label>
                      <Input id="cell" placeholder="e.g. Block A - Cell 12" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 gap-4 mt-2">
                      <div className="col-start-2 col-span-3 space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="size-5 rounded border border-primary/20 bg-primary/5 flex items-center justify-center">
                            <CheckCircle2 className="size-3 text-primary" />
                          </div>
                          ID Verified with Court Order
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="size-5 rounded border border-primary/20 bg-primary/5 flex items-center justify-center">
                            <CheckCircle2 className="size-3 text-primary" />
                          </div>
                          Physical Search Completed
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="size-5 rounded border border-dashed border-muted flex items-center justify-center" />
                          Medical Screening Pending
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button type="submit">Submit Admission</Button>
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
                    <div className={cn("h-1 w-full", stat.bg.replace('100', '200'))} />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Registry and Filters */}
            <Card className="border-none shadow-xl overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0 border-b">
                <div>
                  <CardTitle className="text-xl">Recent Admissions Log</CardTitle>
                  <CardDescription>Individuals admitted to the facility in the last 30 days.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search by ID or name..." 
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
                      <TableHead className="pl-6 h-12">Inmate Entry</TableHead>
                      <TableHead className="h-12">Case Source</TableHead>
                      <TableHead className="h-12">Admission Date</TableHead>
                      <TableHead className="h-12">Intake Status</TableHead>
                      <TableHead className="text-right pr-6 h-12">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentAdmissions.length > 0 ? (
                      recentAdmissions.map((inmate) => (
                        <TableRow key={inmate.id} className="hover:bg-muted/20 transition-colors border-b last:border-0">
                          <TableCell className="pl-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="size-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xs">
                                {inmate.suspect?.fullName?.charAt(0) || 'U'}
                              </div>
                              <div className="flex flex-col">
                                <p className="font-bold text-sm text-slate-800">{inmate.suspect?.fullName || 'Unknown Inmate'}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <Badge variant="outline" className="text-[10px] h-4 font-mono px-1 py-0 font-normal">
                                    {inmate.inmateNumber}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <ClipboardCheck className="size-4 text-slate-400" />
                              <Link href={`/dashboard/cases/${inmate.caseId}`} className="font-medium text-primary hover:underline">
                                {inmate.caseId.toUpperCase()}
                              </Link>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold">{format(new Date(inmate.admissionDate), 'MMM d, yyyy')}</span>
                              <span className="text-[10px] text-muted-foreground uppercase">{format(new Date(inmate.admissionDate), 'p')}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-2 py-0 h-5 font-bold uppercase text-[9px]">Cleared</Badge>
                              <div className="flex gap-1.5 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-help">
                                <Fingerprint className="size-4 text-slate-600" title="Biometrics Captured" />
                                <Stethoscope className="size-4 text-slate-600" title="Health Screened" />
                                <Briefcase className="size-4 text-slate-600" title="Personal Property Logged" />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                              <MoreVertical className="size-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-20 text-muted-foreground">
                          No recent admissions found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Protocol Notice */}
            <div className="rounded-2xl border border-primary/10 bg-primary/5 p-8 border-dashed">
              <div className="flex items-start gap-6">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <ShieldAlert className="size-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-primary text-xl">Intake Safety Protocol</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Every new admission must undergo the three pillars of intake: **Identity Verification**, **Medical Clearance**, and **Security Screening**. 
                    Fingerprints must be digitized and cross-referenced with the Jijiga Bureau of Investigation database before cell assignment.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-primary font-bold gap-1 mt-4 text-base" asChild>
                    <Link href="#">
                      Review MoJ Guidelines (v4.0) <ChevronRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
