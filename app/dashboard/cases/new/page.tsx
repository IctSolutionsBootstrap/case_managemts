'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import { RoleSidebar } from '@/components/dashboard/role-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Plus, Trash2, Save, FileText } from 'lucide-react'
import Link from 'next/link'

export default function NewCasePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    crimeType: '',
    priority: 'normal',
    location: '',
    district: 'jijiga',
    incidentDate: '',
    incidentTime: '',
  })
  const [defendants, setDefendants] = useState([{ name: '', age: '', gender: '', address: '', nationalId: '' }])
  const [victims, setVictims] = useState([{ name: '', age: '', gender: '', address: '', contactInfo: '' }])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
    if (!isLoading && user && !['police', 'bureau', 'document_officer'].includes(user.role)) {
      router.push('/dashboard')
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Generate case number
    const caseNumber = `FIR/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`
    
    alert(`Case ${caseNumber} has been registered successfully!`)
    router.push('/dashboard/cases')
  }

  const addDefendant = () => {
    setDefendants([...defendants, { name: '', age: '', gender: '', address: '', nationalId: '' }])
  }

  const removeDefendant = (index: number) => {
    if (defendants.length > 1) {
      setDefendants(defendants.filter((_, i) => i !== index))
    }
  }

  const addVictim = () => {
    setVictims([...victims, { name: '', age: '', gender: '', address: '', contactInfo: '' }])
  }

  const removeVictim = (index: number) => {
    if (victims.length > 1) {
      setVictims(victims.filter((_, i) => i !== index))
    }
  }

  const updateDefendant = (index: number, field: string, value: string) => {
    const updated = [...defendants]
    updated[index] = { ...updated[index], [field]: value }
    setDefendants(updated)
  }

  const updateVictim = (index: number, field: string, value: string) => {
    const updated = [...victims]
    updated[index] = { ...updated[index], [field]: value }
    setVictims(updated)
  }

  return (
    <SidebarProvider>
      <RoleSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild type="button">
                <Link href="/dashboard/cases">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Register New Case (FIR)</h1>
                <p className="text-muted-foreground">First Information Report Registration Form</p>
              </div>
            </div>

            {/* Case Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Case Information
                </CardTitle>
                <CardDescription>Basic information about the case</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Label htmlFor="title">Case Title *</Label>
                    <Input
                      id="title"
                      placeholder="Brief title describing the case"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="description">Case Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Detailed description of the incident..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="crimeType">Crime Type *</Label>
                    <Select 
                      value={formData.crimeType} 
                      onValueChange={(value) => setFormData({ ...formData, crimeType: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select crime type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="theft">Theft</SelectItem>
                        <SelectItem value="assault">Assault</SelectItem>
                        <SelectItem value="robbery">Robbery</SelectItem>
                        <SelectItem value="fraud">Fraud</SelectItem>
                        <SelectItem value="murder">Murder</SelectItem>
                        <SelectItem value="domestic_violence">Domestic Violence</SelectItem>
                        <SelectItem value="drug_offense">Drug Offense</SelectItem>
                        <SelectItem value="property_dispute">Property Dispute</SelectItem>
                        <SelectItem value="cybercrime">Cybercrime</SelectItem>
                        <SelectItem value="traffic_offense">Traffic Offense</SelectItem>
                        <SelectItem value="corruption">Corruption</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select 
                      value={formData.priority} 
                      onValueChange={(value) => setFormData({ ...formData, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Incident Details */}
            <Card>
              <CardHeader>
                <CardTitle>Incident Details</CardTitle>
                <CardDescription>When and where the incident occurred</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="incidentDate">Incident Date *</Label>
                    <Input
                      id="incidentDate"
                      type="date"
                      value={formData.incidentDate}
                      onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="incidentTime">Incident Time (Approximate)</Label>
                    <Input
                      id="incidentTime"
                      type="time"
                      value={formData.incidentTime}
                      onChange={(e) => setFormData({ ...formData, incidentTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location/Address *</Label>
                    <Input
                      id="location"
                      placeholder="Street address or location description"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="district">District *</Label>
                    <Select 
                      value={formData.district} 
                      onValueChange={(value) => setFormData({ ...formData, district: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jijiga">Jijiga</SelectItem>
                        <SelectItem value="kebribeyah">Kebribeyah</SelectItem>
                        <SelectItem value="gode">Gode</SelectItem>
                        <SelectItem value="degehabur">Degehabur</SelectItem>
                        <SelectItem value="warder">Warder</SelectItem>
                        <SelectItem value="shinile">Shinile</SelectItem>
                        <SelectItem value="fik">Fik</SelectItem>
                        <SelectItem value="liben">Liben</SelectItem>
                        <SelectItem value="afder">Afder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Defendants */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Defendant(s) / Accused Person(s)</CardTitle>
                  <CardDescription>Information about the accused parties</CardDescription>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addDefendant}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Defendant
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {defendants.map((defendant, index) => (
                  <div key={index} className="p-4 border rounded-lg relative">
                    {defendants.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => removeDefendant(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                    <p className="font-medium mb-3">Defendant {index + 1}</p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label>Full Name *</Label>
                        <Input
                          placeholder="Full legal name"
                          value={defendant.name}
                          onChange={(e) => updateDefendant(index, 'name', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label>National ID</Label>
                        <Input
                          placeholder="ID number if available"
                          value={defendant.nationalId}
                          onChange={(e) => updateDefendant(index, 'nationalId', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Age</Label>
                        <Input
                          type="number"
                          placeholder="Age"
                          value={defendant.age}
                          onChange={(e) => updateDefendant(index, 'age', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Gender</Label>
                        <Select 
                          value={defendant.gender} 
                          onValueChange={(value) => updateDefendant(index, 'gender', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2">
                        <Label>Address</Label>
                        <Input
                          placeholder="Known address"
                          value={defendant.address}
                          onChange={(e) => updateDefendant(index, 'address', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Victims */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Victim(s) / Complainant(s)</CardTitle>
                  <CardDescription>Information about the victims or complainants</CardDescription>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addVictim}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Victim
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {victims.map((victim, index) => (
                  <div key={index} className="p-4 border rounded-lg relative">
                    {victims.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => removeVictim(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                    <p className="font-medium mb-3">Victim/Complainant {index + 1}</p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label>Full Name *</Label>
                        <Input
                          placeholder="Full legal name"
                          value={victim.name}
                          onChange={(e) => updateVictim(index, 'name', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label>Contact Information</Label>
                        <Input
                          placeholder="Phone number or email"
                          value={victim.contactInfo}
                          onChange={(e) => updateVictim(index, 'contactInfo', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Age</Label>
                        <Input
                          type="number"
                          placeholder="Age"
                          value={victim.age}
                          onChange={(e) => updateVictim(index, 'age', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Gender</Label>
                        <Select 
                          value={victim.gender} 
                          onValueChange={(value) => updateVictim(index, 'gender', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2">
                        <Label>Address</Label>
                        <Input
                          placeholder="Current address"
                          value={victim.address}
                          onChange={(e) => updateVictim(index, 'address', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-4 pb-8">
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/cases">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                    Registering...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Register Case
                  </>
                )}
              </Button>
            </div>
          </form>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
