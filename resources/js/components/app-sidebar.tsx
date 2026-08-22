import { Link, usePage } from '@inertiajs/react';
import {
    Building2,
    Compass,
    Globe,
    Heart,
    Inbox,
    Layers,
    LayoutDashboard,
    LayoutGrid,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { Auth, NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage<{ auth?: Auth }>().props;
    const user = auth?.user;
    const isAdmin = user?.role === 'admin';

    const adminNavItems: NavItem[] = [
        {
            title: 'Admin Dashboard',
            href: '/admin',
            icon: LayoutDashboard,
        },
        {
            title: 'Manage Listings',
            href: '/admin/properties',
            icon: Building2,
        },
        {
            title: 'Property Types',
            href: '/admin/property-types',
            icon: Layers,
        },
        {
            title: 'Inquiries & Leads',
            href: '/admin/enquiries',
            icon: Inbox,
        },
        {
            title: 'Users & Agents',
            href: '/admin/users',
            icon: Users,
        },
    ];

    const websiteNavItems: NavItem[] = [
        {
            title: 'Live Website',
            href: '/',
            icon: Globe,
        },
        {
            title: 'Public Catalog',
            href: '/properties',
            icon: Compass,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={adminNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={websiteNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
