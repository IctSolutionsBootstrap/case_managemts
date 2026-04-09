'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { 
  FileText, 
  Search, 
  Filter, 
  UploadCloud, 
  Scale, 
  Image as ImageIcon,
  FileBarChart,
  Stethoscope,
  Shield,
  Eye,
  Download,
  Printer,
  Calendar,
  User as UserIcon,
  Tag
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
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RoleSidebar } from '@/components/dashboard/role-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { useI18n } from '@/lib/i18n/context'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

// Mock Document Data
const getMockDocumentsForCase = (caseId: string) => [
  {
    id: 'doc-001',
    title: 'Initial FIR Report',
    type: 'police_report',
    uploadedBy: 'Sgt. Ahmed Ali',
    uploadDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    size: '145 KB',
    status: 'verified'
  },
  {
    id: 'doc-002',
    title: 'Evidence Photograph 1 (Weapon)',
    type: 'physical_evidence',
    uploadedBy: 'Officer Hassan',
    uploadDate: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
    size: '2.4 MB',
    status: 'verified'
  },
  {
    id: 'doc-003',
    title: 'Medical Examiner Report',
    type: 'medical',
    uploadedBy: 'Dr. Fatima Yusuf',
    uploadDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    size: '890 KB',
    status: 'pending_review'
  },
  {
    id: 'doc-004',
    title: 'Magistrate Remand Extension Order',
    type: 'court_order',
    uploadedBy: 'Clerk Office',
    uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    size: '560 KB',
    status: 'verified'
  }
]

const getIconForType = (type: string) => {
  switch (type) {
    case 'police_report': return <FileBarChart className="size-4 text-blue-600" />
    case 'physical_evidence': return <ImageIcon className="size-4 text-purple-600" />
    case 'medical': return <Stethoscope className="size-4 text-red-600" />
    case 'court_order': return <Scale className="size-4 text-amber-700" />
    default: return <FileText className="size-4 text-slate-600" />
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'police_report': return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'physical_evidence': return 'bg-purple-100 text-purple-700 border-purple-200'
    case 'medical': return 'bg-red-100 text-red-700 border-red-200'
    case 'court_order': return 'bg-amber-100 text-amber-700 border-amber-200'
    default: return 'bg-slate-100 text-slate-700 border-slate-200'
  }
}

export default function CaseDocumentsPage() {
  const params = useParams()
  const caseId = (params.id as string).toUpperCase()
  const { locale, t } = useI18n()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<any>(null)
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  // Fetch mock data tied to this dynamic route
  const documents = getMockDocumentsForCase(caseId)

  const filteredDocs = documents.filter(d => 
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleReviewDoc = (doc: any) => {
    setSelectedDoc(doc)
    setIsViewerOpen(true)
  }

  return (
    <SidebarProvider>
      <RoleSidebar />
      <SidebarInset>
        <DashboardHeader 
          title="Case Document Repository" 
          titleAm="የጉዳይ ሰነዶች ማከማቻ" 
        />
        <main className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50/50">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Context Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-slate-900 rounded-xl shadow-lg text-white pattern-boxes pattern-slate-800 pattern-bg-transparent pattern-size-4 pattern-opacity-20">
              <div className="z-10">
                <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700 mb-2">FILE DOSSIER</Badge>
                <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                  <FolderOpen className="size-8 text-indigo-400" />
                  CASE REFERENCE: {caseId}
                </h1>
                <p className="text-slate-400 mt-1 text-sm font-medium">
                  Centralized secure repository for all evidentiary and administrative files associated with this specific case.
                </p>
              </div>
              <div className="z-10 flex gap-2">
                 <Button className="font-bold border-slate-600 bg-slate-800 hover:bg-slate-700 text-white" variant="outline">
                   <Download className="size-4 mr-2" /> Export All
                 </Button>
                 <Button className="font-bold bg-indigo-600 hover:bg-indigo-500 shadow-md transition-transform hover:scale-105" onClick={() => setIsUploadOpen(true)}>
                   <UploadCloud className="size-4 mr-2" /> Upload File
                 </Button>
              </div>
            </div>

            {/* Document Registry Matrix */}
            <Card className="shadow-lg overflow-hidden border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b bg-white">
                <div>
                  <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Shield className="size-5 text-indigo-500" /> Authorized Registry
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input 
                      placeholder="Search files..." 
                      className="pl-9 w-[280px] h-9 bg-slate-50 border-slate-200"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="sm" className="h-9 gap-2 font-bold border-slate-200 bg-white">
                    <Filter className="size-4" /> Categorize
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 bg-white">
                <Table>
                  <TableHeader className="bg-slate-50/80">
                    <TableRow className="border-slate-200">
                      <TableHead className="pl-6 h-12 text-slate-900 font-black uppercase text-[10px] tracking-widest">Document Title</TableHead>
                      <TableHead className="h-12 text-slate-900 font-black uppercase text-[10px] tracking-widest">Category</TableHead>
                      <TableHead className="h-12 text-slate-900 font-black uppercase text-[10px] tracking-widest">Audit Trail</TableHead>
                      <TableHead className="h-12 text-slate-900 font-black uppercase text-[10px] tracking-widest">Size</TableHead>
                      <TableHead className="text-right pr-6 h-12 text-slate-900 font-black uppercase text-[10px] tracking-widest">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocs.map((doc) => (
                      <TableRow key={doc.id} className="transition-colors border-b-slate-100 last:border-0 group hover:bg-indigo-50/50">
                        <TableCell className="pl-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded bg-slate-100 flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
                               {getIconForType(doc.type)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-sm text-slate-900 group-hover:text-indigo-700 transition-colors cursor-pointer" onClick={() => handleReviewDoc(doc)}>
                                {doc.title}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase tracking-wider">{doc.id}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                           <Badge variant="outline" className={cn("px-2 py-0.5 h-auto text-[10px] font-bold uppercase tracking-wider border", getTypeColor(doc.type))}>
                             <Tag className="size-3 mr-1" /> {doc.type.replace('_', ' ')}
                           </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                             <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                               <UserIcon className="size-3" /> {doc.uploadedBy}
                             </div>
                             <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                               <Calendar className="size-3" /> {format(new Date(doc.uploadDate), 'MMM d, yyyy - HH:mm')}
                             </div>
                          </div>
                        </TableCell>
                        <TableCell>
                           <span className="text-xs font-mono text-slate-500 font-bold">{doc.size}</span>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                           <Button variant="outline" size="sm" className="h-8 gap-2 font-bold text-indigo-700 border-indigo-200 bg-white hover:bg-indigo-50 px-3" onClick={() => handleReviewDoc(doc)}>
                             <Eye className="size-3.5" /> View
                           </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Document Viewer Modal */}
            <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
              <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col p-0 overflow-hidden bg-slate-100">
                {selectedDoc && (
                  <>
                    <DialogHeader className="px-6 py-4 border-b bg-white shrink-0 flex flex-row items-start justify-between">
                      <div className="space-y-1">
                        <DialogTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
                           {getIconForType(selectedDoc.type)} {selectedDoc.title}
                        </DialogTitle>
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
                           <span>{caseId}</span>
                           <span>•</span>
                           <span className={getTypeColor(selectedDoc.type).split(' ')[1]}>{selectedDoc.type.replace('_', ' ')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                         <Button size="sm" variant="outline" className="gap-2 font-bold bg-white" onClick={() => window.print()}>
                           <Printer className="size-4" /> Print
                         </Button>
                         <Button size="sm" className="gap-2 font-bold bg-slate-900 text-white">
                           <Download className="size-4" /> Download
                         </Button>
                      </div>
                    </DialogHeader>
                    
                    {/* Simulated Document Asset View */}
                    <div className="flex-1 p-8 overflow-y-auto w-full flex justify-center bg-slate-200/50">
                       <div className="w-[600px] h-[750px] bg-white shadow-xl border border-slate-300 p-12 text-center text-slate-400 flex flex-col items-center justify-center">
                          <Eye className="size-16 mb-4 opacity-50 text-indigo-600" />
                          <h3 className="text-xl font-bold text-slate-800 mb-2">{selectedDoc.title}</h3>
                          <p className="text-sm w-3/4">This is a secure simulation of the digital file viewer. In production, physical assets (PDFs, encoded JPEGs) will mount here via an isolated iframe or web asset engine.</p>
                          <div className="mt-8 p-4 bg-slate-50 rounded text-left text-xs w-full font-mono text-slate-500 border border-slate-200 space-y-2">
                             <p><strong>Hash:</strong> 0x7A2F0B9C...</p>
                             <p><strong>Uploader:</strong> {selectedDoc.uploadedBy}</p>
                             <p><strong>Timestamp:</strong> {selectedDoc.uploadDate}</p>
                             <p><strong>Watermark:</strong> JIJIGA_HIGH_COURT_SECURE</p>
                          </div>
                       </div>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>

            {/* Upload Modal */}
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                   <DialogTitle className="flex items-center gap-2">
                      <UploadCloud className="size-5 text-indigo-600" /> Import Secure File
                   </DialogTitle>
                   <DialogDescription>Attach a new document to the registry for case {caseId}.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Document Categorization</Label>
                    <Select defaultValue="evidence">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="evidence">Physical Evidence Record</SelectItem>
                        <SelectItem value="statement">Witness Statement</SelectItem>
                        <SelectItem value="medical">Forensic / Medical Report</SelectItem>
                        <SelectItem value="warrant">Judicial Warrant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>File Title / Description</Label>
                    <Input placeholder="e.g. Defendant Financial Statement 2025" />
                  </div>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors">
                     <UploadCloud className="size-10 text-slate-400 mb-2" />
                     <p className="font-bold text-sm text-slate-700">Click to browse or drag file here</p>
                     <p className="text-xs text-slate-500 mt-1">Supports PDF, JPEG, DOCX (Max 25MB)</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
                  <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setIsUploadOpen(false)}>Secure Upload</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
