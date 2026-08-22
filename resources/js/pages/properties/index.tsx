import { Head, Link } from '@inertiajs/react';
import {
    Building2,
    ChevronLeft,
    ChevronRight,
    Compass,
    Home,
    MapPin,
    SearchX,
    SlidersHorizontal,
    Sparkles,
} from 'lucide-react';
import React from 'react';
import PropertyCard from '@/components/property-card';
import PropertyFilterBar from '@/components/property-filter-bar';
import { Button } from '@/components/ui/button';
import GuestLayout from '@/layouts/guest-layout';
import type { PaginatedData, Property, PropertyType } from '@/types';

interface PropertiesIndexProps {
    properties: PaginatedData<Property>;
    propertyTypes: PropertyType[];
    cities: string[];
    filters: {
        search?: string | null;
        type?: string | null;
        price_type?: string | null;
        min_price?: string | null;
        max_price?: string | null;
        bedrooms?: string | null;
        bathrooms?: string | null;
        city?: string | null;
        sort?: string | null;
    };
}

export default function PropertiesIndex({
    properties,
    propertyTypes = [],
    cities = [],
    filters,
}: PropertiesIndexProps) {
    return (
        <GuestLayout>
            <Head title="Explore Real Estate Listings | Haven Real Estate" />

            {/* Page Header */}
            <div className="bg-muted/40 border-b border-border py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        <Compass className="size-3.5" />
                        <span>Property Catalog</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                        {filters.price_type === 'sale'
                            ? 'Properties For Sale'
                            : filters.price_type === 'rent'
                            ? 'Properties For Rent'
                            : 'All Real Estate Listings'}
                    </h1>
                    <p className="text-sm text-muted-foreground max-w-2xl">
                        Showing {properties.total} verified {properties.total === 1 ? 'residence' : 'residences'} matching your criteria in prime neighborhoods.
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Search & Filter Bar */}
                <PropertyFilterBar
                    propertyTypes={propertyTypes}
                    cities={cities}
                    filters={filters}
                />

                {/* Property Grid or Empty State */}
                {properties.data.length > 0 ? (
                    <div className="space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {properties.data.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {properties.links.length > 3 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
                                <p className="text-xs text-muted-foreground">
                                    Showing <span className="font-semibold text-foreground">{properties.from || 0}</span> to{' '}
                                    <span className="font-semibold text-foreground">{properties.to || 0}</span> of{' '}
                                    <span className="font-semibold text-foreground">{properties.total}</span> listings
                                </p>

                                <div className="flex items-center gap-1.5">
                                    {properties.links.map((link, i) => {
                                        if (link.label.includes('Previous')) {
                                            return link.url ? (
                                                <Link key={i} href={link.url} preserveScroll>
                                                    <Button variant="outline" size="sm" className="h-9 px-3 gap-1 rounded-xl">
                                                        <ChevronLeft className="size-4" />
                                                        <span className="hidden sm:inline">Prev</span>
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Button key={i} variant="outline" size="sm" disabled className="h-9 px-3 gap-1 rounded-xl opacity-50">
                                                    <ChevronLeft className="size-4" />
                                                    <span className="hidden sm:inline">Prev</span>
                                                </Button>
                                            );
                                        }

                                        if (link.label.includes('Next')) {
                                            return link.url ? (
                                                <Link key={i} href={link.url} preserveScroll>
                                                    <Button variant="outline" size="sm" className="h-9 px-3 gap-1 rounded-xl">
                                                        <span className="hidden sm:inline">Next</span>
                                                        <ChevronRight className="size-4" />
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Button key={i} variant="outline" size="sm" disabled className="h-9 px-3 gap-1 rounded-xl opacity-50">
                                                    <span className="hidden sm:inline">Next</span>
                                                    <ChevronRight className="size-4" />
                                                </Button>
                                            );
                                        }

                                        return link.url ? (
                                            <Link key={i} href={link.url} preserveScroll>
                                                <Button
                                                    variant={link.active ? 'default' : 'outline'}
                                                    size="sm"
                                                    className={`h-9 w-9 p-0 rounded-xl ${
                                                        link.active
                                                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold'
                                                            : ''
                                                    }`}
                                                >
                                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                </Button>
                                            </Link>
                                        ) : (
                                            <span
                                                key={i}
                                                className="px-2 text-xs text-muted-foreground"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-20 px-4 bg-card border border-dashed border-border rounded-3xl space-y-4 max-w-md mx-auto">
                        <div className="size-16 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                            <SearchX className="size-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">No Listings Found</h3>
                        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                            We couldn't find any properties matching your current filter criteria. Try adjusting the price range, location, or bedrooms.
                        </p>
                        <Link href="/properties">
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold">
                                Clear All Filters
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </GuestLayout>
    );
}
