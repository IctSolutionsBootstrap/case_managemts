'use client'

import { useState } from 'react'
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  Plus, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  Scale,
  Gavel,
  AlertCircle,
  CheckCircle2,
  CalendarCheck
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
import { RoleSidebar } from '@/components/dashboard/role-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { useI18n } from '@/lib/i18n/context'
import { courtHearings, criminalCases } from '@/lib/cms-data/mock-data'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function SchedulePage() {
  const { locale } = useI18n()
  const [currentDate, setCurrentDate] = useState(new Date('2026-04-09')) // Mock "today"
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)

  const stats = [
    { label: locale === 'am' ? 'ዛሬ የተያዘ' : 'Scheduled Today', value: '6', icon: CalendarCheck, color: 'text-blue-500', bg: 'bg-blue-100' },
    { label: locale === 'am' ? 'ገባሪ ችሎቶች' : 'Courtrooms Active', value: '4/5', icon: MapPin, color: 'text-green-500', bg: 'bg-green-100' },
    { label: locale === 'am' ? 'የሚጠባበቁ ጥያቄዎች' : 'Pending Requests', value: '12', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-100' },
    { label: locale === 'am' ? 'የሚቀጥለው ሳምንት' : 'Next Week', value: '28', icon: CalendarIcon, color: 'text-purple-500', bg: 'bg-purple-100' },
  ]

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'
  ]

  const courtrooms = ['Courtroom 1', 'Courtroom 2', 'Courtroom 3', 'Courtroom 4']

  return (
    <SidebarProvider>
      <RoleSidebar />
      <SidebarInset>
        <DashboardHeader 
          title="Court Schedule" 
          titleAm="የፍርድ ቤት መርሃ ግብር" 
        />
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                   <CalendarIcon className="size-8 text-indigo-600" />
                   {locale === 'am' ? 'የፍርድ ቤት መርሃ ግብር' : 'Judicial Master Schedule'}
                </h1>
                <p className="text-muted-foreground mt-1 text-lg">
                   {locale === 'am' 
                     ? 'የችሎት ቀጠሮዎችን እና የችሎት ክፍሎችን ማስተዳደሪያ' 
                     : 'Manage hearing dockets and courtroom allocations for the Jijiga High Court.'}
                </p>
              </div>
              <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100" onClick={() => setIsScheduleDialogOpen(true)}>
                    <Plus className="size-5" /> Schedule Hearing
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">New Hearing Entry</DialogTitle>
                    <DialogDescription>Assign a new court date and location for an active case.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="caseSelect" className="text-right text-xs font-bold font-mono">CASE ID</Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select case..." />
                        </SelectTrigger>
                        <SelectContent>
                          {criminalCases.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.caseNumber} - {(c.title || '').split(' vs ')[0]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="judge" className="text-right text-xs font-bold font-mono">JUDGE</Label>
                      <Select defaultValue="bereket">
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select judge..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bereket">Hon. Bereket Tessema</SelectItem>
                          <SelectItem value="halima">Hon. Halima Abdi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="date" className="text-right text-xs font-bold font-mono">DATE/TIME</Label>
                      <div className="col-span-3 flex gap-2">
                        <Input type="date" className="flex-1" />
                        <Input type="time" className="w-[120px]" />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="courtroom" className="text-right text-xs font-bold font-mono">ROOM</Label>
                      <Select defaultValue="cr1">
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select courtroom..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cr1">Courtroom 1 (High Court)</SelectItem>
                          <SelectItem value="cr2">Courtroom 2 (Administrative)</SelectItem>
                          <SelectItem value="cr3">Courtroom 3 (Small Claims)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>Preview Docket</Button>
                    <Button type="button" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setIsScheduleDialogOpen(false)}>Confirm Schedule</Button>
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
                        <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                        <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">{stat.label}</p>
                      </div>
                    </div>
                    <div className={cn("h-1 w-full", stat.bg === 'bg-blue-100' ? 'bg-blue-200' : stat.bg === 'bg-green-100' ? 'bg-green-200' : stat.bg === 'bg-amber-100' ? 'bg-amber-200' : 'bg-purple-200')} />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Calendar/Daily View Section */}
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Daily Timeline */}
              <div className="lg:col-span-3 space-y-4">
                <Card className="border-none shadow-xl border border-slate-200 overflow-hidden bg-white">
                  <CardHeader className="bg-slate-900 text-white p-8 border-none relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                       <CalendarIcon className="size-32" />
                    </div>
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-6">
                        <div className="size-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                           <CalendarCheck className="size-8 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-3xl font-black">{format(currentDate, 'EEEE, MMMM d')}</CardTitle>
                          <CardDescription className="text-indigo-200 text-lg font-medium">Daily Hearing Agenda & Courtroom Availability</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white/10 p-1.5 rounded-xl border border-white/10">
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-white hover:bg-white/20 rounded-lg">
                          <ChevronLeft className="size-5" />
                        </Button>
                        <div className="px-4 font-black text-sm tracking-widest">TODAY</div>
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-white hover:bg-white/20 rounded-lg">
                          <ChevronRight className="size-5" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="flex flex-col divide-y divide-slate-100">
                      {timeSlots.map((time) => (
                        <div key={time} className="flex min-h-[120px] group hover:bg-slate-50/30 transition-colors">
                          <div className="w-28 flex items-start justify-center pt-8 bg-slate-50/50 border-r border-slate-100">
                             <span className="text-sm font-black text-slate-400 font-mono tracking-tighter tabular-nums">{time}</span>
                          </div>
                          <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
                             {/* Simulate hearing entries */}
                             {time === '10:00' && (
                               <div className="col-span-1 md:col-span-2 p-5 rounded-2xl bg-indigo-50 border-l-8 border-indigo-600 shadow-lg shadow-indigo-100/50 flex flex-col justify-between group-hover:scale-[1.01] transition-transform cursor-pointer">
                                 <div>
                                    <div className="flex items-center justify-between">
                                      <Badge variant="outline" className="text-[10px] font-black bg-white text-indigo-700 h-5 border-indigo-200 uppercase tracking-widest px-2">Criminal Trial</Badge>
                                      <span className="text-xs text-indigo-400 font-black px-2 py-1 bg-indigo-100/50 rounded-lg">COURTROOM 1</span>
                                    </div>
                                    <h4 className="font-black text-lg mt-3 text-indigo-950">State of Ethiopia vs. Ahmed Barkhadle</h4>
                                    <div className="flex items-center gap-4 mt-2">
                                       <div className="flex items-center gap-1.5 text-xs text-indigo-600/80 font-bold">
                                          <User className="size-3.5" /> Hon. Bereket Tessema
                                       </div>
                                       <div className="flex items-center gap-1.5 text-xs text-indigo-600/80 font-bold">
                                          <Clock className="size-3.5" /> 2.5 Hours Est.
                                       </div>
                                    </div>
                                 </div>
                               </div>
                             )}
                             {time === '14:00' && (
                               <div className="col-span-1 md:col-span-1 p-5 rounded-2xl bg-amber-50 border-l-8 border-amber-600 shadow-lg shadow-amber-100/50 flex flex-col justify-between group-hover:scale-[1.01] transition-transform cursor-pointer">
                                  <div>
                                    <div className="flex items-center justify-between">
                                      <Badge variant="outline" className="text-[10px] font-black bg-white text-amber-700 h-5 border-amber-200 uppercase tracking-widest px-2">Arraignment</Badge>
                                      <span className="text-xs text-amber-400 font-black px-2 py-1 bg-amber-100/50 rounded-lg">COURTROOM 4</span>
                                    </div>
                                    <h4 className="font-black text-lg mt-3 text-amber-950 truncate underline decoration-amber-200 decoration-4 underline-offset-4">JIG-AR-2026-0042</h4>
                                    <p className="text-xs text-amber-700/70 font-bold mt-2 flex items-center gap-1.5">
                                      <User className="size-3.5" /> Duty Magistrate
                                    </p>
                                  </div>
                               </div>
                             )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <Card className="border-none shadow-xl bg-white overflow-hidden">
                  <CardHeader className="pb-4 border-b">
                    <CardTitle className="text-lg flex items-center gap-2 font-black text-slate-800 uppercase tracking-tight">
                       <Gavel className="size-5 text-indigo-600" />
                       Allocation Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {courtrooms.map(room => (
                      <div key={room} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black font-mono text-slate-500 uppercase tracking-widest">{room}</span>
                          <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter", 
                            room === 'Courtroom 1' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700')}>
                            {room === 'Courtroom 1' ? '85% BUSY' : '45% CAPACITY'}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full transition-all duration-500", 
                              room === 'Courtroom 1' ? 'w-[85%] bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.3)]' : 'w-[45%] bg-indigo-300')} 
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-none shadow-xl bg-slate-50 border-dashed border-2 border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer group">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="size-16 rounded-3xl bg-white flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition-transform">
                      <Clock className="size-8 text-indigo-500" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-lg uppercase tracking-tight">Waiting for Entry</h4>
                      <p className="text-xs text-muted-foreground mt-2 font-medium leading-relaxed">
                        There are **12 cases** currently awaiting official hearing dates and judge allocation.
                      </p>
                    </div>
                    <Button variant="outline" className="w-full text-xs font-black border-slate-300 h-10 tracking-widest hover:bg-slate-900 hover:text-white transition-colors">
                      OPEN REQUEST QUEUE
                    </Button>
                  </CardContent>
                </Card>

                <div className="p-8 rounded-3xl bg-amber-50 border border-amber-100 flex items-start gap-4 shadow-sm relative overflow-hidden group">
                   <div className="absolute top-[-10px] right-[-10px] size-20 bg-amber-200/20 rounded-full blur-2xl group-hover:bg-amber-400/20 transition-all" />
                   <AlertCircle className="size-6 text-amber-600 shrink-0 mt-0.5" />
                   <div className="space-y-2 relative z-10">
                      <p className="font-black text-sm text-amber-900 uppercase tracking-tighter">Holiday Schedule Update</p>
                      <p className="text-xs text-amber-800/80 leading-relaxed font-bold">
                        April 12th is a facility holiday. All scheduled hearings for that day will be automatically moved to the next business day.
                      </p>
                   </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
