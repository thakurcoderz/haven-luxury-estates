import { Link, usePage } from '@inertiajs/react';
import { Lock, Palette, User } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import AppLayout from '@/layouts/app-layout';
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

    /*
     * Settings destinations only. My Inquiries and Saved Properties used to
     * live here, but they leave the settings layout entirely, so sitting in
     * this nav made them read as tabs that then navigated away. Both are
     * reachable from the account menu in the header.
     */
    const clientNavItems = [
        {
            title: 'Personal Info',
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
    ];

    const sidebarNavItems = isAdmin ? adminNavItems : clientNavItems;

    /*
     * Admins reach settings from the admin sidebar, so they keep that shell.
     * Clients only ever see the public site, so the marketing shell is the
     * right frame for them and keeps a way back to browsing.
     */
    const Shell = isAdmin ? AppLayout : GuestLayout;

    return (
        <Shell>
            <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
                <Heading
                    title={
                        isAdmin
                            ? 'Admin Settings & Preferences'
                            : 'Profile & Preferences'
                    }
                    description={
                        isAdmin
                            ? 'Manage your administrator credentials and platform appearance settings.'
                            : 'Manage your contact details, tour notifications, and security credentials.'
                    }
                />

                <div className="flex flex-col lg:flex-row lg:space-x-12">
                    <aside className="w-full max-w-xl shrink-0 lg:w-60">
                        <nav
                            className="flex flex-col space-y-1.5 space-x-0"
                            aria-label="Settings"
                        >
                            {sidebarNavItems.map((item, index) => {
                                const Icon = item.icon;
                                const isActive = isCurrentOrParentUrl(
                                    item.href,
                                );

                                return (
                                    <Button
                                        key={`${toUrl(item.href)}-${index}`}
                                        size="sm"
                                        variant="ghost"
                                        asChild
                                        className={cn(
                                            'w-full justify-start gap-2.5 rounded-md px-3 py-2 text-xs font-semibold transition-colors',
                                            isActive
                                                ? 'border border-brand bg-brand-soft font-bold text-brand'
                                                : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
                                        )}
                                    >
                                        <Link href={item.href}>
                                            <Icon
                                                className={cn(
                                                    'size-4',
                                                    isActive
                                                        ? 'text-brand'
                                                        : 'text-muted-foreground',
                                                )}
                                            />
                                            <span>{item.title}</span>
                                        </Link>
                                    </Button>
                                );
                            })}
                        </nav>
                    </aside>

                    <Separator className="my-6 lg:hidden" />

                    <div className="max-w-3xl flex-1">
                        <section className="space-y-8 rounded-md border border-border/80 bg-card p-6 shadow-sm sm:p-8">
                            {children}
                        </section>
                    </div>
                </div>
            </div>
        </Shell>
    );
}
