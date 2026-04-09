'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Users,
  Clock,
  Shield,
  Gavel,
  Calendar,
  Building2,
  FolderOpen,
  BarChart3,
  AlertTriangle,
  Scale,
  UserCheck,
  FileSearch,
  Send,
  Search,
  Globe,
  LogOut,
  ChevronDown,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useAuth } from '@/lib/auth/context'
import { useI18n } from '@/lib/i18n/context'
import { roleDisplayNames, type UserRole } from '@/lib/auth/types'

interface NavItem {
  title: string
  titleAm: string
  titleSo: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface NavGroup {
  label: string
  labelAm: string
  labelSo: string
  items: NavItem[]
}

// Navigation items for each role
const roleNavigation: Record<UserRole, NavGroup[]> = {
  police: [
    {
      label: 'Main', labelAm: 'ዋና', labelSo: 'Gudiga',
      items: [
        { title: 'Dashboard', titleAm: 'ዳሽቦርድ', titleSo: 'Boodhadhka', href: '/dashboard', icon: LayoutDashboard },
        { title: 'Legal Timers', titleAm: 'የህግ ሰዓት', titleSo: 'Waqtiyada Sharciga', href: '/dashboard/timers', icon: Clock },
      ],
    },
    {
      label: 'Case Management', labelAm: 'የጉዳይ አስተዳደር', labelSo: 'Maareynta Kiisaska',
      items: [
        { title: 'Create FIR', titleAm: 'ኤፍአይአር ፍጠር', titleSo: 'Abuur FIR', href: '/dashboard/fir/create', icon: FileText },
        { title: 'Active Cases', titleAm: 'ንቁ ጉዳዮች', titleSo: 'Kiisaska Socda', href: '/dashboard/cases', icon: FolderOpen },
        { title: 'Suspects', titleAm: 'ተጠርጣሪዎች', titleSo: 'Eedeysanayaasha', href: '/dashboard/suspects', icon: Users },
        { title: 'Evidence', titleAm: 'ማስረጃ', titleSo: 'Cadeymaha', href: '/dashboard/evidence', icon: FileSearch },
      ],
    },
  ],
  prosecutor: [
    {
      label: 'Main', labelAm: 'ዋና', labelSo: 'Gudiga',
      items: [
        { title: 'Dashboard', titleAm: 'ዳሽቦርድ', titleSo: 'Boodhadhka', href: '/dashboard', icon: LayoutDashboard },
        { title: 'Deadlines', titleAm: 'የጊዜ ገደቦች', titleSo: 'Xilliyada', href: '/dashboard/deadlines', icon: Clock },
      ],
    },
    {
      label: 'Case Review', labelAm: 'የጉዳይ ግምገማ', labelSo: 'Dib-u-eegista',
      items: [
        { title: 'Pending Review', titleAm: 'በመጠባበቅ ላይ', titleSo: 'Dib-u-eegaya', href: '/dashboard/review', icon: FileSearch },
        { title: 'Charges Filed', titleAm: 'የቀረቡ ክሶች', titleSo: 'Dacwadaha La Gudbiyay', href: '/dashboard/charges', icon: Gavel },
        { title: 'All Cases', titleAm: 'ሁሉም ጉዳዮች', titleSo: 'Dhamaan Kiisaska', href: '/dashboard/cases', icon: FolderOpen },
      ],
    },
  ],
  judge: [
    {
      label: 'Main', labelAm: 'ዋና', labelSo: 'Gudiga',
      items: [
        { title: 'Dashboard', titleAm: 'ዳሽቦርድ', titleSo: 'Boodhadhka', href: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      label: 'Court', labelAm: 'ፍርድ ቤት', labelSo: 'Maxkamadda',
      items: [
        { title: 'Court Cases', titleAm: 'የፍርድ ቤት ጉዳዮች', titleSo: 'Kiisaska Maxkamadda', href: '/dashboard/court-cases', icon: Gavel },
        { title: 'Hearings', titleAm: 'ችሎቶች', titleSo: 'Dhageysiga', href: '/dashboard/hearings', icon: Calendar },
        { title: 'Judgments', titleAm: 'ፍርዶች', titleSo: 'Xukunnada', href: '/dashboard/judgments', icon: Scale },
      ],
    },
  ],
  court_clerk: [
    {
      label: 'Main', labelAm: 'ዋና', labelSo: 'Gudiga',
      items: [
        { title: 'Dashboard', titleAm: 'ዳሽቦርድ', titleSo: 'Boodhadhka', href: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      label: 'Court Admin', labelAm: 'የፍርድ ቤት አስተዳደር', labelSo: 'Maamulka Maxkamada',
      items: [
        { title: 'Cases', titleAm: 'ጉዳዮች', titleSo: 'Kiisaska', href: '/dashboard/court-cases', icon: FolderOpen },
        { title: 'Schedule', titleAm: 'መርሃ ግብር', titleSo: 'Jadwalka', href: '/dashboard/schedule', icon: Calendar },
        { title: 'Documents', titleAm: 'ሰነዶች', titleSo: 'Qoraalada', href: '/dashboard/documents', icon: FileText },
      ],
    },
  ],
  prison: [
    {
      label: 'Main', labelAm: 'ዋና', labelSo: 'Gudiga',
      items: [
        { title: 'Dashboard', titleAm: 'ዳሽቦርድ', titleSo: 'Boodhadhka', href: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      label: 'Inmates', labelAm: 'እስረኞች', labelSo: 'Maxaabiista',
      items: [
        { title: 'All Inmates', titleAm: 'ሁሉም እስረኞች', titleSo: 'Dhman Maxaabiista', href: '/dashboard/inmates', icon: Users },
        { title: 'Admissions', titleAm: 'ገቢዎች', titleSo: 'Soo Gelida', href: '/dashboard/admissions', icon: UserCheck },
        { title: 'Releases', titleAm: 'መልቀቂያዎች', titleSo: 'Sii Deynta', href: '/dashboard/releases', icon: Shield },
      ],
    },
  ],
  document_officer: [
    {
      label: 'Main', labelAm: 'ዋና', labelSo: 'Gudiga',
      items: [
        { title: 'Dashboard', titleAm: 'ዳሽቦርድ', titleSo: 'Boodhadhka', href: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      label: 'Documents', labelAm: 'ሰነዶች', labelSo: 'Qoraalada',
      items: [
        { title: 'Repository', titleAm: 'ማከማቻ', titleSo: 'Kaydka', href: '/dashboard/documents', icon: FolderOpen },
        { title: 'Pending Verification', titleAm: 'ለማረጋገጫ የሚጠበቁ', titleSo: 'Sugaya Xaqiijin', href: '/dashboard/verify', icon: FileSearch },
        { title: 'Archive', titleAm: 'መዝገብ', titleSo: 'Akiifka', href: '/dashboard/archive', icon: Building2 },
      ],
    },
  ],
  lawyer: [
    {
      label: 'Main', labelAm: 'ዋና', labelSo: 'Gudiga',
      items: [
        { title: 'Dashboard', titleAm: 'ዳሽቦርድ', titleSo: 'Boodhadhka', href: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      label: 'My Work', labelAm: 'የኔ ስራ', labelSo: 'Shaqadeyda',
      items: [
        { title: 'My Cases', titleAm: 'የኔ ጉዳዮች', titleSo: 'Kiisaskeyga', href: '/dashboard/my-cases', icon: FolderOpen },
        { title: 'Hearings', titleAm: 'ችሎቶች', titleSo: 'Dhageysiga', href: '/dashboard/hearings', icon: Calendar },
        { title: 'Documents', titleAm: 'ሰነዶች', titleSo: 'Qoraalada', href: '/dashboard/documents', icon: FileText },
      ],
    },
  ],
  community: [
    {
      label: 'Services', labelAm: 'አገልግሎቶች', labelSo: 'Adeegyada',
      items: [
        { title: 'Dashboard', titleAm: 'ዳሽቦርድ', titleSo: 'Boodhadhka Dadweynaha', href: '/dashboard', icon: LayoutDashboard },
        { title: 'Report Crime', titleAm: 'ወንጀል ሪፖርት', titleSo: 'Soo Gudbi Dambi', href: '/dashboard/report', icon: Send },
        { title: 'Track Case', titleAm: 'ጉዳይ ተከታተል', titleSo: 'Dabagal Kiiska', href: '/dashboard/track', icon: Search },
      ],
    },
  ],
  bureau_admin: [
    {
      label: 'Main', labelAm: 'ዋና', labelSo: 'Gudiga',
      items: [
        { title: 'Dashboard', titleAm: 'ዳሽቦርድ', titleSo: 'Boodhadhka', href: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      label: 'Reports', labelAm: 'ሪፖርቶች', labelSo: 'Warbixinada',
      items: [
        { title: 'Analytics', titleAm: 'ትንተና', titleSo: 'Falanqaynta', href: '/dashboard/analytics', icon: BarChart3 },
        { title: 'Compliance', titleAm: 'ተገዢነት', titleSo: 'Hoggaansamida', href: '/dashboard/compliance', icon: Shield },
        { title: 'Violations', titleAm: 'ጥሰቶች', titleSo: 'Xadgudubyada', href: '/dashboard/violations', icon: AlertTriangle },
      ],
    },
    {
      label: 'Management', labelAm: 'አስተዳደር', labelSo: 'Maamulka',
      items: [
        { title: 'All Cases', titleAm: 'ሁሉም ጉዳዮች', titleSo: 'Dhamaan Kiisaska', href: '/dashboard/all-cases', icon: FolderOpen },
        { title: 'Users', titleAm: 'ተጠቃሚዎች', titleSo: 'Isticmaalayaasha', href: '/dashboard/users', icon: Users },
      ],
    },
  ],
}

export function RoleSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { locale, setLocale } = useI18n()

  if (!user) return null

  const navGroups = roleNavigation[user.role] || roleNavigation.community

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary">
            <Scale className="size-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-primary">Cheche</span>
            <span className="text-xs text-muted-foreground">
              {roleDisplayNames[user.role][locale === 'am' ? 'am' : 'en']}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {navGroups.map((group, idx) => (
          <SidebarGroup key={idx}>
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="flex w-full items-center justify-between">
                  {locale === 'am' ? group.labelAm : locale === 'so' ? group.labelSo : group.label}
                  <ChevronDown className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive(item.href)}
                          className="h-10"
                        >
                          <Link href={item.href}>
                            <item.icon className="size-5" />
                            <span>{locale === 'am' ? item.titleAm : locale === 'so' ? item.titleSo : item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {user.fullName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {locale === 'am' ? user.fullNameAm : user.fullName}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user.department}</p>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="size-4" />
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setLocale('am')}
                className={`rounded px-2 py-1 text-xs font-medium transition-colors ${locale === 'am'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent'
                  }`}
              >
                አማ
              </button>
              <button
                onClick={() => setLocale('en')}
                className={`rounded px-2 py-1 text-xs font-medium transition-colors ${locale === 'en'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent'
                  }`}
              >
                EN
              </button>
              <button
                onClick={() => setLocale('so')}
                className={`rounded px-2 py-1 text-xs font-medium transition-colors ${locale === 'so'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent'
                  }`}
              >
                SO
              </button>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="size-4" />
            {locale === 'am' ? 'ውጣ' : locale === 'so' ? 'Bax' : 'Sign Out'}
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
