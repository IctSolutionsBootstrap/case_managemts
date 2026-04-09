'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Send, 
  MapPin, 
  Calendar, 
  Camera, 
  User, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2,
  FileText,
  X,
  Plus,
  Upload
} from 'lucide-react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RoleSidebar } from '@/components/dashboard/role-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { useI18n } from '@/lib/i18n/context'
import { useAuth } from '@/lib/auth/context'
import { Badge } from '@/components/ui/badge'

export default function ReportCrimePage() {
  const { locale, t } = useI18n()
  const { user } = useAuth()
  const router = useRouter()
  
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [refNumber, setRefNumber] = useState('')
  const [files, setFiles] = useState<File[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      const generatedRef = `JIG-RPT-2026-${Math.floor(Math.random() * 9000 + 1000)}`
      setRefNumber(generatedRef)
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 1500)
  }

  if (isSubmitted) {
    return (
      <SidebarProvider>
        <RoleSidebar />
        <SidebarInset>
          <DashboardHeader title="Report Status" titleAm="የሪፖርት ሁኔታ" />
          <main className="flex-1 overflow-auto p-4 md:p-8 flex items-center justify-center">
            <Card className="max-w-md w-full text-center p-8 border-none shadow-2xl bg-gradient-to-b from-card to-primary/5">
              <div className="flex justify-center mb-6">
                <div className="size-20 rounded-full bg-success/20 flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="size-12 text-success" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold mb-2">
                {locale === 'am' ? 'ሪፖርቱ በተሳካ ሁኔታ ቀርቧል!' : 'Report Submitted!'}
              </CardTitle>
              <CardDescription className="text-lg">
                {locale === 'am' 
                  ? 'የእርስዎ ሪፖርት ደርሶናል። የሪፖርት ቁጥርዎ ከዚህ በታች ያለው ነው' 
                  : 'Your report has been received. Your reference number is shown below.'}
              </CardDescription>
              
              <div className="my-8 p-4 bg-muted rounded-xl border-2 border-dashed border-primary/30">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Reference Number</p>
                <p className="text-3xl font-mono font-bold text-primary">{refNumber}</p>
              </div>

              <div className="space-y-3">
                <Button className="w-full" onClick={() => router.push('/dashboard')}>
                  {locale === 'am' ? 'ወደ ዳሽቦርድ ይመለሱ' : 'Return to Dashboard'}
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setIsSubmitted(false)}>
                  {locale === 'am' ? 'ሌላ ሪፖርት ያቅርቡ' : 'Submit Another Report'}
                </Button>
              </div>
            </Card>
          </main>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <RoleSidebar />
      <SidebarInset>
        <DashboardHeader 
          title="Report a Crime" 
          titleAm="ወንጀል ሪፖርት ያድርጉ" 
        />
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header section with glassmorphism */}
            <div className="relative overflow-hidden rounded-2xl bg-primary p-8 text-primary-foreground shadow-lg">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck className="size-40" />
              </div>
              <div className="relative z-10">
                <Button 
                  variant="ghost" 
                  className="mb-4 -ml-2 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="mr-2 size-4" />
                  {locale === 'am' ? 'ተመለስ' : 'Back'}
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">
                  {locale === 'am' ? 'የወንጀል ሪፖርት ማቅረቢያ' : 'Submit a Crime Report'}
                </h1>
                <p className="mt-2 text-primary-foreground/80 max-w-2xl">
                  {locale === 'am' 
                    ? 'እባክዎን ከዚህ በታች ያለውን ቅጽ በመጠቀም ትክክለኛ መረጃ ያቅርቡ። የእርስዎ መረጃ በምስጢር ይጠበቃል።'
                    : 'Please provide accurate information using the form below. Your report helps keep our community safe. All submissions are handled with strict confidentiality.'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
              {/* Left Column: Form Fields */}
              <div className="lg:col-span-2 space-y-6">
                {/* Incident Details Section */}
                <Card className="border-none shadow-md overflow-hidden">
                  <div className="h-1 bg-primary w-full" />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="size-5 text-primary" />
                      {locale === 'am' ? 'የአደጋው ዝርዝር' : 'Incident Details'}
                    </CardTitle>
                    <CardDescription>
                      Share what happened, where, and when.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="crimeType">{locale === 'am' ? 'የወንጀል አይነት' : 'Crime Type'}</Label>
                        <Select required>
                          <SelectTrigger id="crimeType" className="bg-muted/50 border-none">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="theft">Theft</SelectItem>
                            <SelectItem value="assault">Assault</SelectItem>
                            <SelectItem value="robbery">Robbery</SelectItem>
                            <SelectItem value="fraud">Fraud</SelectItem>
                            <SelectItem value="domestic_violence">Domestic Violence</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="incidentDate">{locale === 'am' ? 'የተከሰተበት ቀን' : 'Incident Date'}</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                          <Input id="incidentDate" type="date" className="pl-10 bg-muted/50 border-none" required />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="incidentLocation">{locale === 'am' ? 'ቦታ' : 'Incident Location'}</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 size-4 text-muted-foreground" />
                        <Input 
                          id="incidentLocation" 
                          placeholder="District, Kebele, or specific landmark" 
                          className="pl-10 bg-muted/50 border-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">{locale === 'am' ? 'መግለጫ' : 'Detailed Description'}</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Please provide as much detail as possible about what happened..."
                        className="min-h-[150px] bg-muted/50 border-none resize-none"
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Evidence Section - New requested requirement */}
                <Card className="border-none shadow-md overflow-hidden">
                  <div className="h-1 bg-chart-4 w-full" />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="size-5 text-chart-4" />
                      {locale === 'am' ? 'ማስረጃ እና ፎቶዎች' : 'Evidence & Photos'}
                    </CardTitle>
                    <CardDescription>
                      Upload any photos or documents related to the incident.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-xl p-8 bg-muted/30 transition-colors hover:bg-muted/50 cursor-pointer group">
                      <div className="size-12 rounded-full bg-background flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                        <Upload className="size-6 text-muted-foreground" />
                      </div>
                      <p className="font-medium text-foreground">Click or drag to upload</p>
                      <p className="text-xs text-muted-foreground mt-1 text-center">
                        PNG, JPG, PDF (max 10MB per file)
                      </p>
                      <Input type="file" multiple className="hidden" id="file-upload" />
                      <Label htmlFor="file-upload" className="mt-4">
                        <Button type="button" variant="outline" size="sm">
                          Select Files
                        </Button>
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Identity and Privacy */}
              <div className="space-y-6">
                <Card className="border-none shadow-md overflow-hidden">
                  <div className="h-1 bg-chart-2 w-full" />
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <User className="size-5 text-chart-2" />
                        {locale === 'am' ? 'ማንነት' : 'Identity'}
                      </CardTitle>
                      <Switch 
                        checked={isAnonymous} 
                        onCheckedChange={setIsAnonymous}
                      />
                    </div>
                    <CardDescription>
                      {isAnonymous ? 'Reporting Anonymously' : 'Report as Identified User'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isAnonymous ? (
                      <div className="p-4 rounded-lg bg-orange-50 border border-orange-100 flex gap-3 text-orange-800 text-sm">
                        <ShieldCheck className="size-5 shrink-0" />
                        <p>
                          Your personal information will not be shared. Note that anonymous reports may take longer to investigate.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="space-y-2">
                          <Label>{locale === 'am' ? 'ሙሉ ስም' : 'Full Name'}</Label>
                          <Input defaultValue={user?.fullName} className="bg-muted/50 border-none" />
                        </div>
                        <div className="space-y-2">
                          <Label>{locale === 'am' ? 'ስልክ ቁጥር' : 'Phone Number'}</Label>
                          <Input defaultValue={user?.phone} className="bg-muted/50 border-none" />
                        </div>
                        <div className="space-y-2">
                          <Label>{locale === 'am' ? 'ኢሜይል (አማራጭ)' : 'Email (Optional)'}</Label>
                          <Input defaultValue={user?.email} className="bg-muted/50 border-none" />
                        </div>
                        <div className="space-y-2">
                          <Label>{locale === 'am' ? 'አድራሻ' : 'Residential Address'}</Label>
                          <Textarea placeholder="Your home address" className="bg-muted/50 border-none resize-none h-20" />
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="bg-muted/30 pt-4 flex flex-col items-center">
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-lg shadow-lg shadow-primary/20" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="size-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 size-5" />
                          {locale === 'am' ? 'ሪፖርቱን ላክ' : 'Submit Report'}
                        </>
                      )}
                    </Button>
                    <p className="mt-4 text-[10px] text-center text-muted-foreground uppercase tracking-widest leading-relaxed">
                      By submitting, you confirm that the information provided is true to the best of your knowledge.
                    </p>
                  </CardFooter>
                </Card>

                {/* Help Card */}
                <Card className="bg-card shadow-sm border border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Quick Help</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="h-4 p-0 px-1">1</Badge>
                      <p>Emergency? Dial 991 immediately.</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="h-4 p-0 px-1">2</Badge>
                      <p>Be specific about the time and landmarks.</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="h-4 p-0 px-1">3</Badge>
                      <p>Reference numbers are needed for tracking.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </form>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
