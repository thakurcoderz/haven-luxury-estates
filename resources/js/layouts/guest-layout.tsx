import { Link, usePage } from '@inertiajs/react';
import {
    Building2,
    Heart,
    Inbox,
    LayoutGrid,
    Mail,
    Menu,
    Phone,
    Settings,
    Shield,
    Users,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import FlashMessage from '@/components/flash-message';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { Auth } from '@/types';

interface GuestLayoutProps {
    children: React.ReactNode;
    title?: string;
}

/**
 * Primary navigation. Hrefs are unchanged from the previous shell.
 * Buy, Rent, and Listings share a path, so `priceType` disambiguates which
 * one is current. Without it all three highlight at once on /properties.
 */
const navLinks = [
    {
        label: 'Buy',
        href: '/properties?price_type=sale',
        path: '/properties',
        priceType: 'sale',
    },
    {
        label: 'Rent',
        href: '/properties?price_type=rent',
        path: '/properties',
        priceType: 'rent',
    },
    {
        label: 'Listings',
        href: '/properties',
        path: '/properties',
        priceType: null,
    },
    { label: 'About', href: '/about', path: '/about', priceType: null },
    { label: 'Contact', href: '/contact', path: '/contact', priceType: null },
];

export function Wordmark({ className = '' }: { className?: string }) {
    return (
        <span className={`flex items-baseline gap-2 ${className}`}>
            <span className="font-serif text-[1.75rem] leading-none font-semibold tracking-[-0.01em] text-foreground">
                Haven
            </span>
            <span aria-hidden className="h-3 w-px bg-brand" />
            <span className="text-[0.5625rem] leading-none font-semibold tracking-[0.24em] text-muted-foreground uppercase">
                Estates
            </span>
        </span>
    );
}

export default function GuestLayout({ children }: GuestLayoutProps) {
    const page = usePage<{ auth?: Auth }>();
    const user = page.props.auth?.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { currentUrl } = useCurrentUrl();
    const currentPriceType = new URLSearchParams(
        page.url.split('?')[1] ?? '',
    ).get('price_type');

    const isCurrentNavLink = (link: (typeof navLinks)[number]): boolean =>
        currentUrl === link.path && currentPriceType === link.priceType;

    const accountLinks =
        user?.role === 'admin'
            ? [
                  { label: 'Admin dashboard', href: '/admin', icon: Shield },
                  {
                      label: 'Manage listings',
                      href: '/admin/properties',
                      icon: Building2,
                  },
                  {
                      label: 'Inquiries and leads',
                      href: '/admin/enquiries',
                      icon: Inbox,
                  },
                  {
                      label: 'Users and agents',
                      href: '/admin/users',
                      icon: Users,
                  },
                  {
                      label: 'Account settings',
                      href: '/settings/profile',
                      icon: Settings,
                  },
              ]
            : [
                  {
                      label: 'My overview',
                      href: '/dashboard',
                      icon: LayoutGrid,
                  },
                  { label: 'My inquiries', href: '/my-enquiries', icon: Mail },
                  {
                      label: 'Saved properties',
                      href: '/saved-properties',
                      icon: Heart,
                  },
                  {
                      label: 'Account settings',
                      href: '/settings/profile',
                      icon: Settings,
                  },
              ];

    return (
        <div className="flex min-h-[100dvh] flex-col bg-background text-foreground selection:bg-brand selection:text-brand-foreground">
            <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md">
                <div className="mx-auto flex h-18 max-w-[1400px] items-center justify-between gap-8 px-4 sm:px-6 lg:px-10">
                    <Link href="/" aria-label="Haven Estates, home">
                        <Wordmark />
                    </Link>

                    <nav className="hidden items-center gap-7 md:flex">
                        {navLinks.map((link) => {
                            const active = isCurrentNavLink(link);

                            return (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className={`relative py-1 text-sm transition-colors ${
                                        active
                                            ? 'text-foreground'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {link.label}
                                    {active && (
                                        <span
                                            aria-hidden
                                            className="absolute -bottom-px left-0 h-px w-full bg-brand"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="hidden items-center gap-2 sm:flex">
                        {user ? (
                            <>
                                <Link
                                    href="/saved-properties"
                                    className="inline-flex h-9 items-center gap-2 rounded-sm px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    <Heart
                                        className="size-4"
                                        strokeWidth={1.5}
                                    />
                                    <span className="hidden lg:inline">
                                        Saved
                                    </span>
                                </Link>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="h-9 gap-2.5 px-3 font-normal"
                                        >
                                            <span className="flex size-6 items-center justify-center rounded-full bg-brand text-[0.625rem] font-semibold text-brand-foreground">
                                                {user.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                            <span className="max-w-[7.5rem] truncate text-sm">
                                                {user.name}
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="w-60"
                                    >
                                        <DropdownMenuLabel className="font-normal">
                                            <span className="block truncate text-sm font-medium">
                                                {user.name}
                                            </span>
                                            <span className="block truncate text-xs text-muted-foreground">
                                                {user.email}
                                            </span>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {accountLinks.map(
                                            ({ label, href, icon: Icon }) => (
                                                <DropdownMenuItem
                                                    key={href}
                                                    asChild
                                                >
                                                    <Link
                                                        href={href}
                                                        className="cursor-pointer"
                                                    >
                                                        <Icon
                                                            className="mr-2 size-4 text-muted-foreground"
                                                            strokeWidth={1.5}
                                                        />
                                                        {label}
                                                    </Link>
                                                </DropdownMenuItem>
                                            ),
                                        )}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href="/logout"
                                                method="post"
                                                as="button"
                                                className="w-full cursor-pointer text-destructive"
                                            >
                                                Log out
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="inline-flex h-9 items-center px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Sign in
                                </Link>
                                <Button asChild className="h-9">
                                    <Link href="/contact">
                                        Book a consultation
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="-mr-2 p-2 text-foreground md:hidden"
                        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? (
                            <X className="size-5" strokeWidth={1.5} />
                        ) : (
                            <Menu className="size-5" strokeWidth={1.5} />
                        )}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div className="border-t border-border bg-background px-4 pt-2 pb-6 md:hidden">
                        <nav className="flex flex-col">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="border-b border-border py-3.5 text-base text-foreground"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-6 flex flex-col gap-2">
                            {user ? (
                                <>
                                    {accountLinks.map(
                                        ({ label, href, icon: Icon }) => (
                                            <Link
                                                key={href}
                                                href={href}
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                                className="flex items-center gap-2.5 rounded-sm border border-border px-4 py-2.5 text-sm"
                                            >
                                                <Icon
                                                    className="size-4 text-muted-foreground"
                                                    strokeWidth={1.5}
                                                />
                                                {label}
                                            </Link>
                                        ),
                                    )}
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="mt-1 py-2 text-sm text-destructive"
                                    >
                                        Log out
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="rounded-sm border border-border px-4 py-2.5 text-center text-sm"
                                    >
                                        Sign in
                                    </Link>
                                    <Link
                                        href="/contact"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="rounded-sm bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground"
                                    >
                                        Book a consultation
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </header>

            <main className="flex-1">{children}</main>

            <FlashMessage />

            <footer className="border-t border-border">
                <div className="mx-auto max-w-[1400px] px-4 pt-16 pb-10 sm:px-6 lg:px-10">
                    <div className="grid gap-12 lg:grid-cols-12">
                        <div className="lg:col-span-5">
                            <Link href="/" aria-label="Haven Estates, home">
                                <Wordmark />
                            </Link>
                            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                                A brokerage for architecturally significant
                                homes. We represent buyers, sellers, and tenants
                                across coastal, urban, and estate markets.
                            </p>
                            <a
                                href="tel:+18005554283"
                                className="mt-6 inline-flex items-center gap-2 text-sm text-foreground"
                            >
                                <Phone
                                    className="size-4 text-brand"
                                    strokeWidth={1.5}
                                />
                                +1 (800) 555-4283
                            </a>
                        </div>

                        <div className="lg:col-span-2">
                            <h2 className="text-xs font-semibold tracking-[0.16em] text-foreground uppercase">
                                Properties
                            </h2>
                            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                                <li>
                                    <Link
                                        href="/properties?price_type=sale"
                                        className="rule-link hover:text-foreground"
                                    >
                                        Homes for sale
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/properties?price_type=rent"
                                        className="rule-link hover:text-foreground"
                                    >
                                        Rental residences
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/properties?type=luxury-villa"
                                        className="rule-link hover:text-foreground"
                                    >
                                        Villas
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/properties?type=penthouse-suite"
                                        className="rule-link hover:text-foreground"
                                    >
                                        Penthouses
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/properties?type=commercial-office"
                                        className="rule-link hover:text-foreground"
                                    >
                                        Commercial
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="lg:col-span-2">
                            <h2 className="text-xs font-semibold tracking-[0.16em] text-foreground uppercase">
                                Company
                            </h2>
                            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                                <li>
                                    <Link
                                        href="/about"
                                        className="rule-link hover:text-foreground"
                                    >
                                        About the firm
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/about"
                                        className="rule-link hover:text-foreground"
                                    >
                                        Our advisors
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/contact"
                                        className="rule-link hover:text-foreground"
                                    >
                                        Offices
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/contact"
                                        className="rule-link hover:text-foreground"
                                    >
                                        Request a valuation
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="lg:col-span-3">
                            <h2 className="text-xs font-semibold tracking-[0.16em] text-foreground uppercase">
                                Headquarters
                            </h2>
                            <address className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground not-italic">
                                <p>
                                    450 North Canon Drive, Suite 300
                                    <br />
                                    Beverly Hills, CA 90210
                                </p>
                                <a
                                    href="mailto:concierge@havenrealestate.com"
                                    className="rule-link block w-fit hover:text-foreground"
                                >
                                    concierge@havenrealestate.com
                                </a>
                            </address>
                        </div>
                    </div>

                    <div className="mt-14 flex flex-col gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                        <p>
                            © {new Date().getFullYear()} Haven Estates. Licensed
                            brokerage RE-984420. Equal Housing Opportunity.
                        </p>
                        <div className="flex items-center gap-6">
                            <Link
                                href="/about"
                                className="hover:text-foreground"
                            >
                                Privacy
                            </Link>
                            <Link
                                href="/about"
                                className="hover:text-foreground"
                            >
                                Terms
                            </Link>
                            <Link
                                href="/contact"
                                className="hover:text-foreground"
                            >
                                Support
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
