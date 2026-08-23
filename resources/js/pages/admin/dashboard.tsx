import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Building2,
    CheckCircle2,
    Clock,
    DollarSign,
    ExternalLink,
    Eye,
    FolderKanban,
    Heart,
    Inbox,
    Layers,
    LayoutDashboard,
    Mail,
    Phone,
    Plus,
    Shield,
    Sparkles,
    TrendingUp,
    Users,
} from 'lucide-react';
import React from 'react';
import FlashMessage from '@/components/flash-message';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Enquiry, Property } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin',
    },
];

interface DashboardProps {
    stats: {
        total_properties: number;
        active_properties: number;
        pending_properties: number;
        sold_or_rented_properties: number;
        total_enquiries: number;
        new_enquiries: number;
        total_users: number;
        total_agents: number;
        total_property_types: number;
    };
    recentEnquiries: Enquiry[];
    recentProperties: Property[];
    enquiryStatusCounts: {
        new: number;
        contacted: number;
        resolved: number;
        archived: number;
    };
}

export default function AdminDashboard({
    stats,
    recentEnquiries = [],
    recentProperties = [],
    enquiryStatusCounts,
}: DashboardProps) {
    const formatPrice = (price: number | string, priceType: string) => {
        const num = typeof price === 'string' ? parseFloat(price) : price;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(num);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard | Real Estate Management" />
            <FlashMessage />

            <div className="p-4 sm:p-6 lg:p-8 space-y-8">
                {/* Dashboard Header Bar with Quick Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand uppercase tracking-wider mb-1">
                            <Shield className="size-3.5" />
                            <span>Brokerage Control Center</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            Administrative Overview
                        </h1>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                            Manage your real estate listings, client inquiries, property categories, and advisory team.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/properties" target="_blank">
                            <Button variant="outline" size="sm" className="rounded-md gap-2 text-xs">
                                <ExternalLink className="size-3.5" />
                                <span>Public Site</span>
                            </Button>
                        </Link>
                        <Link href="/admin/properties/create">
                            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md shadow-md gap-1.5 text-xs">
                                <Plus className="size-4" />
                                <span>Add New Listing</span>
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Key Metric Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {/* Active Listings */}
                    <div className="bg-card border border-border/80 rounded-md p-5 shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Active Listings
                            </span>
                            <div className="size-9 rounded-md bg-brand-soft text-brand flex items-center justify-center">
                                <Building2 className="size-4.5" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                            {stats.active_properties}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                            <span className="text-brand font-semibold">{stats.total_properties} total</span>
                            <span>•</span>
                            <span>{stats.pending_properties} pending</span>
                        </div>
                    </div>

                    {/* New Inquiries */}
                    <div className="bg-card border border-border/80 rounded-md p-5 shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                New Leads & Inquiries
                            </span>
                            <div className="size-9 rounded-md bg-muted text-muted-foreground flex items-center justify-center">
                                <Inbox className="size-4.5" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-brand tracking-tight">
                            {stats.new_enquiries}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                            <span>{stats.total_enquiries} total inquiries received</span>
                        </div>
                    </div>

                    {/* Categories / Types */}
                    <div className="bg-card border border-border/80 rounded-md p-5 shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Property Categories
                            </span>
                            <div className="size-9 rounded-md bg-muted text-muted-foreground flex items-center justify-center">
                                <Layers className="size-4.5" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                            {stats.total_property_types}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                            <Link href="/admin/property-types" className="text-brand font-semibold hover:underline">
                                Manage categories →
                            </Link>
                        </div>
                    </div>

                    {/* Advisors & Users */}
                    <div className="bg-card border border-border/80 rounded-md p-5 shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Agents & Users
                            </span>
                            <div className="size-9 rounded-md bg-muted text-muted-foreground flex items-center justify-center">
                                <Users className="size-4.5" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                            {stats.total_users}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                            <span className="text-foreground font-semibold">{stats.total_agents} active agents</span>
                        </div>
                    </div>
                </div>

                {/* Two Column Grid: Recent Inquiries & Recent Properties */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Recent Inquiries (7 cols) */}
                    <div className="lg:col-span-7 bg-card border border-border rounded-md p-6 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <Inbox className="size-4 text-brand" />
                                    <span>Recent Inquiries & Tour Requests</span>
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Latest customer messages requiring agent response.
                                </p>
                            </div>
                            <Link href="/admin/enquiries">
                                <Button variant="ghost" size="sm" className="text-xs text-brand gap-1">
                                    View All ({stats.total_enquiries}) →
                                </Button>
                            </Link>
                        </div>

                        {recentEnquiries.length > 0 ? (
                            <div className="space-y-3">
                                {recentEnquiries.map((enquiry) => (
                                    <div
                                        key={enquiry.id}
                                        className="p-4 rounded-md bg-muted/40 border border-border/60 hover:bg-muted/70 transition-colors space-y-2"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="font-bold text-sm text-foreground truncate">
                                                    {enquiry.name}
                                                </span>
                                                <Badge
                                                    className={`text-[10px] uppercase font-bold ${
                                                        enquiry.status === 'new'
                                                            ? 'bg-amber-500 text-slate-950'
                                                            : enquiry.status === 'contacted'
                                                            ? 'bg-sky-600 text-white'
                                                            : 'bg-primary text-primary-foreground'
                                                    }`}
                                                >
                                                    {enquiry.status}
                                                </Badge>
                                            </div>

                                            <span className="text-[11px] text-muted-foreground shrink-0">
                                                {new Date(enquiry.created_at).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                            "{enquiry.message}"
                                        </p>

                                        {enquiry.property && (
                                            <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                                                <span className="truncate max-w-xs text-foreground font-medium">
                                                    📍 {enquiry.property.title}
                                                </span>
                                                <Link
                                                    href={`/admin/enquiries`}
                                                    className="text-brand font-semibold hover:underline"
                                                >
                                                    Manage Inquiry →
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground py-8 text-center">
                                No inquiries received yet.
                            </p>
                        )}
                    </div>

                    {/* Recent Properties (5 cols) */}
                    <div className="lg:col-span-5 bg-card border border-border rounded-md p-6 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <Building2 className="size-4 text-brand" />
                                    <span>Recent Listings</span>
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Newly registered portfolio entries.
                                </p>
                            </div>
                            <Link href="/admin/properties">
                                <Button variant="ghost" size="sm" className="text-xs text-brand gap-1">
                                    View All →
                                </Button>
                            </Link>
                        </div>

                        {recentProperties.length > 0 ? (
                            <div className="space-y-3">
                                {recentProperties.map((property) => (
                                    <div
                                        key={property.id}
                                        className="flex items-center gap-3 p-3 rounded-md bg-muted/40 border border-border/60 hover:bg-muted/70 transition-colors"
                                    >
                                        <div className="size-14 rounded-lg overflow-hidden bg-muted shrink-0">
                                            <img
                                                src={
                                                    property.images && property.images.length > 0
                                                        ? property.images[0]
                                                        : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80'
                                                }
                                                alt={property.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-xs text-foreground truncate">
                                                {property.title}
                                            </h4>
                                            <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                                                {property.city}, {property.state}
                                            </p>
                                            <p className="text-xs font-bold text-brand mt-1">
                                                {formatPrice(property.price, property.price_type)}
                                            </p>
                                        </div>

                                        <div className="shrink-0 flex flex-col items-end gap-1">
                                            <Badge
                                                variant="outline"
                                                className={`text-[10px] capitalize ${
                                                    property.status === 'available'
                                                        ? 'border-brand text-brand'
                                                        : 'border-border text-muted-foreground'
                                                }`}
                                            >
                                                {property.status}
                                            </Badge>
                                            <Link
                                                href={`/admin/properties/${property.id}/edit`}
                                                className="text-[11px] font-semibold text-muted-foreground hover:text-foreground"
                                            >
                                                Edit
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground py-8 text-center">
                                No properties registered yet.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
