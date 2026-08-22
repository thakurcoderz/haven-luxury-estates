import { Head, Link } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    Clock,
    Compass,
    DollarSign,
    ExternalLink,
    HelpCircle,
    Inbox,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    Shield,
    Sparkles,
} from 'lucide-react';
import React, { useState } from 'react';
import FlashMessage from '@/components/flash-message';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import GuestLayout from '@/layouts/guest-layout';
import type { BreadcrumbItem, Enquiry, PaginatedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'My Inquiries & Tours', href: '/my-enquiries' },
];

interface UserEnquiriesProps {
    enquiries?: PaginatedData<Enquiry>;
    statusCounts?: {
        all: number;
        new: number;
        contacted: number;
        resolved: number;
    };
}

export default function UserEnquiries({
    enquiries,
    statusCounts,
}: UserEnquiriesProps) {
    const [selectedStatus, setSelectedStatus] = useState('all');

    const rawList = enquiries?.data || [];
    const counts = statusCounts || {
        all: rawList.length,
        new: rawList.filter((e) => e.status === 'new').length,
        contacted: rawList.filter((e) => e.status === 'contacted').length,
        resolved: rawList.filter((e) => e.status === 'resolved').length,
    };

    const filteredEnquiries = selectedStatus === 'all'
        ? rawList
        : rawList.filter((e) => e.status === selectedStatus);

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'new':
                return {
                    label: 'Pending Agent Review',
                    badgeClass: 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300',
                    icon: Clock,
                    description: 'Your inquiry has been dispatched to our brokerage team and is awaiting agent review.',
                };
            case 'contacted':
                return {
                    label: 'Tour Scheduled / Contacted',
                    badgeClass: 'bg-sky-500/10 border-sky-500/30 text-sky-700 dark:text-sky-300',
                    icon: Phone,
                    description: 'A luxury advisor has processed your inquiry and reached out to coordinate details.',
                };
            case 'resolved':
                return {
                    label: 'Inquiry Completed / Resolved',
                    badgeClass: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300',
                    icon: CheckCircle2,
                    description: 'Your showing or property transaction inquiry has been completed.',
                };
            default:
                return {
                    label: 'Archived',
                    badgeClass: 'bg-muted border-border text-muted-foreground',
                    icon: Inbox,
                    description: 'This communication thread has been archived.',
                };
        }
    };

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'schedule_tour':
                return (
                    <Badge className="bg-emerald-600 text-white gap-1 text-[11px]">
                        <Calendar className="size-3" /> Private Tour Request
                    </Badge>
                );
            case 'make_offer':
                return (
                    <Badge className="bg-purple-600 text-white gap-1 text-[11px]">
                        <DollarSign className="size-3" /> Acquisition Offer
                    </Badge>
                );
            case 'property_inquiry':
                return (
                    <Badge className="bg-sky-600 text-white gap-1 text-[11px]">
                        <HelpCircle className="size-3" /> Property Details
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline" className="text-[11px]">
                        General Advisory
                    </Badge>
                );
        }
    };

    return (
        <GuestLayout>
            <Head title="My Inquiries & Tour Status | Haven Real Estate" />
            <FlashMessage />

            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                            <MessageSquare className="size-3.5" />
                            <span>Client Inquiries & Showing History</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            My Inquiries & Tour Requests
                        </h1>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                            Track real-time response updates, appointment scheduling, and advisor communications.
                        </p>
                    </div>

                    <Link href="/properties">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md gap-2 text-xs">
                            <Compass className="size-4" />
                            <span>Explore More Listings</span>
                        </Button>
                    </Link>
                </div>

                {/* Status Tabs */}
                <div className="flex flex-wrap items-center gap-2 p-1.5 bg-muted rounded-2xl text-xs font-semibold">
                    {[
                        { label: 'All Inquiries', value: 'all', count: counts.all },
                        { label: 'Pending Review', value: 'new', count: counts.new },
                        { label: 'Contacted / Scheduled', value: 'contacted', count: counts.contacted },
                        { label: 'Completed', value: 'resolved', count: counts.resolved },
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => setSelectedStatus(tab.value)}
                            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                                selectedStatus === tab.value
                                    ? 'bg-background text-foreground shadow-sm font-bold'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <span>{tab.label}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted font-mono font-bold">
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Inquiries Feed */}
                {filteredEnquiries.length > 0 ? (
                    <div className="space-y-6">
                        {filteredEnquiries.map((enquiry) => {
                            const statusInfo = getStatusInfo(enquiry.status);
                            const StatusIcon = statusInfo.icon;

                            return (
                                <div
                                    key={enquiry.id}
                                    className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-5"
                                >
                                    {/* Top Bar: Property info & Status Badge */}
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-border/60">
                                        <div className="flex items-start gap-4">
                                            {enquiry.property && (
                                                <div className="size-16 rounded-2xl overflow-hidden bg-muted shrink-0 border border-border">
                                                    <img
                                                        src={
                                                            enquiry.property.images && enquiry.property.images.length > 0
                                                                ? enquiry.property.images[0]
                                                                : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=300&q=80'
                                                        }
                                                        alt={enquiry.property.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}

                                            <div className="space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {getTypeBadge(enquiry.enquiry_type)}
                                                    <span className="text-xs text-muted-foreground">
                                                        Submitted on {new Date(enquiry.created_at).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </span>
                                                </div>

                                                {enquiry.property ? (
                                                    <Link
                                                        href={`/properties/${enquiry.property.slug}`}
                                                        className="text-base sm:text-lg font-bold text-foreground hover:text-emerald-600 transition-colors flex items-center gap-1.5"
                                                    >
                                                        <span>{enquiry.property.title}</span>
                                                        <ExternalLink className="size-3.5 text-muted-foreground" />
                                                    </Link>
                                                ) : (
                                                    <h3 className="text-base font-bold text-foreground">
                                                        General Brokerage Consultation
                                                    </h3>
                                                )}

                                                {enquiry.property && (
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <MapPin className="size-3 text-emerald-600" />
                                                        <span>{enquiry.property.address}, {enquiry.property.city}, {enquiry.property.state}</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Status Pill */}
                                        <div className="shrink-0 flex items-center gap-2">
                                            <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${statusInfo.badgeClass}`}>
                                                <StatusIcon className="size-4" />
                                                <span>{statusInfo.label}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Showing Date if Applicable */}
                                    {enquiry.preferred_date && (
                                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                            <Calendar className="size-4" />
                                            <span>Requested Private Tour Date: <strong>{enquiry.preferred_date}</strong></span>
                                        </div>
                                    )}

                                    {/* Message Body */}
                                    <div className="space-y-1.5">
                                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                            Your Message / Notes
                                        </span>
                                        <div className="p-3.5 rounded-2xl bg-muted/40 text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-line border border-border/40">
                                            "{enquiry.message}"
                                        </div>
                                    </div>

                                    {/* Status Explanation Card */}
                                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground pt-1">
                                        <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span>{statusInfo.description}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 px-4 bg-card border border-dashed border-border rounded-3xl space-y-4 max-w-md mx-auto">
                        <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                            <Inbox className="size-8" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">No Inquiries Found</h3>
                        <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                            {selectedStatus === 'all'
                                ? "You haven't submitted any inquiries yet. Schedule a private showing or request property terms on any listing."
                                : `You don't have any inquiries with status "${selectedStatus}".`}
                        </p>
                        <Link href="/properties">
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold gap-2">
                                <Compass className="size-4" />
                                <span>Browse Available Residences</span>
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </GuestLayout>
    );
}
