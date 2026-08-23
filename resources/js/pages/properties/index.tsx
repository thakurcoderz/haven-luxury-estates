import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
    const heading =
        filters.price_type === 'sale'
            ? 'Homes for sale'
            : filters.price_type === 'rent'
              ? 'Homes for rent'
              : 'All listings';

    return (
        <GuestLayout>
            <Head title={`${heading} | Haven Estates`} />

            <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
                <header className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
                    <h1 className="font-serif text-4xl leading-tight font-semibold tracking-[-0.01em] text-foreground sm:text-5xl">
                        {heading}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        <span className="text-foreground tabular-nums">
                            {properties.total.toLocaleString()}
                        </span>{' '}
                        {properties.total === 1 ? 'property' : 'properties'}
                    </p>
                </header>

                <PropertyFilterBar
                    propertyTypes={propertyTypes}
                    cities={cities}
                    filters={filters}
                />

                {properties.data.length > 0 ? (
                    <>
                        <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                            {properties.data.map((property) => (
                                <PropertyCard
                                    key={property.id}
                                    property={property}
                                />
                            ))}
                        </div>

                        {properties.links.length > 3 && (
                            <nav
                                aria-label="Pagination"
                                className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-border pt-8 sm:flex-row"
                            >
                                <p className="text-sm text-muted-foreground tabular-nums">
                                    {properties.from ?? 0} to{' '}
                                    {properties.to ?? 0} of{' '}
                                    {properties.total.toLocaleString()}
                                </p>

                                <div className="flex items-center gap-1">
                                    {properties.links.map((link, index) => {
                                        const isPrevious =
                                            link.label.includes('Previous');
                                        const isNext =
                                            link.label.includes('Next');

                                        if (isPrevious || isNext) {
                                            const Icon = isPrevious
                                                ? ChevronLeft
                                                : ChevronRight;
                                            const label = isPrevious
                                                ? 'Previous'
                                                : 'Next';

                                            if (!link.url) {
                                                return (
                                                    <span
                                                        key={index}
                                                        aria-disabled
                                                        className="flex size-9 items-center justify-center text-muted-foreground/40"
                                                    >
                                                        <Icon
                                                            className="size-4"
                                                            strokeWidth={1.5}
                                                        />
                                                        <span className="sr-only">
                                                            {label}
                                                        </span>
                                                    </span>
                                                );
                                            }

                                            return (
                                                <Link
                                                    key={index}
                                                    href={link.url}
                                                    preserveScroll
                                                    aria-label={label}
                                                    className="flex size-9 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                                >
                                                    <Icon
                                                        className="size-4"
                                                        strokeWidth={1.5}
                                                    />
                                                </Link>
                                            );
                                        }

                                        if (!link.url) {
                                            return (
                                                <span
                                                    key={index}
                                                    className="px-2 text-sm text-muted-foreground"
                                                >
                                                    &hellip;
                                                </span>
                                            );
                                        }

                                        return (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                preserveScroll
                                                aria-current={
                                                    link.active
                                                        ? 'page'
                                                        : undefined
                                                }
                                                className={`flex size-9 items-center justify-center rounded-sm text-sm tabular-nums transition-colors ${
                                                    link.active
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                                }`}
                                            >
                                                {link.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </nav>
                        )}
                    </>
                ) : (
                    <div className="mx-auto mt-20 mb-16 max-w-md text-center">
                        <h2 className="font-serif text-3xl font-semibold text-foreground">
                            Nothing matches yet
                        </h2>
                        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                            No properties fit this combination of filters.
                            Widening the price range or clearing the market
                            usually brings results back.
                        </p>
                        <Button asChild className="mt-8 h-10 px-6">
                            <Link href="/properties">Clear all filters</Link>
                        </Button>
                    </div>
                )}
            </div>
        </GuestLayout>
    );
}
