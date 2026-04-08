'use client'

import Link from 'next/link'
import { 
  FileText,
  FolderOpen,
  CheckCircle2,
  Clock,
  Search,
  ArrowRight,
  FileSearch,
  Archive,
} from 'lucide-react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { RoleSidebar } from '@/components/dashboard/role-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { useI18n } from '@/lib/i18n/context'
import { legalDocuments } from '@/lib/cms-data/mock-data'

export function DocumentOfficerDashboard() {
  const { locale } = useI18n()

  // Document stats
  const totalDocs = legalDocuments.length
  const verifiedDocs = legalDocuments.filter(d => d.status === 'verified').length
  const pendingDocs = legalDocuments.filter(d => d.status === 'submitted').length
  const archivedDocs = legalDocuments.filter(d => d.status === 'archived').length

  const statsCards = [
    {
      title: locale === 'am' ? 'ጠቅላላ ሰነዶች' : 'Total Documents',
      value: totalDocs,
      icon: FileText,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: locale === 'am' ? 'የተረጋገጡ' : 'Verified',
      value: verifiedDocs,
      icon: CheckCircle2,
      color: 'bg-success/10 text-success-foreground',
    },
    {
      title: locale === 'am' ? 'ማረጋገጫ የሚጠባበቁ' : 'Pending Verification',
      value: pendingDocs,
      icon: Clock,
      color: 'bg-warning/10 text-warning-foreground',
    },
    {
      title: locale === 'am' ? 'መዝገብ' : 'Archived',
      value: archivedDocs,
      icon: Archive,
      color: 'bg-info/10 text-info-foreground',
    },
  ]

  const getDocTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      fir: 'FIR',
      evidence: 'Evidence',
      statement: 'Statement',
      charge_sheet: 'Charge Sheet',
      court_order: 'Court Order',
      judgment: 'Judgment',
      appeal: 'Appeal',
      other: 'Other',
    }
    return labels[type] || type
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <SidebarProvider>
      <RoleSidebar />
      <SidebarInset>
        <DashboardHeader 
          title="Document Management" 
          titleAm="የሰነድ አስተዳደር" 
        />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {statsCards.map((stat, index) => (
                <Card key={index} className="relative overflow-hidden">
                  <CardContent className="p-5">
                    <div className={`rounded-lg p-2.5 ${stat.color} w-fit`}>
                      <stat.icon className="size-5" />
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {locale === 'am' ? 'ሰነድ ፈልግ' : 'Search Documents'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      placeholder={locale === 'am' ? 'በስም፣ ቁጥር ወይም መለያ ፈልግ...' : 'Search by name, case number, or tags...'} 
                      className="pl-10"
                    />
                  </div>
                  <Button className="gap-2">
                    <Search className="size-4" />
                    {locale === 'am' ? 'ፈልግ' : 'Search'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Pending Verification */}
            {pendingDocs > 0 && (
              <Card className="border-warning/50 bg-warning/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-warning-foreground">
                    <FileSearch className="size-5" />
                    {locale === 'am' ? 'ማረጋገጫ የሚጠባበቁ' : 'Pending Verification'}
                  </CardTitle>
                  <CardDescription>
                    {locale === 'am' 
                      ? 'እነዚህ ሰነዶች ማረጋገጫ ይጠብቃሉ'
                      : 'These documents require verification'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {legalDocuments
                      .filter(d => d.status === 'submitted')
                      .map((doc) => (
                        <div 
                          key={doc.id}
                          className="flex items-center gap-4 rounded-lg border bg-background p-4"
                        >
                          <div className="flex size-10 items-center justify-center rounded-lg bg-warning/10">
                            <FileText className="size-5 text-warning-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{doc.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {doc.fileName} - {formatFileSize(doc.fileSize)}
                            </p>
                          </div>
                          <Button size="sm">
                            {locale === 'am' ? 'አረጋግጥ' : 'Verify'}
                          </Button>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Document Repository */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="size-5" />
                    {locale === 'am' ? 'የሰነድ ማከማቻ' : 'Document Repository'}
                  </CardTitle>
                  <CardDescription>
                    {locale === 'am' ? 'ሁሉም የህግ ሰነዶች' : 'All legal documents'}
                  </CardDescription>
                </div>
                <Link href="/dashboard/documents">
                  <Button variant="outline" size="sm" className="gap-2">
                    {locale === 'am' ? 'ሁሉንም ይመልከቱ' : 'View All'}
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {legalDocuments.map((doc) => (
                    <div 
                      key={doc.id}
                      className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-accent/50"
                    >
                      <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                        <FileText className="size-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground truncate">{doc.title}</p>
                          <Badge variant="outline">{getDocTypeLabel(doc.type)}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {doc.fileName} - {formatFileSize(doc.fileSize)}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {doc.tags.map((tag, idx) => (
                            <span 
                              key={idx}
                              className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Badge className={
                        doc.status === 'verified' ? 'bg-success/10 text-success-foreground border-success/20' :
                        doc.status === 'archived' ? 'bg-info/10 text-info-foreground border-info/20' :
                        doc.status === 'submitted' ? 'bg-warning/10 text-warning-foreground border-warning/20' :
                        'bg-muted text-muted-foreground'
                      }>
                        {doc.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
