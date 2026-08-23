import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    Clock,
    DollarSign,
    ExternalLink,
    Eye,
    HelpCircle,
    Inbox,
    Mail,
    MessageSquare,
    Phone,
    Save,
    Search,
    Trash2,
    User,
} from 'lucide-react';
import React, { useState } from 'react';
import FlashMessage from '@/components/flash-message';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Enquiry, PaginatedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Inquiries & Leads', href: '/admin/enquiries' },
];

interface EnquiriesProps {
    enquiries: PaginatedData<Enquiry>;
    filters: {
        search?: string | null;
        status?: string | null;
        type?: string | null;
    };
    statusCounts: {
        all: number;
        new: number;
        contacted: number;
        resolved: number;
        archived: number;
    };
}

export default function AdminEnquiriesIndex({
    enquiries,
    filters,
    statusCounts,
}: EnquiriesProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

    const updateForm = useForm({
        status: 'new',
        admin_notes: '',
    });

    const handleFilter = (customParams?: Record<string, any>) => {
        const queryParams = {
            search: search || undefined,
            status: status !== 'all' ? status : undefined,
            ...customParams,
        };

        router.get('/admin/enquiries', queryParams, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleOpenEnquiry = (enquiry: Enquiry) => {
        setSelectedEnquiry(enquiry);
        updateForm.setData({
            status: enquiry.status || 'new',
            admin_notes: enquiry.admin_notes || '',
        });
    };

    const handleUpdateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEnquiry) return;

        updateForm.put(`/admin/enquiries/${selectedEnquiry.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedEnquiry(null);
            },
        });
    };

    const handleDelete = (enquiry: Enquiry) => {
        if (confirm(`Delete inquiry from ${enquiry.name}?`)) {
            router.delete(`/admin/enquiries/${enquiry.id}`);
        }
    };

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'schedule_tour':
                return (
                    <Badge className="bg-brand-soft border-brand text-brand gap-1 text-[10px]">
                        <Calendar className="size-3" /> Tour Request
                    </Badge>
                );
            case 'make_offer':
                return (
                    <Badge className="bg-purple-500/10 border-purple-500 text-purple-700 dark:text-purple-300 gap-1 text-[10px]">
                        <DollarSign className="size-3" /> Offer Submitted
                    </Badge>
                );
            case 'property_inquiry':
                return (
                    <Badge className="bg-sky-500/10 border-sky-500 text-sky-700 dark:text-sky-300 gap-1 text-[10px]">
                        <HelpCircle className="size-3" /> Property Inquiry
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline" className="text-[10px]">
                        General Inquiry
                    </Badge>
                );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Inquiries | Admin Panel" />
            <FlashMessage />

            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Inquiries & Client Leads
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        Track tour requests, property offers, and direct client communications.
                    </p>
                </div>

                {/* Status Segment Tabs & Search */}
                <div className="bg-card border border-border rounded-md p-4 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Status Pills */}
                        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-muted rounded-md text-xs font-semibold">
                            {[
                                { label: 'All', value: 'all', count: statusCounts.all },
                                { label: 'New', value: 'new', count: statusCounts.new },
                                { label: 'Contacted', value: 'contacted', count: statusCounts.contacted },
                                { label: 'Resolved', value: 'resolved', count: statusCounts.resolved },
                                { label: 'Archived', value: 'archived', count: statusCounts.archived },
                            ].map((tab) => (
                                <button
                                    key={tab.value}
                                    type="button"
                                    onClick={() => {
                                        setStatus(tab.value);
                                        handleFilter({ status: tab.value !== 'all' ? tab.value : undefined });
                                    }}
                                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                                        status === tab.value
                                            ? 'bg-background text-foreground shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    <span>{tab.label}</span>
                                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-muted/80 font-mono">
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <div className="relative sm:w-72">
                            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search by name, email, phone..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                className="pl-9 h-9 rounded-md text-xs"
                            />
                        </div>
                    </div>
                </div>

                {/* Inquiries Table */}
                <div className="bg-card border border-border rounded-md overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-border bg-muted/50 text-muted-foreground font-semibold uppercase tracking-wider">
                                    <th className="py-3 px-4">Client Contact</th>
                                    <th className="py-3 px-4">Inquiry Type</th>
                                    <th className="py-3 px-4">Associated Property</th>
                                    <th className="py-3 px-4">Message Snippet</th>
                                    <th className="py-3 px-4">Date</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {enquiries.data.length > 0 ? (
                                    enquiries.data.map((enq) => (
                                        <tr key={enq.id} className="hover:bg-muted/30 transition-colors">
                                            {/* Client */}
                                            <td className="py-3 px-4">
                                                <div className="font-bold text-foreground text-sm">{enq.name}</div>
                                                <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                                    <Mail className="size-3 text-brand" />
                                                    <span>{enq.email}</span>
                                                </div>
                                                {enq.phone && (
                                                    <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                                        <Phone className="size-3 text-brand" />
                                                        <span>{enq.phone}</span>
                                                    </div>
                                                )}
                                            </td>

                                            {/* Type */}
                                            <td className="py-3 px-4">
                                                {getTypeBadge(enq.enquiry_type)}
                                                {enq.preferred_date && (
                                                    <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                                                        <Calendar className="size-3 text-brand" />
                                                        <span>Tour: {enq.preferred_date}</span>
                                                    </div>
                                                )}
                                            </td>

                                            {/* Property */}
                                            <td className="py-3 px-4">
                                                {enq.property ? (
                                                    <Link
                                                        href={`/properties/${enq.property.slug}`}
                                                        target="_blank"
                                                        className="font-medium text-foreground hover:text-brand transition-colors block max-w-xs truncate"
                                                    >
                                                        {enq.property.title}
                                                    </Link>
                                                ) : (
                                                    <span className="text-muted-foreground">General Consultation</span>
                                                )}
                                            </td>

                                            {/* Message */}
                                            <td className="py-3 px-4 max-w-xs">
                                                <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                                                    "{enq.message}"
                                                </p>
                                            </td>

                                            {/* Date */}
                                            <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                                                {new Date(enq.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </td>

                                            {/* Status */}
                                            <td className="py-3 px-4">
                                                <Badge
                                                    className={`text-[10px] uppercase font-bold ${
                                                        enq.status === 'new'
                                                            ? 'bg-amber-500 text-slate-950'
                                                            : enq.status === 'contacted'
                                                            ? 'bg-sky-600 text-white'
                                                            : enq.status === 'resolved'
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'bg-muted text-muted-foreground'
                                                    }`}
                                                >
                                                    {enq.status}
                                                </Badge>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleOpenEnquiry(enq)}
                                                        className="h-8 px-2.5 rounded-md text-xs gap-1.5"
                                                    >
                                                        <Eye className="size-3.5" />
                                                        <span>Details</span>
                                                    </Button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(enq)}
                                                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-500/10"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-muted-foreground">
                                            No inquiries found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {enquiries.links.length > 3 && (
                        <div className="p-4 border-t border-border flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                                Page {enquiries.current_page} of {enquiries.last_page} ({enquiries.total} total)
                            </span>
                            <div className="flex items-center gap-1">
                                {enquiries.links.map((link, i) => (
                                    link.url ? (
                                        <Link key={i} href={link.url} preserveScroll>
                                            <Button
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                className={`h-8 w-8 p-0 rounded-lg text-xs ${
                                                    link.active ? 'bg-primary text-primary-foreground font-bold' : ''
                                                }`}
                                            >
                                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                            </Button>
                                        </Link>
                                    ) : null
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Details & Notes Modal */}
                <Dialog open={selectedEnquiry !== null} onOpenChange={(open) => !open && setSelectedEnquiry(null)}>
                    <DialogContent className="rounded-md max-w-xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Inbox className="size-5 text-brand" />
                                <span>Inquiry Details & Management</span>
                            </DialogTitle>
                            <DialogDescription>
                                Review client inquiry and update follow-up progress.
                            </DialogDescription>
                        </DialogHeader>

                        {selectedEnquiry && (
                            <form onSubmit={handleUpdateSubmit} className="space-y-4 pt-2">
                                {/* Client Info Card */}
                                <div className="p-4 rounded-md bg-muted/50 border border-border space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-sm text-foreground">{selectedEnquiry.name}</h4>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(selectedEnquiry.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                                        <a href={`mailto:${selectedEnquiry.email}`} className="hover:text-foreground flex items-center gap-1.5">
                                            <Mail className="size-3.5 text-brand shrink-0" />
                                            <span className="truncate">{selectedEnquiry.email}</span>
                                        </a>
                                        {selectedEnquiry.phone && (
                                            <a href={`tel:${selectedEnquiry.phone}`} className="hover:text-foreground flex items-center gap-1.5">
                                                <Phone className="size-3.5 text-brand shrink-0" />
                                                <span>{selectedEnquiry.phone}</span>
                                            </a>
                                        )}
                                    </div>

                                    {selectedEnquiry.property && (
                                        <div className="pt-2 border-t border-border/60 text-xs flex items-center justify-between">
                                            <span className="text-muted-foreground">Property: <strong className="text-foreground">{selectedEnquiry.property.title}</strong></span>
                                            <Link href={`/properties/${selectedEnquiry.property.slug}`} target="_blank" className="text-brand hover:underline flex items-center gap-1">
                                                <ExternalLink className="size-3" />
                                                <span>View Listing</span>
                                            </Link>
                                        </div>
                                    )}

                                    {selectedEnquiry.preferred_date && (
                                        <div className="text-xs text-brand font-semibold flex items-center gap-1.5">
                                            <Calendar className="size-3.5" />
                                            <span>Requested Showing Date: {selectedEnquiry.preferred_date}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Message */}
                                <div className="space-y-1">
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Client Message
                                    </Label>
                                    <div className="p-3.5 rounded-md bg-background border border-border text-sm leading-relaxed whitespace-pre-line text-foreground">
                                        {selectedEnquiry.message}
                                    </div>
                                </div>

                                {/* Status Selector */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="enq-status">Inquiry Lifecycle Status</Label>
                                    <Select
                                        value={updateForm.data.status}
                                        onValueChange={(val) => updateForm.setData('status', val)}
                                    >
                                        <SelectTrigger className="rounded-md">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="new">New (Needs Response)</SelectItem>
                                            <SelectItem value="contacted">Contacted / Tour Scheduled</SelectItem>
                                            <SelectItem value="resolved">Resolved / Offer Closed</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Admin Internal Notes */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="admin_notes">Internal Brokerage Notes</Label>
                                    <textarea
                                        id="admin_notes"
                                        rows={3}
                                        placeholder="Record details of phone calls, scheduled showings, or client preferences..."
                                        value={updateForm.data.admin_notes}
                                        onChange={(e) => updateForm.setData('admin_notes', e.target.value)}
                                        className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-3 border-t border-border">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setSelectedEnquiry(null)}
                                        className="rounded-md"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={updateForm.processing}
                                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md shadow-md gap-2"
                                    >
                                        <Save className="size-4" />
                                        <span>{updateForm.processing ? 'Saving...' : 'Save Updates'}</span>
                                    </Button>
                                </div>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
