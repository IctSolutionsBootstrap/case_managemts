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
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useI18n } from '@/lib/i18n/context'
import { User, Bell, Shield, Globe, Moon, Sun, Lock, Save, Mail, Phone, Building } from 'lucide-react'

export default function SettingsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { language, setLanguage, t } = useI18n()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    caseUpdates: true,
    hearingReminders: true,
    systemAlerts: true,
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const handleSaveProfile = () => {
    alert('Profile settings saved successfully!')
  }

  const handleChangePassword = () => {
    alert('Password change functionality would be here')
  }

  return (
    <SidebarProvider>
      <RoleSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground">Manage your account settings and preferences</p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="preferences">
                  <Globe className="h-4 w-4 mr-2" />
                  Preferences
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information and contact details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-6">
                      <Avatar className="h-20 w-20">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="capitalize">
                            {user.role.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline">{user.department}</Badge>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Form Fields */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" defaultValue={user.name} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="email" defaultValue={user.email} className="pl-10" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="phone" defaultValue="+251 91 234 5678" className="pl-10" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="badgeNumber">Badge/ID Number</Label>
                        <Input id="badgeNumber" defaultValue={user.badgeNumber || 'N/A'} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="department" defaultValue={user.department} className="pl-10" disabled />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" value={user.role.replace('_', ' ').toUpperCase()} disabled />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleSaveProfile}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Configure how you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Notification Channels</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                          </div>
                          <Switch
                            checked={notifications.email}
                            onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Push Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                          </div>
                          <Switch
                            checked={notifications.push}
                            onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>SMS Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive text message alerts</p>
                          </div>
                          <Switch
                            checked={notifications.sms}
                            onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium">Notification Types</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Case Updates</Label>
                            <p className="text-sm text-muted-foreground">Notifications for case status changes</p>
                          </div>
                          <Switch
                            checked={notifications.caseUpdates}
                            onCheckedChange={(checked) => setNotifications({ ...notifications, caseUpdates: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Hearing Reminders</Label>
                            <p className="text-sm text-muted-foreground">Reminders before scheduled hearings</p>
                          </div>
                          <Switch
                            checked={notifications.hearingReminders}
                            onCheckedChange={(checked) => setNotifications({ ...notifications, hearingReminders: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>System Alerts</Label>
                            <p className="text-sm text-muted-foreground">Important system announcements</p>
                          </div>
                          <Switch
                            checked={notifications.systemAlerts}
                            onCheckedChange={(checked) => setNotifications({ ...notifications, systemAlerts: checked })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button>
                        <Save className="mr-2 h-4 w-4" />
                        Save Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Password & Security</CardTitle>
                    <CardDescription>Manage your password and security settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Change Password</h4>
                      <div className="grid gap-4 max-w-md">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="currentPassword" type="password" className="pl-10" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="newPassword" type="password" className="pl-10" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="confirmPassword" type="password" className="pl-10" />
                          </div>
                        </div>
                        <Button onClick={handleChangePassword} className="w-fit">
                          Update Password
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                        </div>
                        <Button variant="outline">Enable 2FA</Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium">Active Sessions</h4>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Current Session</p>
                            <p className="text-sm text-muted-foreground">Chrome on Windows - Jijiga, Ethiopia</p>
                          </div>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Application Preferences</CardTitle>
                    <CardDescription>Customize your application experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Language & Region</h4>
                      <div className="grid gap-4 max-w-md">
                        <div className="space-y-2">
                          <Label>Display Language</Label>
                          <Select value={language} onValueChange={(value: 'en' | 'am' | 'so') => setLanguage(value)}>
                            <SelectTrigger>
                              <Globe className="mr-2 h-4 w-4" />
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="am">Amharic (አማርኛ)</SelectItem>
                              <SelectItem value="so">Somali (Soomaali)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Date Format</Label>
                          <Select defaultValue="dmy">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                              <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                              <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium">Appearance</h4>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="flex items-center gap-2">
                            {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                            Dark Mode
                          </Label>
                          <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                        </div>
                        <Switch
                          checked={isDarkMode}
                          onCheckedChange={setIsDarkMode}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button>
                        <Save className="mr-2 h-4 w-4" />
                        Save Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
