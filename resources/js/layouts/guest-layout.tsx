import { Link, usePage } from '@inertiajs/react';
import {
    Building2,
    Heart,
    Home,
    Inbox,
    Info,
    Mail,
    Menu,
    Phone,
    Plus,
    Search,
    Shield,
    Sparkles,
    User as UserIcon,
    Users,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
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
import type { Auth } from '@/types';

interface GuestLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function GuestLayout({ children, title }: GuestLayoutProps) {
    const { auth, name } = usePage<{ auth?: Auth; name?: string }>().props;
    const user = auth?.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const siteName = name === 'Laravel' ? 'Haven Real Estate' : name;

    const navLinks = [
        { label: 'Home', href: '/' },
        { label: 'Explore All', href: '/properties' },
        { label: 'For Sale', href: '/properties?price_type=sale' },
        { label: 'For Rent', href: '/properties?price_type=rent' },
        { label: 'About Us', href: '/about' },
        { label: 'Contact', href: '/contact' },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-emerald-500 selection:text-white">
            {/* Top Bar for contact info */}
            <div className="hidden lg:block border-b border-border/40 bg-muted/40 py-2 text-xs text-muted-foreground">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1.5">
                            <Phone className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            +1 (800) 555-HAVEN
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Mail className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            inquiry@havenrealestate.com
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Sparkles className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            Premium Luxury & Modern Real Estate Portfolio
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        {user?.role === 'admin' && (
                            <Link
                                href="/admin"
                                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                            >
                                <Shield className="size-3.5" />
                                Admin Management
                            </Link>
                        )}
                        <span>Mon - Sat: 8:00 AM - 8:00 PM EST</span>
                    </div>
                </div>
            </div>

            {/* Main Header / Navbar */}
            <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform duration-200">
                                <AppLogoIcon className="size-6 fill-none stroke-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold tracking-tight text-foreground flex items-center gap-1.5">
                                    {siteName}
                                </span>
                                <span className="text-[10px] tracking-widest uppercase font-semibold text-muted-foreground">
                                    Luxury Living & Estates
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="px-3.5 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Right Actions */}
                        <div className="hidden sm:flex items-center gap-3">
                            {user ? (
                                <>
                                    <Link href="/saved-properties">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2 rounded-lg border-border/60 hover:border-emerald-500/50"
                                        >
                                            <Heart className="size-4 text-rose-500 fill-rose-500/20" />
                                            <span className="hidden lg:inline">Saved</span>
                                        </Button>
                                    </Link>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="gap-2.5 px-3 py-1.5 rounded-xl border border-border/60 hover:bg-muted"
                                            >
                                                <div className="size-7 rounded-full bg-emerald-600/10 text-emerald-600 flex items-center justify-center font-bold text-xs">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <span className="text-sm font-medium max-w-[120px] truncate">
                                                    {user.name}
                                                </span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56">
                                            <DropdownMenuLabel>
                                                <div className="flex flex-col space-y-1">
                                                    <p className="text-sm font-semibold leading-none">{user.name}</p>
                                                    <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
                                                    {user.role === 'admin' && (
                                                        <span className="inline-flex items-center px-1.5 py-0.5 mt-1 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 w-fit">
                                                            Administrator
                                                        </span>
                                                    )}
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            {user.role === 'admin' ? (
                                                <>
                                                    <DropdownMenuItem asChild>
                                                        <Link href="/admin" className="cursor-pointer font-semibold text-emerald-600 dark:text-emerald-400">
                                                            <Shield className="mr-2 size-4" />
                                                            Admin Dashboard
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href="/admin/properties" className="cursor-pointer">
                                                            <Building2 className="mr-2 size-4 text-emerald-600" />
                                                            Manage Listings
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href="/admin/enquiries" className="cursor-pointer">
                                                            <Inbox className="mr-2 size-4 text-emerald-600" />
                                                            Inquiries & Leads
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href="/admin/users" className="cursor-pointer">
                                                            <Users className="mr-2 size-4 text-emerald-600" />
                                                            Users & Agents
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href="/settings/profile" className="cursor-pointer">
                                                            <UserIcon className="mr-2 size-4 text-muted-foreground" />
                                                            Account Settings
                                                        </Link>
                                                    </DropdownMenuItem>
                                                </>
                                            ) : (
                                                <>
                                                    <DropdownMenuItem asChild>
                                                        <Link href="/dashboard" className="cursor-pointer font-medium">
                                                            <Home className="mr-2 size-4 text-emerald-600" />
                                                            My Overview
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href="/my-enquiries" className="cursor-pointer">
                                                            <Mail className="mr-2 size-4 text-emerald-600" />
                                                            My Inquiries & Tours
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href="/saved-properties" className="cursor-pointer">
                                                            <Heart className="mr-2 size-4 text-rose-500" />
                                                            Saved Properties
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href="/settings/profile" className="cursor-pointer">
                                                            <UserIcon className="mr-2 size-4 text-muted-foreground" />
                                                            Settings & Profile
                                                        </Link>
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link href="/logout" method="post" as="button" className="w-full cursor-pointer text-red-600 dark:text-red-400">
                                                    Log out
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <Button variant="ghost" size="sm" className="font-medium">
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button
                                            size="sm"
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm shadow-emerald-600/30"
                                        >
                                            Get Started
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile menu trigger */}
                        <div className="flex md:hidden items-center gap-2">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                                aria-label="Toggle Menu"
                            >
                                {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Drawer Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-b border-border bg-background px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
                        <div className="flex flex-col space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-3 py-2.5 text-base font-medium rounded-lg text-foreground hover:bg-muted transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-border flex flex-col gap-2">
                            {user ? (
                                <>
                                    <div className="px-3 py-2 text-sm text-muted-foreground">
                                        Signed in as <span className="font-semibold text-foreground">{user.name}</span>
                                    </div>
                                    {user.role === 'admin' ? (
                                        <>
                                            <Link
                                                href="/admin"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="w-full text-center py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-semibold flex items-center justify-center gap-2"
                                            >
                                                <Shield className="size-4" />
                                                Admin Dashboard
                                            </Link>
                                            <Link
                                                href="/admin/properties"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="w-full py-2.5 px-4 rounded-xl border border-border font-medium flex items-center gap-2"
                                            >
                                                <Building2 className="size-4 text-emerald-600" />
                                                Manage Listings
                                            </Link>
                                            <Link
                                                href="/admin/enquiries"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="w-full py-2.5 px-4 rounded-xl border border-border font-medium flex items-center gap-2"
                                            >
                                                <Inbox className="size-4 text-emerald-600" />
                                                Inquiries & Leads
                                            </Link>
                                            <Link
                                                href="/admin/users"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="w-full py-2.5 px-4 rounded-xl border border-border font-medium flex items-center gap-2"
                                            >
                                                <Users className="size-4 text-emerald-600" />
                                                Users & Agents
                                            </Link>
                                            <Link
                                                href="/settings/profile"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="w-full py-2.5 px-4 rounded-xl border border-border font-medium flex items-center gap-2"
                                            >
                                                <UserIcon className="size-4 text-muted-foreground" />
                                                Account Settings
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                href="/dashboard"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="w-full py-2.5 px-4 rounded-xl border border-border font-medium flex items-center gap-2"
                                            >
                                                <Home className="size-4 text-emerald-600" />
                                                My Overview
                                            </Link>
                                            <Link
                                                href="/my-enquiries"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="w-full py-2.5 px-4 rounded-xl border border-border font-medium flex items-center gap-2"
                                            >
                                                <Mail className="size-4 text-emerald-600" />
                                                My Inquiries & Tours
                                            </Link>
                                            <Link
                                                href="/saved-properties"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="w-full py-2.5 px-4 rounded-xl border border-border font-medium flex items-center gap-2"
                                            >
                                                <Heart className="size-4 text-rose-500" />
                                                Saved Properties
                                            </Link>
                                            <Link
                                                href="/settings/profile"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="w-full py-2.5 px-4 rounded-xl border border-border font-medium flex items-center gap-2"
                                            >
                                                <UserIcon className="size-4 text-muted-foreground" />
                                                Settings & Profile
                                            </Link>
                                        </>
                                    )}
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="w-full text-center py-2 px-4 rounded-xl text-red-600 font-medium"
                                    >
                                        Log Out
                                    </Link>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-2 pt-2">
                                    <Link
                                        href="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="w-full text-center py-2.5 px-4 rounded-lg border border-border font-medium hover:bg-muted"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="w-full text-center py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Page Main Content */}
            <main className="flex-1">{children}</main>

            {/* Flash Message Banner / Toast */}
            <FlashMessage />

            {/* Luxury Real Estate Footer */}
            <footer className="border-t border-border bg-card/60 text-card-foreground">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
                        {/* Brand & Mission */}
                        <div className="lg:col-span-2 space-y-4">
                            <Link href="/" className="flex items-center gap-3">
                                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
                                    <AppLogoIcon className="size-6 fill-none stroke-white" />
                                </div>
                                <span className="text-xl font-bold tracking-tight text-foreground">
                                    {siteName}
                                </span>
                            </Link>
                            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                                Redefining the standard of luxury property discovery. We connect discerning buyers, sellers, and tenants with the world's most exceptional residential and commercial real estate.
                            </p>
                            <div className="flex items-center gap-3 pt-2 text-muted-foreground">
                                <span className="text-xs bg-muted px-3 py-1.5 rounded-full font-medium">
                                    Licensed Brokerage #RE-984420
                                </span>
                            </div>
                        </div>

                        {/* Quick Navigation */}
                        <div>
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
                                Properties
                            </h4>
                            <ul className="space-y-2.5 text-sm text-muted-foreground">
                                <li>
                                    <Link href="/properties?price_type=sale" className="hover:text-emerald-600 transition-colors">
                                        Homes for Sale
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/properties?price_type=rent" className="hover:text-emerald-600 transition-colors">
                                        Rental Residences
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/properties?type=luxury-villa" className="hover:text-emerald-600 transition-colors">
                                        Luxury Villas
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/properties?type=penthouse-suite" className="hover:text-emerald-600 transition-colors">
                                        Penthouse Suites
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/properties?type=commercial-office" className="hover:text-emerald-600 transition-colors">
                                        Commercial Spaces
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Company & Support */}
                        <div>
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
                                Company
                            </h4>
                            <ul className="space-y-2.5 text-sm text-muted-foreground">
                                <li>
                                    <Link href="/about" className="hover:text-emerald-600 transition-colors">
                                        About Our Firm
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="hover:text-emerald-600 transition-colors">
                                        Contact & Offices
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/properties" className="hover:text-emerald-600 transition-colors">
                                        Featured Listings
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="hover:text-emerald-600 transition-colors">
                                        Schedule a Valuation
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact & Hours */}
                        <div>
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
                                Headquarters
                            </h4>
                            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                                <p>
                                    450 North Canon Drive, Suite 300<br />
                                    Beverly Hills, CA 90210
                                </p>
                                <p className="text-xs">
                                    <strong className="text-foreground">Direct:</strong> +1 (800) 555-4283<br />
                                    <strong className="text-foreground">Email:</strong> concierge@havenrealestate.com
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                        <p>© {new Date().getFullYear()} {siteName}, Inc. All rights reserved. Equal Housing Opportunity.</p>
                        <div className="flex items-center gap-6">
                            <Link href="/about" className="hover:text-foreground">Privacy Policy</Link>
                            <Link href="/about" className="hover:text-foreground">Terms of Service</Link>
                            <Link href="/contact" className="hover:text-foreground">Support</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
