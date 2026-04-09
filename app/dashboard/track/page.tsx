'use client'

import { useState } from 'react'
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  FileText,
  MapPin,
  Calendar,
  User,
  ShieldCheck
} from 'lucide-react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { RoleSidebar } from '@/components/dashboard/role-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { useI18n } from '@/lib/i18n/context'
import { crimeReports, mockCases } from '@/lib/cms-data/mock-data'
import { cn } from '@/lib/utils'

export default function TrackCasePage() {
  const { locale } = useI18n()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [report, setReport] = useState<any>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    const query = searchQuery.trim().toLowerCase()
    if (!query) return

    setIsSearching(true)
    setHasSearched(true)
    
    // Simulate search latency
    setTimeout(() => {
      let found: any = crimeReports.find(r => r.reportNumber.toLowerCase() === query)
      
      if (!found) {
         // Also search official cases if report not found
         const foundCase = mockCases.find(c => c.caseNumber.toLowerCase() === query)
         if (foundCase) {
             found = {
                 reportNumber: foundCase.caseNumber,
                 status: foundCase.status,
                 submittedAt: foundCase.createdAt,
                 crimeType: foundCase.crimeType || foundCase.fir?.crimeType || 'Unknown Official Charge',
                 incidentDate: foundCase.fir?.incidentDate || foundCase.createdAt,
                 incidentLocation: foundCase.location || foundCase.fir?.incidentLocation || 'Jijiga Jurisdiction',
                 description: foundCase.description || foundCase.title || 'This case has been formally registered as a legal proceeding by the prosecutor.',
                 isAnonymous: false,
                 reporter: {
                     fullName: foundCase.defendants?.[0]?.name ? `State vs. ${foundCase.defendants[0].name}` : 'High Court Ledger',
                     phone: 'Public Record',
                     address: 'Court Judicial Archives'
                 }
             }
         }
      }
      
      setReport(found || null)
      setIsSearching(false)
    }, 1000)
  }

  const getStatusSteps = (status: string) => {
    const steps = [
      { id: 'submitted', label: 'Submitted', labelAm: 'ተገብቷል' },
      { id: 'acknowledged', label: 'Acknowledged', labelAm: 'ታይቷል' },
      { id: 'under_investigation', label: 'Investigation', labelAm: 'ምርመራ ላይ' },
      { id: 'converted_to_fir', label: 'FIR Registered', labelAm: 'FIR ተመዝግቧል' },
    ]

    // Special case for converted_to_fir being the terminal step in this UI
    let currentIndex = steps.findIndex(s => s.id === status)
    if (currentIndex === -1) {
       // if it's 'under_investigation' or something not explicitly in the list but implied
       currentIndex = 1;
    }

    return steps.map((step, index) => ({
      ...step,
      stepStatus: index < currentIndex ? 'completed' : index === currentIndex ? 'current' : 'upcoming'
    }))
  }

  return (
    <SidebarProvider>
      <RoleSidebar />
      <SidebarInset>
        <DashboardHeader 
          title="Track Your Case" 
          titleAm="ጉዳይ ይከታተሉ" 
        />
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Search Section */}
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tight">
                {locale === 'am' ? 'የጉዳይዎን ሁኔታ ይከታተሉ' : 'Track the Status of Your Case'}
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {locale === 'am' 
                  ? 'የሪፖርት ቁጥርዎን በማስገባት የእድገት ደረጃውን ይመልከቱ' 
                  : 'Enter your crime report reference number to see its current progress in the legal system.'}
              </p>
              
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <p className="text-xs text-muted-foreground w-full mb-1">Try a demo reference number:</p>
                {crimeReports.slice(0, 2).map(r => (
                  <button 
                    key={r.id}
                    onClick={() => { setSearchQuery(r.reportNumber); setTimeout(handleSearch, 100); }}
                    className="text-[10px] bg-muted hover:bg-primary/10 hover:text-primary px-2 py-1 rounded transition-colors font-mono"
                  >
                    {r.reportNumber}
                  </button>
                ))}
                {mockCases.slice(0, 3).map(c => (
                  <button 
                    key={c.id}
                    onClick={() => { setSearchQuery(c.caseNumber); setTimeout(handleSearch, 100); }}
                    className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-2 py-1 rounded transition-colors font-mono"
                  >
                    {c.caseNumber}
                  </button>
                ))}
              </div>
              
              <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto mt-4">
                <div className="relative flex-1 group">
                  <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    placeholder="e.g., JIG-RPT-2026-0012 or JIG-2026-CR-0001" 
                    className="pl-10 h-12 text-lg border-2 border-muted focus-visible:border-primary transition-all shadow-sm bg-card"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" className="h-12 px-8 text-lg shadow-lg shadow-primary/20" disabled={isSearching}>
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </form>

            </div>

            {hasSearched && !isSearching && !report && (
              <Card className="border-none shadow-md bg-destructive/5 text-center p-12 animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col items-center">
                  <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                    <AlertCircle className="size-8 text-destructive" />
                  </div>
                  <h2 className="text-xl font-bold">No Report Found</h2>
                  <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                    {locale === 'am' 
                      ? 'ከዚህ ቁጥር ጋር የሚገጥም ሪፖርት አልተገኘም። እባክዎ ቁጥሩን ያረጋግጡ።' 
                      : "We couldn't find a report matching that reference number. Please check the ID and try again."}
                  </p>
                </div>
              </Card>
            )}

            {report && !isSearching && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Status Overview Card */}
                <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-br from-card to-primary/5">
                  <div className="h-2 bg-primary w-full" />
                  <CardHeader className="pb-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <Badge variant="outline" className="mb-2 border-primary/20 text-primary bg-primary/5">
                          {report.reportNumber}
                        </Badge>
                        <CardTitle className="text-3xl font-bold">
                          Current Status: <span className="text-primary capitalize">{report.status.replace(/_/g, ' ')}</span>
                        </CardTitle>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Submitted on</p>
                        <p className="font-bold text-lg">{new Date(report.submittedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-8 pb-10">
                    {/* Visual Stepper */}
                    <div className="relative">
                      {/* Line - Desktop */}
                      <div className="absolute top-5 left-0 w-full h-1 bg-muted hidden md:block" />
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                        {getStatusSteps(report.status).map((step, index) => (
                          <div key={step.id} className="flex md:flex-col items-center gap-4 md:text-center group">
                            <div className={cn(
                              "size-10 rounded-full flex items-center justify-center transition-all duration-300 z-10",
                              step.stepStatus === 'completed' ? "bg-primary text-primary-foreground" :
                              step.stepStatus === 'current' ? "bg-primary text-primary-foreground ring-4 ring-primary/20 scale-125 shadow-lg" :
                              "bg-muted text-muted-foreground"
                            )}>
                              {step.stepStatus === 'completed' ? <CheckCircle2 className="size-6" /> : <span className="text-sm font-bold">{index + 1}</span>}
                            </div>
                            <div className="md:pt-2">
                              <p className={cn(
                                "font-bold transition-colors",
                                step.stepStatus === 'upcoming' ? "text-muted-foreground" : "text-foreground"
                              )}>
                                {locale === 'am' ? step.labelAm : step.label}
                              </p>
                              <p className="text-[10px] text-muted-foreground hidden md:block font-medium uppercase tracking-tight">
                                {step.id === 'submitted' ? new Date(report.submittedAt).toLocaleDateString() : 
                                 step.id === 'acknowledged' && report.acknowledgedAt ? new Date(report.acknowledgedAt).toLocaleDateString() : 
                                 step.stepStatus === 'completed' ? 'Processed' : 'Pending'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Report Details */}
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="border-none shadow-md overflow-hidden transition-all hover:shadow-lg">
                    <CardHeader className="bg-muted/30">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="size-5 text-primary" />
                        Incident Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Crime Type</p>
                          <p className="font-semibold capitalize text-foreground">{report.crimeType.replace(/_/g, ' ')}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Incident Date</p>
                          <p className="font-semibold text-foreground">{new Date(report.incidentDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Location</p>
                        <p className="font-semibold text-foreground">{report.incidentLocation}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Narrative</p>
                        <p className="text-sm leading-relaxed text-muted-foreground italic border-l-2 border-primary/20 pl-4 py-2 bg-primary/5 rounded-r-lg">
                          "{report.description}"
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-md overflow-hidden transition-all hover:shadow-lg">
                    <CardHeader className="bg-muted/30">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="size-5 text-primary" />
                        Reporter Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      {report.isAnonymous ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center bg-muted/20 rounded-xl border-2 border-dashed border-muted">
                          <ShieldCheck className="size-16 text-muted-foreground/40 mb-4" />
                          <p className="font-bold text-foreground">Anonymous Report</p>
                          <p className="text-xs text-muted-foreground px-6 mt-2">
                            Personal details were withheld by the reporter at the time of submission for privacy and safety.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="flex items-center gap-4">
                            <div className="size-14 rounded-2xl bg-primary shadow-lg shadow-primary/20 flex items-center justify-center text-primary-foreground text-xl font-bold">
                              {report.reporter?.fullName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-lg text-foreground">{report.reporter?.fullName}</p>
                              <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-medium">Verified Citizen</Badge>
                            </div>
                          </div>
                          <div className="grid gap-4 pt-2">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                              <div className="size-8 rounded-full bg-background flex items-center justify-center shadow-sm">
                                <Calendar className="size-4 text-primary" />
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Contact Phone</p>
                                <p className="text-sm font-medium">{report.reporter?.phone}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                              <div className="size-8 rounded-full bg-background flex items-center justify-center shadow-sm">
                                <MapPin className="size-4 text-primary" />
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Address</p>
                                <p className="text-sm font-medium line-clamp-1">{report.reporter?.address}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Next Steps */}
                <Card className="border-none shadow-lg bg-primary text-primary-foreground overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <Clock className="size-24" />
                  </div>
                  <CardContent className="p-8 relative z-10">
                    <div className="flex items-center gap-6">
                      <div className="size-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 shadow-inner">
                        <Clock className="size-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">Next Steps for Your Case</h3>
                        <p className="text-sm text-primary-foreground/90 leading-relaxed max-w-2xl">
                          {report.status === 'submitted' ? 'Your report has been successfully logged. An intake officer will review the details within 24 hours to determine the appropriate department for assignment.' :
                           report.status === 'acknowledged' ? 'The case has been received by the regional police headquarters. They are currently assigning a lead detective to begin the formal investigation process.' :
                           report.status === 'converted_to_fir' ? 'A formal First Information Report (FIR) has been registered. This is a significant milestone—the case is now officially part of the judicial oversight system.' :
                           'Our team is processing the latest updates. You will be notified of any significant changes in the case status.'}
                        </p>
                      </div>
                      <ArrowRight className="size-8 opacity-40 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
