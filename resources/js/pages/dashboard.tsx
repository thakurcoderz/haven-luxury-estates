import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    Compass,
    ExternalLink,
    Heart,
    Inbox,
    Mail,
    MapPin,
    Phone,
    Shield,
    Sparkles,
} from 'lucide-react';
import React from 'react';
import FlashMessage from '@/components/flash-message';
import PropertyCard from '@/components/property-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import GuestLayout from '@/layouts/guest-layout';
import type { Auth, BreadcrumbItem, Enquiry, Property } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardProps {
    recentEnquiries?: Enquiry[];
    recentSavedProperties?: Property[];
    stats?: {
        saved_count: number;
        total_enquiries: number;
        pending_enquiries: number;
        contacted_enquiries: number;
        resolved_enquiries: number;
    };
}

export default function Dashboard({
    recentEnquiries,
    recentSavedProperties,
    stats,
}: DashboardProps) {
    const { auth } = usePage<{ auth?: Auth }>().props;
    const user = auth?.user;
    const isAdmin = user?.role === 'admin';

    const safeStats = {
        saved_count: stats?.saved_count ?? 0,
        total_enquiries: stats?.total_enquiries ?? 0,
        pending_enquiries: stats?.pending_enquiries ?? 0,
        contacted_enquiries: stats?.contacted_enquiries ?? 0,
        resolved_enquiries: stats?.resolved_enquiries ?? 0,
    };
    const safeEnquiries = recentEnquiries || [];
    const safeSavedProperties = recentSavedProperties || [];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'new':
                return (
                    <Badge className="bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300 gap-1 text-[10px]">
                        <Clock className="size-3" /> Pending Review
                    </Badge>
                );
            case 'contacted':
                return (
                    <Badge className="bg-sky-500/10 border-sky-500/30 text-sky-700 dark:text-sky-300 gap-1 text-[10px]">
                        <Phone className="size-3" /> Tour Scheduled
                    </Badge>
                );
            case 'resolved':
                return (
                    <Badge className="bg-brand-soft border-brand text-foreground gap-1 text-[10px]">
                        <CheckCircle2 className="size-3" /> Completed
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline" className="text-[10px]">
                        {status}
                    </Badge>
                );
        }
    };

    return (
        <GuestLayout>
            <Head title="Client Overview | Haven Real Estate" />
            <FlashMessage />

            <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
                {/* Welcome Card */}
                <div className="relative overflow-hidden rounded-md bg-gradient-to-r from-slate-900 via-brand-soft to-slate-900 p-6 sm:p-8 text-white shadow-xl">
                    <div className="relative z-10 max-w-2xl space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-soft border border-brand text-brand text-xs font-semibold">
                            <Sparkles className="size-3.5" />
                            <span>Client Sanctuary</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                            Welcome back, {user?.name}!
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            Discover tailored luxury listings, track your private showing requests, and manage your saved bookmarks from your personal portal.
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <Link href="/properties">
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md gap-2 font-semibold text-xs">
                                    <Compass className="size-4" />
                                    <span>Explore Properties</span>
                                </Button>
                            </Link>

                            <Link href="/my-enquiries">
                                <Button className="border border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white rounded-md gap-2 text-xs">
                                    <Inbox className="size-4 text-brand" />
                                    <span>My Inquiries ({safeStats.total_enquiries})</span>
                                </Button>
                            </Link>

                            <Link href="/saved-properties">
                                <Button className="border border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white rounded-md gap-2 text-xs">
                                    <Heart className="size-4 text-rose-400 fill-rose-400/20" />
                                    <span>Saved ({safeStats.saved_count})</span>
                                </Button>
                            </Link>

                            {isAdmin && (
                                <Link href="/admin">
                                    <Button variant="secondary" className="rounded-md gap-2 font-semibold text-xs">
                                        <Shield className="size-4 text-brand" />
                                        <span>Admin Control Panel</span>
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Key Client Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-card border border-border rounded-md p-5 space-y-1 shadow-sm">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                            <Heart className="size-3.5 text-rose-500" />
                            <span>Saved Homes</span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                            {safeStats.saved_count}
                        </div>
                        <Link href="/saved-properties" className="text-[11px] text-brand font-semibold hover:underline block pt-1">
                            View saved list →
                        </Link>
                    </div>

                    <div className="bg-card border border-border rounded-md p-5 space-y-1 shadow-sm">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                            <Inbox className="size-3.5 text-brand" />
                            <span>Total Inquiries</span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                            {safeStats.total_enquiries}
                        </div>
                        <Link href="/my-enquiries" className="text-[11px] text-brand font-semibold hover:underline block pt-1">
                            View all inquiries →
                        </Link>
                    </div>

                    <div className="bg-card border border-border rounded-md p-5 space-y-1 shadow-sm">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                            <Clock className="size-3.5 text-amber-500" />
                            <span>Pending Review</span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                            {safeStats.pending_enquiries}
                        </div>
                        <p className="text-[11px] text-muted-foreground pt-1">Awaiting agent review</p>
                    </div>

                    <div className="bg-card border border-border rounded-md p-5 space-y-1 shadow-sm">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="size-3.5 text-brand" />
                            <span>Active / Scheduled</span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-brand">
                            {safeStats.contacted_enquiries + safeStats.resolved_enquiries}
                        </div>
                        <p className="text-[11px] text-muted-foreground pt-1">Tours & consultations</p>
                    </div>
                </div>

                {/* Two Columns: Recent Inquiries with Status & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Inquiries & Showing Status (7 cols) */}
                    <div className="lg:col-span-7 bg-card border border-border rounded-md p-6 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <Inbox className="size-4 text-brand" />
                                    <span>My Recent Inquiries & Tours</span>
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Real-time status updates from our brokerage advisors.
                                </p>
                            </div>
                            <Link href="/my-enquiries">
                                <Button variant="ghost" size="sm" className="text-xs text-brand gap-1 font-semibold">
                                     <span>See All ({safeStats.total_enquiries})</span>
                                     <ArrowRight className="size-3.5" />
                                 </Button>
                            </Link>
                        </div>

                        {safeEnquiries.length > 0 ? (
                            <div className="space-y-3">
                                {safeEnquiries.map((enquiry) => (
                                    <div
                                        key={enquiry.id}
                                        className="p-4 rounded-md bg-muted/40 border border-border/60 hover:bg-muted/70 transition-colors space-y-3"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                {enquiry.property ? (
                                                    <Link
                                                        href={`/properties/${enquiry.property.slug}`}
                                                        className="font-bold text-sm text-foreground hover:text-brand transition-colors truncate block"
                                                    >
                                                        📍 {enquiry.property.title}
                                                    </Link>
                                                ) : (
                                                    <span className="font-bold text-sm text-foreground">
                                                        General Consultation
                                                    </span>
                                                )}
                                                <span className="text-[11px] text-muted-foreground">
                                                    Submitted on {new Date(enquiry.created_at).toLocaleDateString()}
                                                </span>
                                            </div>

                                            {getStatusBadge(enquiry.status)}
                                        </div>

                                        {enquiry.preferred_date && (
                                            <div className="flex items-center gap-1.5 text-xs text-brand font-semibold bg-brand-soft px-3 py-1 rounded-lg w-fit">
                                                <Calendar className="size-3.5" />
                                                <span>Requested Tour: {enquiry.preferred_date}</span>
                                            </div>
                                        )}

                                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                            "{enquiry.message}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 px-4 border border-dashed border-border rounded-md space-y-3">
                                <Inbox className="size-8 text-muted-foreground mx-auto" />
                                <p className="text-xs text-muted-foreground">
                                    You haven't submitted any inquiries yet.
                                </p>
                                <Link href="/properties">
                                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-xs">
                                        Browse Listings
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Saved Properties Shortcut (5 cols) */}
                    <div className="lg:col-span-5 bg-card border border-border rounded-md p-6 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <Heart className="size-4 text-rose-500" />
                                    <span>Saved Properties</span>
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Bookmarked residences for quick comparison.
                                </p>
                            </div>
                            <Link href="/saved-properties">
                                <Button variant="ghost" size="sm" className="text-xs text-brand gap-1 font-semibold">
                                    <span>All ({safeStats.saved_count})</span>
                                    <ArrowRight className="size-3.5" />
                                </Button>
                            </Link>
                        </div>

                        {safeSavedProperties.length > 0 ? (
                            <div className="space-y-3">
                                {safeSavedProperties.map((prop) => (
                                    <Link
                                        key={prop.id}
                                        href={`/properties/${prop.slug}`}
                                        className="flex items-center gap-3 p-3 rounded-md bg-muted/40 border border-border/60 hover:bg-muted/70 transition-colors"
                                    >
                                        <div className="size-14 rounded-md overflow-hidden bg-muted shrink-0">
                                            <img
                                                src={
                                                    prop.images && prop.images.length > 0
                                                        ? prop.images[0]
                                                        : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=300&q=80'
                                                }
                                                alt={prop.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-bold text-xs text-foreground truncate">
                                                {prop.title}
                                            </h4>
                                            <p className="text-[11px] text-muted-foreground truncate">
                                                {prop.city}, {prop.state}
                                            </p>
                                            <p className="text-xs font-bold text-brand mt-0.5">
                                                ${Number(prop.price).toLocaleString()}
                                            </p>
                                        </div>

                                        <ExternalLink className="size-4 text-muted-foreground shrink-0" />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 px-4 border border-dashed border-border rounded-md space-y-3">
                                <Heart className="size-8 text-rose-400 mx-auto" />
                                <p className="text-xs text-muted-foreground">
                                    No saved properties yet. Click the heart icon on any listing to bookmark it here.
                                </p>
                                <Link href="/properties">
                                    <Button size="sm" variant="outline" className="rounded-md text-xs">
                                        Explore Catalog
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}

