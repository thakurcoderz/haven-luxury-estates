import { Head, Link, router } from '@inertiajs/react';
import {
    Building2,
    Check,
    ChevronLeft,
    ChevronRight,
    Edit,
    ExternalLink,
    Filter,
    MapPin,
    Plus,
    Search,
    Sparkles,
    Trash2,
} from 'lucide-react';
import React, { useState } from 'react';
import FlashMessage from '@/components/flash-message';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PaginatedData, Property, PropertyType } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Properties', href: '/admin/properties' },
];

interface PropertiesIndexProps {
    properties: PaginatedData<Property>;
    propertyTypes: PropertyType[];
    filters: {
        search?: string | null;
        type?: string | null;
        status?: string | null;
        price_type?: string | null;
        featured?: string | null;
    };
}

export default function AdminPropertiesIndex({
    properties,
    propertyTypes = [],
    filters,
}: PropertiesIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [type, setType] = useState(filters.type || 'all');
    const [status, setStatus] = useState(filters.status || 'all');
    const [priceType, setPriceType] = useState(filters.price_type || 'all');

    const handleFilter = (customParams?: Record<string, any>) => {
        const queryParams = {
            search: search || undefined,
            type: type !== 'all' ? type : undefined,
            status: status !== 'all' ? status : undefined,
            price_type: priceType !== 'all' ? priceType : undefined,
            ...customParams,
        };

        router.get('/admin/properties', queryParams, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (property: Property) => {
        if (confirm(`Are you sure you want to delete "${property.title}"? This cannot be undone.`)) {
            router.delete(`/admin/properties/${property.id}`);
        }
    };

    const handleToggleFeatured = (property: Property) => {
        router.post(`/admin/properties/${property.id}/toggle-featured`, {}, { preserveScroll: true });
    };

    const formatPrice = (price: number | string, pType: string) => {
        const num = typeof price === 'string' ? parseFloat(price) : price;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(num);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Properties | Admin Panel" />
            <FlashMessage />

            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Property Listings Management
                        </h1>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                            Total {properties.total} real estate assets in your database.
                        </p>
                    </div>

                    <Link href="/admin/properties/create">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md gap-2">
                            <Plus className="size-4" />
                            <span>Add New Property</span>
                        </Button>
                    </Link>
                </div>

                {/* Filter Toolbar */}
                <div className="bg-card border border-border rounded-2xl p-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
                    {/* Search */}
                    <div className="lg:col-span-4 relative">
                        <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search by title, city, address..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                            className="pl-9 h-9 rounded-xl text-xs"
                        />
                    </div>

                    {/* Category */}
                    <div className="lg:col-span-3">
                        <Select
                            value={type}
                            onValueChange={(val) => {
                                setType(val);
                                handleFilter({ type: val !== 'all' ? val : undefined });
                            }}
                        >
                            <SelectTrigger className="h-9 rounded-xl text-xs">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {propertyTypes.map((pt) => (
                                    <SelectItem key={pt.slug} value={pt.slug}>
                                        {pt.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Status */}
                    <div className="lg:col-span-2">
                        <Select
                            value={status}
                            onValueChange={(val) => {
                                setStatus(val);
                                handleFilter({ status: val !== 'all' ? val : undefined });
                            }}
                        >
                            <SelectTrigger className="h-9 rounded-xl text-xs">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="available">Available</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="sold">Sold</SelectItem>
                                <SelectItem value="rented">Rented</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Price Type */}
                    <div className="lg:col-span-2">
                        <Select
                            value={priceType}
                            onValueChange={(val) => {
                                setPriceType(val);
                                handleFilter({ price_type: val !== 'all' ? val : undefined });
                            }}
                        >
                            <SelectTrigger className="h-9 rounded-xl text-xs">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Sale & Rent</SelectItem>
                                <SelectItem value="sale">For Sale</SelectItem>
                                <SelectItem value="rent">For Rent</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Filter Button */}
                    <div className="lg:col-span-1">
                        <Button
                            size="sm"
                            onClick={() => handleFilter()}
                            className="w-full h-9 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-xs"
                        >
                            Filter
                        </Button>
                    </div>
                </div>

                {/* Table View */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-border bg-muted/50 text-muted-foreground font-semibold uppercase tracking-wider">
                                    <th className="py-3 px-4">Property</th>
                                    <th className="py-3 px-4">Category</th>
                                    <th className="py-3 px-4">Price</th>
                                    <th className="py-3 px-4">Location</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4 text-center">Featured</th>
                                    <th className="py-3 px-4 text-center">Inquiries</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {properties.data.length > 0 ? (
                                    properties.data.map((prop) => (
                                        <tr key={prop.id} className="hover:bg-muted/30 transition-colors">
                                            {/* Title & Image */}
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-12 rounded-lg overflow-hidden bg-muted shrink-0">
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
                                                    <div className="min-w-0 max-w-xs">
                                                        <Link
                                                            href={`/properties/${prop.slug}`}
                                                            target="_blank"
                                                            className="font-bold text-foreground hover:text-emerald-600 transition-colors truncate block text-sm"
                                                        >
                                                            {prop.title}
                                                        </Link>
                                                        <span className="text-[11px] text-muted-foreground">
                                                            {prop.bedrooms} beds • {prop.bathrooms} baths • {prop.area_sqft} sqft
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Category */}
                                            <td className="py-3 px-4">
                                                <Badge variant="outline" className="text-[11px]">
                                                    {prop.property_type?.name || 'Standard'}
                                                </Badge>
                                            </td>

                                            {/* Price */}
                                            <td className="py-3 px-4">
                                                <span className="font-bold text-foreground">
                                                    {formatPrice(prop.price, prop.price_type)}
                                                </span>
                                                <span className="block text-[10px] text-muted-foreground uppercase">
                                                    For {prop.price_type}
                                                </span>
                                            </td>

                                            {/* Location */}
                                            <td className="py-3 px-4 text-muted-foreground">
                                                <span className="font-medium text-foreground block">{prop.city}</span>
                                                <span className="text-[11px] truncate block max-w-[150px]">{prop.address}</span>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="py-3 px-4">
                                                <Badge
                                                    className={`text-[10px] uppercase font-bold ${
                                                        prop.status === 'available'
                                                            ? 'bg-emerald-600 text-white'
                                                            : prop.status === 'pending'
                                                            ? 'bg-amber-500 text-slate-950'
                                                            : 'bg-muted text-muted-foreground'
                                                    }`}
                                                >
                                                    {prop.status}
                                                </Badge>
                                            </td>

                                            {/* Featured Switch */}
                                            <td className="py-3 px-4 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleFeatured(prop)}
                                                    className={`p-1.5 rounded-lg transition-colors ${
                                                        prop.featured
                                                            ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20'
                                                            : 'text-muted-foreground/40 hover:text-muted-foreground'
                                                    }`}
                                                    title={prop.featured ? 'Featured on home' : 'Click to feature'}
                                                >
                                                    <Sparkles className={`size-4 ${prop.featured ? 'fill-amber-500' : ''}`} />
                                                </button>
                                            </td>

                                            {/* Inquiries count */}
                                            <td className="py-3 px-4 text-center">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted font-bold text-xs">
                                                    {prop.enquiries_count || 0}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link
                                                        href={`/properties/${prop.slug}`}
                                                        target="_blank"
                                                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                                                        title="View on site"
                                                    >
                                                        <ExternalLink className="size-3.5" />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/properties/${prop.id}/edit`}
                                                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-500/10"
                                                        title="Edit property"
                                                    >
                                                        <Edit className="size-3.5" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(prop)}
                                                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-500/10"
                                                        title="Delete property"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-muted-foreground">
                                            No properties found matching the filter criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {properties.links.length > 3 && (
                        <div className="p-4 border-t border-border flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                                Page {properties.current_page} of {properties.last_page} ({properties.total} total)
                            </span>
                            <div className="flex items-center gap-1">
                                {properties.links.map((link, i) => (
                                    link.url ? (
                                        <Link key={i} href={link.url} preserveScroll>
                                            <Button
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                className={`h-8 w-8 p-0 rounded-lg text-xs ${
                                                    link.active ? 'bg-emerald-600 text-white font-bold' : ''
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
            </div>
        </AppLayout>
    );
}
