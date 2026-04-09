'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import { RoleSidebar } from '@/components/dashboard/role-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { mockUsers } from '@/lib/cms-data/mock-data'
import { Search, Filter, UserPlus, Edit, Trash2, Shield, Scale, Gavel, Building, Users, Lock } from 'lucide-react'

const roleIcons: Record<string, React.ReactNode> = {
  police: <Shield className="h-4 w-4" />,
  prosecutor: <Scale className="h-4 w-4" />,
  judge: <Gavel className="h-4 w-4" />,
  prison: <Lock className="h-4 w-4" />,
  lawyer: <Scale className="h-4 w-4" />,
  community: <Users className="h-4 w-4" />,
  bureau_admin: <Building className="h-4 w-4" />,
  document_officer: <Building className="h-4 w-4" />,
}

const roleColors: Record<string, string> = {
  police: 'bg-blue-500',
  prosecutor: 'bg-orange-500',
  judge: 'bg-purple-500',
  prison: 'bg-red-500',
  lawyer: 'bg-green-500',
  community: 'bg-gray-500',
  bureau_admin: 'bg-primary',
  document_officer: 'bg-teal-500',
}

export default function UsersPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
    // Only bureau_admin and document_officer can manage users
    if (!isLoading && user && !['bureau_admin', 'document_officer'].includes(user.role)) {
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

  // Filter users
  let filteredUsers = [...mockUsers]

  if (searchTerm) {
    filteredUsers = filteredUsers.filter(u =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  if (roleFilter !== 'all') {
    filteredUsers = filteredUsers.filter(u => u.role === roleFilter)
  }

  // Role statistics
  const roleStats = mockUsers.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <SidebarProvider>
      <RoleSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">User Management</h1>
                <p className="text-muted-foreground">
                  {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} in the system
                </p>
              </div>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add New User
              </Button>
            </div>

            {/* Role Stats */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
              {Object.entries(roleStats).map(([role, count]) => (
                <Card key={role} className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setRoleFilter(roleFilter === role ? 'all' : role)}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${roleColors[role]} text-white`}>
                        {roleIcons[role]}
                      </div>
                      <div>
                        <p className="text-lg font-bold">{count}</p>
                        <p className="text-xs text-muted-foreground capitalize">{role.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="police">Police</SelectItem>
                      <SelectItem value="prosecutor">Prosecutor</SelectItem>
                      <SelectItem value="judge">Judge</SelectItem>
                      <SelectItem value="prison">Prison</SelectItem>
                      <SelectItem value="lawyer">Lawyer</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                      <SelectItem value="bureau_admin">Bureau Admin</SelectItem>
                      <SelectItem value="document_officer">Document Officer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>System Users</CardTitle>
                <CardDescription>Manage user accounts and access permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Badge/ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className={`${roleColors[u.role]} text-white`}>
                                  {u.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{u.name}</p>
                                <p className="text-sm text-muted-foreground">{u.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${roleColors[u.role]} text-white`}>
                              <span className="flex items-center gap-1">
                                {roleIcons[u.role]}
                                <span className="capitalize">{u.role.replace('_', ' ')}</span>
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell>{u.department}</TableCell>
                          <TableCell className="font-mono text-sm">{u.badgeNumber || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={u.isActive ? 'default' : 'secondary'}>
                              {u.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
