'use client'

import { useAuth } from '@/lib/auth/context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileText, Send, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'
import { useState } from 'react'

const crimeTypes = [
  'Theft',
  'Assault',
  'Fraud',
  'Robbery',
  'Murder',
  'Drug Offense',
  'Property Damage',
  'Domestic Violence',
  'Traffic Violation',
  'Other',
]

export default function CreateFIRPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  if (!user) {
    redirect('/login')
  }

  if (user.role !== 'police') {
    redirect('/dashboard')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    router.push('/dashboard/cases')
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create FIR</h1>
          <p className="text-muted-foreground">Register a new First Information Report</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Complainant Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Complainant Information
              </CardTitle>
              <CardDescription>Details of the person filing the report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="complainantName">Full Name *</Label>
                  <Input id="complainantName" required placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="complainantPhone">Phone Number *</Label>
                  <Input id="complainantPhone" required placeholder="+251-xxx-xxx-xxx" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="complainantAddress">Address *</Label>
                <Input id="complainantAddress" required placeholder="Enter address" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="complainantIdType">ID Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="national_id">National ID</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="driver_license">Driver License</SelectItem>
                      <SelectItem value="kebele_id">Kebele ID</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="complainantIdNumber">ID Number</Label>
                  <Input id="complainantIdNumber" placeholder="Enter ID number" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Crime Information */}
          <Card>
            <CardHeader>
              <CardTitle>Crime Information</CardTitle>
              <CardDescription>Details about the reported crime</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="crimeType">Crime Type *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select crime type" />
                  </SelectTrigger>
                  <SelectContent>
                    {crimeTypes.map(type => (
                      <SelectItem key={type} value={type.toLowerCase().replace(/ /g, '_')}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="incidentDate">Incident Date *</Label>
                  <Input id="incidentDate" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incidentTime">Incident Time</Label>
                  <Input id="incidentTime" type="time" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="incidentLocation">Location *</Label>
                <Input id="incidentLocation" required placeholder="Where did the incident occur?" />
              </div>
            </CardContent>
          </Card>

          {/* Crime Description */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Crime Description</CardTitle>
              <CardDescription>Detailed description of the incident</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea 
                  id="description" 
                  required 
                  rows={6}
                  placeholder="Provide a detailed description of what happened..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="witnesses">Witnesses (if any)</Label>
                <Textarea 
                  id="witnesses" 
                  rows={3}
                  placeholder="List any witnesses with their contact information..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evidence">Evidence Description</Label>
                <Textarea 
                  id="evidence" 
                  rows={3}
                  placeholder="Describe any evidence available..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Suspect Information (Optional) */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Suspect Information (Optional)</CardTitle>
              <CardDescription>If the suspect is known, provide their details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="suspectName">Name</Label>
                  <Input id="suspectName" placeholder="Suspect name (if known)" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="suspectAge">Approximate Age</Label>
                  <Input id="suspectAge" type="number" placeholder="Age" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="suspectGender">Gender</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="suspectDescription">Physical Description</Label>
                <Textarea 
                  id="suspectDescription" 
                  rows={3}
                  placeholder="Describe the suspect's appearance, clothing, distinguishing features..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Button variant="outline" type="button" asChild>
            <Link href="/dashboard">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Send className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Submitting...' : 'Submit FIR'}
          </Button>
        </div>
      </form>
    </div>
  )
}
