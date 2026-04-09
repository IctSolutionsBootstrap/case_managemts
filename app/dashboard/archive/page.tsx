'use client'

import { useState } from 'react'
import { 
  Building2, 
  Search, 
  Filter, 
  Download, 
  RotateCcw, 
  Eye, 
  Calendar, 
  FileText,
  Database,
  ShieldAlert,
  ChevronRight,
  HardDrive
} from 'lucide-react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RoleSidebar } from '@/components/dashboard/role-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { useI18n } from '@/lib/i18n/context'
import { legalDocuments } from '@/lib/cms-data/mock-data'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import Link from 'next/link'

export default function ArchivePage() {
  const { locale } = useI18n()
  const [searchTerm, setSearchTerm] = useState('')
  const [yearFilter, setYearFilter] = useState('all')
  
  // Filter for archived documents
  const archivedDocs = legalDocuments.filter(doc => doc.status === 'archived')
  
  const filteredDocs = archivedDocs.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         doc.caseId?.toLowerCase().includes(searchTerm.toLowerCase())
    const docYear = new Date(doc.uploadedAt).getFullYear().toString()
    const matchesYear = yearFilter === 'all' || docYear === yearFilter
    
    return matchesSearch && matchesYear
  })

  return (
    <SidebarProvider>
      <RoleSidebar />
      <SidebarInset>
        <DashboardHeader 
          title="Archive Repository" 
          titleAm="መዝገብ ቤት" 
        />
        <main className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50/50">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Archive Branding & Stats */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="md:col-span-2 border-none shadow-lg bg-slate-900 text-slate-50 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <Database className="size-32" />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="size-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <Building2 className="size-6 text-primary" />
                    </div>
                    <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Deep Storage Vault</Badge>
                  </div>
                  <CardTitle className="text-3xl font-bold">Historical Records</CardTitle>
                  <CardDescription className="text-slate-400 text-lg max-w-md">
                    Secure archival repository for resolved cases and historical legal documentation for the Jijiga Region.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-8 mt-4 relative z-10">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1 border-b border-white/10 pb-1">Items Archived</p>
                    <p className="text-3xl font-bold mt-1">1,482</p>
                  </div>
                  <div className="w-px h-12 bg-white/10" />
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1 border-b border-white/10 pb-1">Storage Status</p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xl font-bold">82% Full</p>
                      <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[82%]" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShieldAlert className="size-5 text-amber-500" />
                    Security Notice
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Access to archived records is restricted to authorized personnel. All retrieval requests are logged and monitored by the Bureau of Justice.
                  </p>
                  <Button variant="outline" className="w-full justify-between group">
                    View Access Logs
                    <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Filter Bar */}
            <Card className="border-none shadow-md">
              <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by case number or document title..." 
                    className="pl-10 h-11"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="w-full md:w-[180px] h-11">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4" />
                      <SelectValue placeholder="Year" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="h-11 px-6">
                  Apply Filters
                </Button>
              </CardContent>
            </Card>

            {/* Archive List */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-700">
                <HardDrive className="size-5 text-slate-400" />
                Retrieved Documents ({filteredDocs.length})
              </h2>
              
              <div className="grid gap-4">
                {filteredDocs.length > 0 ? (
                  filteredDocs.map((doc) => (
                    <Card key={doc.id} className="border-none shadow-sm hover:shadow-md transition-all group border-l-4 border-slate-300">
                      <CardContent className="flex items-center justify-between p-6">
                        <div className="flex items-center gap-4">
                          <div className="size-12 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                            <FileText className="size-6 text-slate-500" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-lg">{doc.title}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-1">
                                <span className="size-1.5 rounded-full bg-slate-300" />
                                {doc.caseId}
                              </span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="size-3" />
                                Archived: {format(new Date(doc.uploadedAt), 'MMM yyyy')}
                              </span>
                              <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none capitalize text-[10px] h-5">
                                {doc.type.replace(/_/g, ' ')}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary">
                            <Eye className="size-5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-green-600">
                            <Download className="size-5" />
                          </Button>
                          <div className="w-px h-6 bg-slate-100 mx-1" />
                          <Button variant="outline" size="sm" className="gap-2 border-slate-200 text-slate-600 hover:bg-slate-50">
                            <RotateCcw className="size-4" />
                            Restore
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="border-dashed py-12 text-center bg-transparent">
                    <CardContent>
                      <Database className="size-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                      <h3 className="text-lg font-medium text-muted-foreground">No records found in the vault</h3>
                      <p className="text-sm text-muted-foreground mt-1">Try adjusting your search terms or year filter.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Archival Policy */}
            <div className="pt-8 border-t border-slate-200">
              <p className="text-xs text-slate-400 text-center leading-relaxed max-w-2xl mx-auto">
                In accordance with the Ministry of Justice Records Management Policy (v2.1), files are kept in active storage for 5 years before being moved to deep archival. All metadata in this vault is encrypted at rest using AES-256 standards.
              </p>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
