import { Link, usePage } from '@inertiajs/react';
import {
    Heart,
    Lock,
    Mail,
    Palette,
    Shield,
    User,
} from 'lucide-react';
import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import GuestLayout from '@/layouts/guest-layout';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { Auth } from '@/types';

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const { auth } = usePage<{ auth?: Auth }>().props;
    const isAdmin = auth?.user?.role === 'admin';

    const clientNavItems = [
        {
            title: 'Personal Info',
            href: edit(),
            icon: User,
        },
        {
            title: 'My Inquiries & Tours',
            href: '/my-enquiries',
            icon: Mail,
        },
        {
            title: 'Saved Properties',
            href: '/saved-properties',
            icon: Heart,
        },
        {
            title: 'Password & Security',
            href: editSecurity(),
            icon: Lock,
        },
        {
            title: 'Theme & Appearance',
            href: editAppearance(),
            icon: Palette,
        },
    ];

    const adminNavItems = [
        {
            title: 'Admin Credentials',
            href: edit(),
            icon: User,
        },
        {
            title: 'Password & Security',
            href: editSecurity(),
            icon: Lock,
        },
        {
            title: 'Theme & Appearance',
            href: editAppearance(),
            icon: Palette,
        },
        {
            title: 'Admin Control Center',
            href: '/admin',
            icon: Shield,
        },
    ];

    const sidebarNavItems = isAdmin ? adminNavItems : clientNavItems;

    return (
        <GuestLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                <Heading
                    title={isAdmin ? 'Admin Settings & Preferences' : 'Profile & Preferences'}
                    description={
                        isAdmin
                            ? 'Manage your administrator credentials and platform appearance settings.'
                            : 'Manage your contact details, tour notifications, and security credentials.'
                    }
                />

                <div className="flex flex-col lg:flex-row lg:space-x-12">
                    <aside className="w-full max-w-xl lg:w-60 shrink-0">
                        <nav
                            className="flex flex-col space-y-1.5 space-x-0"
                            aria-label="Settings"
                        >
                            {sidebarNavItems.map((item, index) => {
                                const Icon = item.icon;
                                const isActive = isCurrentOrParentUrl(item.href);

                                return (
                                    <Button
                                        key={`${toUrl(item.href)}-${index}`}
                                        size="sm"
                                        variant="ghost"
                                        asChild
                                        className={cn(
                                            'w-full justify-start rounded-xl px-3 py-2 text-xs font-semibold gap-2.5 transition-colors',
                                            isActive
                                                ? 'bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/20'
                                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                                        )}
                                    >
                                        <Link href={item.href}>
                                            <Icon className={cn('size-4', isActive ? 'text-emerald-600' : 'text-muted-foreground')} />
                                            <span>{item.title}</span>
                                        </Link>
                                    </Button>
                                );
                            })}
                        </nav>
                    </aside>

                    <Separator className="my-6 lg:hidden" />

                    <div className="flex-1 max-w-3xl">
                        <section className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
                            {children}
                        </section>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}

