'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import { RoleSidebar } from '@/components/dashboard/role-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { mockCases, mockDocuments, mockHearings, mockCaseTimeline, mockUsers } from '@/lib/cms-data/mock-data'
import type { CriminalCase } from '@/lib/cms-data/types'
import { 
  ArrowLeft, FileText, Calendar, Users, Clock, AlertTriangle, 
  CheckCircle, XCircle, Send, Upload, Gavel, Scale, Shield
} from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

const statusColors: Record<string, string> = {
  'under_investigation': 'bg-blue-500',
  'awaiting_prosecutor': 'bg-yellow-500',
  'prosecution_review': 'bg-orange-500',
  'charges_filed': 'bg-indigo-500',
  'awaiting_trial': 'bg-purple-500',
  'in_trial': 'bg-pink-500',
  'sentenced': 'bg-red-500',
  'serving_sentence': 'bg-red-700',
  'released': 'bg-green-500',
  'closed': 'bg-gray-500',
  'dismissed': 'bg-gray-400',
  'appealed': 'bg-amber-500',
}

const timelineIcons: Record<string, React.ReactNode> = {
  'fir_registered': <FileText className="h-4 w-4" />,
  'investigation_started': <Shield className="h-4 w-4" />,
  'evidence_collected': <CheckCircle className="h-4 w-4" />,
  'sent_to_prosecutor': <Send className="h-4 w-4" />,
  'prosecutor_review': <Scale className="h-4 w-4" />,
  'charges_filed': <FileText className="h-4 w-4" />,
  'hearing_scheduled': <Calendar className="h-4 w-4" />,
  'trial_started': <Gavel className="h-4 w-4" />,
  'verdict': <CheckCircle className="h-4 w-4" />,
  'sentence': <AlertTriangle className="h-4 w-4" />,
}

export default function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [note, setNote] = useState('')
  const [newStatus, setNewStatus] = useState('')

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  const caseData = mockCases.find(c => c.id === id)
  const caseDocuments = mockDocuments.filter(d => d.caseId === id)
  const caseHearings = mockHearings.filter(h => h.caseId === id)
  const caseTimeline = mockCaseTimeline.filter(t => t.caseId === id)

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!caseData) {
    return (
      <SidebarProvider>
        <RoleSidebar />
        <SidebarInset>
          <DashboardHeader />
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">Case Not Found</h2>
              <p className="text-muted-foreground mb-4">The case you are looking for does not exist.</p>
              <Button asChild>
                <Link href="/dashboard/cases">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Cases
                </Link>
              </Button>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  // Get assigned personnel names
  const getPersonnelName = (userId: string | undefined) => {
    if (!userId) return 'Not Assigned'
    const person = mockUsers.find(u => u.id === userId)
    return person?.name || 'Unknown'
  }

  // Determine available actions based on role
  const getAvailableActions = () => {
    switch (user.role) {
      case 'police':
        if (caseData.status === 'under_investigation') {
          return ['Complete Investigation', 'Send to Prosecutor']
        }
        break
      case 'prosecutor':
        if (caseData.status === 'awaiting_prosecutor' || caseData.status === 'prosecution_review') {
          return ['File Charges', 'Request More Evidence', 'Dismiss Case']
        }
        break
      case 'judge':
        if (caseData.status === 'awaiting_trial' || caseData.status === 'in_trial') {
          return ['Schedule Hearing', 'Issue Verdict', 'Adjourn']
        }
        break
      case 'prison':
        if (caseData.status === 'serving_sentence') {
          return ['Update Status', 'Record Release']
        }
        break
      case 'bureau':
        return ['Update Status', 'Reassign Case', 'Close Case']
    }
    return []
  }

  const availableActions = getAvailableActions()

  return (
    <SidebarProvider>
      <RoleSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="space-y-6">
            {/* Back Button and Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-4">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/dashboard/cases">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold">{caseData.caseNumber}</h1>
                    <Badge className={`${statusColors[caseData.status]} text-white`}>
                      {caseData.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                    <Badge variant={caseData.priority === 'urgent' ? 'destructive' : caseData.priority === 'high' ? 'default' : 'secondary'}>
                      {caseData.priority} priority
                    </Badge>
                  </div>
                  <h2 className="text-xl text-muted-foreground">{caseData.title}</h2>
                </div>
              </div>
              {availableActions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {availableActions.map((action) => (
                    <Button key={action} variant={action.includes('Dismiss') ? 'destructive' : 'default'}>
                      {action}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="hearings">Hearings</TabsTrigger>
                <TabsTrigger value="parties">Parties</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Case Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Case Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Crime Type</p>
                          <p className="font-medium capitalize">{caseData.crimeType.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Filed Date</p>
                          <p className="font-medium">{format(new Date(caseData.createdAt), 'PPP')}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Location</p>
                          <p className="font-medium">{caseData.location}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">District</p>
                          <p className="font-medium">{caseData.district}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Description</p>
                        <p className="text-sm">{caseData.description}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Assigned Personnel */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Assigned Personnel</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <Shield className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Investigating Officer</p>
                          <p className="font-medium">{getPersonnelName(caseData.assignedPoliceId)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <Scale className="h-5 w-5 text-orange-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Prosecutor</p>
                          <p className="font-medium">{getPersonnelName(caseData.assignedProsecutorId)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <Gavel className="h-5 w-5 text-purple-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Presiding Judge</p>
                          <p className="font-medium">{getPersonnelName(caseData.assignedJudgeId)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <Users className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Defense Lawyer</p>
                          <p className="font-medium">{getPersonnelName(caseData.assignedLawyerId)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{caseDocuments.length}</p>
                          <p className="text-sm text-muted-foreground">Documents</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Calendar className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{caseHearings.length}</p>
                          <p className="text-sm text-muted-foreground">Hearings</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Clock className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{caseTimeline.length}</p>
                          <p className="text-sm text-muted-foreground">Updates</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <Clock className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">
                            {formatDistanceToNow(new Date(caseData.createdAt), { addSuffix: false })}
                          </p>
                          <p className="text-sm text-muted-foreground">Case Age</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Add Note Section */}
                {['police', 'prosecutor', 'judge', 'bureau'].includes(user.role) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Add Case Note</CardTitle>
                      <CardDescription>Add internal notes to this case file</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        placeholder="Enter your note here..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={3}
                      />
                      <Button disabled={!note.trim()}>
                        <Send className="mr-2 h-4 w-4" />
                        Add Note
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Timeline Tab */}
              <TabsContent value="timeline">
                <Card>
                  <CardHeader>
                    <CardTitle>Case Timeline</CardTitle>
                    <CardDescription>Complete history of case events and updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      {caseTimeline.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No timeline events yet</p>
                      ) : (
                        <div className="space-y-6">
                          {caseTimeline.map((event, index) => (
                            <div key={event.id} className="flex gap-4">
                              <div className="relative flex flex-col items-center">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                  {timelineIcons[event.eventType] || <Clock className="h-4 w-4" />}
                                </div>
                                {index < caseTimeline.length - 1 && (
                                  <div className="h-full w-px bg-border absolute top-10" />
                                )}
                              </div>
                              <div className="flex-1 pb-6">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-medium">
                                    {event.eventType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </p>
                                  <Badge variant="outline" className="text-xs">
                                    {event.performedByRole}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(event.timestamp), 'PPp')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Case Documents</CardTitle>
                      <CardDescription>All documents related to this case</CardDescription>
                    </div>
                    {['police', 'prosecutor', 'bureau', 'document_officer'].includes(user.role) && (
                      <Button>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Document
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {caseDocuments.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No documents uploaded yet</p>
                    ) : (
                      <div className="space-y-3">
                        {caseDocuments.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <FileText className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium">{doc.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  {doc.documentType.replace(/_/g, ' ')} - Uploaded by {doc.uploadedByRole}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge variant={doc.isVerified ? 'default' : 'secondary'}>
                                {doc.isVerified ? 'Verified' : 'Pending'}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {format(new Date(doc.uploadedAt), 'MMM d, yyyy')}
                              </span>
                              <Button variant="ghost" size="sm">View</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Hearings Tab */}
              <TabsContent value="hearings">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Court Hearings</CardTitle>
                      <CardDescription>Scheduled and completed court sessions</CardDescription>
                    </div>
                    {user.role === 'judge' && (
                      <Button>
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule Hearing
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {caseHearings.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No hearings scheduled</p>
                    ) : (
                      <div className="space-y-4">
                        {caseHearings.map((hearing) => (
                          <div key={hearing.id} className="p-4 border rounded-lg">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p className="font-medium capitalize">{hearing.hearingType.replace(/_/g, ' ')}</p>
                                <p className="text-sm text-muted-foreground">
                                  {hearing.courtRoom} - Judge: {getPersonnelName(hearing.judgeId)}
                                </p>
                              </div>
                              <Badge 
                                variant={
                                  hearing.status === 'completed' ? 'default' :
                                  hearing.status === 'scheduled' ? 'secondary' : 'destructive'
                                }
                              >
                                {hearing.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                {format(new Date(hearing.scheduledDate), 'PPP')}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                {hearing.scheduledTime}
                              </div>
                            </div>
                            {hearing.notes && (
                              <p className="mt-3 text-sm text-muted-foreground bg-muted p-2 rounded">
                                {hearing.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Parties Tab */}
              <TabsContent value="parties">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-red-500" />
                        Defendants
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {caseData.defendants?.length ? (
                        <div className="space-y-3">
                          {caseData.defendants.map((defendant, i) => (
                            <div key={i} className="p-3 border rounded-lg">
                              <p className="font-medium">{defendant.name}</p>
                              <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-muted-foreground">
                                <p>Age: {defendant.age}</p>
                                <p>Gender: {defendant.gender}</p>
                                <p className="col-span-2">Address: {defendant.address}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No defendants recorded</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Victims/Complainants
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {caseData.victims?.length ? (
                        <div className="space-y-3">
                          {caseData.victims.map((victim, i) => (
                            <div key={i} className="p-3 border rounded-lg">
                              <p className="font-medium">{victim.name}</p>
                              <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-muted-foreground">
                                <p>Age: {victim.age}</p>
                                <p>Gender: {victim.gender}</p>
                                <p className="col-span-2">Contact: {victim.contactInfo || 'N/A'}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No victims recorded</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
