import { Link, router, usePage } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import React, { useState } from 'react';
import type { Auth, Property } from '@/types';

interface PropertyCardProps {
    property: Property;
    isSaved?: boolean;
    /** Renders a taller frame for the lead slot of an editorial grid. */
    feature?: boolean;
}

const FALLBACK_IMAGE =
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';

export function formatPrice(
    price: number | string,
    priceType: string,
    rentPeriod?: string | null,
): string {
    const num = typeof price === 'string' ? parseFloat(price) : price;
    const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(num);

    return priceType === 'rent'
        ? `${formatted} / ${rentPeriod === 'yearly' ? 'yr' : rentPeriod === 'weekly' ? 'wk' : 'mo'}`
        : formatted;
}

export default function PropertyCard({
    property,
    isSaved = false,
    feature = false,
}: PropertyCardProps) {
    const { auth } = usePage<{ auth?: Auth }>().props;
    const [saved, setSaved] = useState(isSaved);

    const handleToggleSave = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!auth?.user) {
            router.visit('/login');

            return;
        }

        const previous = saved;
        setSaved(!previous);
        router.post(
            `/properties/${property.id}/save`,
            {},
            {
                preserveScroll: true,
                onError: () => setSaved(previous),
            },
        );
    };

    const imageUrl = property.images?.[0] ?? FALLBACK_IMAGE;
    const href = `/properties/${property.slug}`;

    return (
        <article
            className={`group relative flex flex-col ${feature ? 'h-full' : ''}`}
        >
            {/*
             * The feature card sits in a taller grid cell, so its photograph
             * absorbs the leftover height instead of leaving a gap under the
             * text. Regular cards stay on a fixed ratio so a row lines up.
             */}
            <div
                className={`overflow-hidden rounded-sm bg-muted ${
                    feature ? 'min-h-80 flex-1' : ''
                }`}
            >
                <img
                    src={imageUrl}
                    alt=""
                    loading="lazy"
                    className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] ${
                        feature ? 'size-full' : 'aspect-[4/3] w-full'
                    }`}
                />
            </div>

            <button
                type="button"
                onClick={handleToggleSave}
                aria-pressed={saved}
                className={`absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-sm backdrop-blur-sm transition-colors ${
                    saved
                        ? 'bg-brand text-brand-foreground'
                        : 'bg-background/80 text-foreground hover:bg-background'
                }`}
                title={saved ? 'Remove from saved' : 'Save property'}
            >
                <Heart
                    className="size-4"
                    strokeWidth={1.5}
                    fill={saved ? 'currentColor' : 'none'}
                />
                <span className="sr-only">
                    {saved ? 'Remove from saved' : 'Save property'}
                </span>
            </button>

            <div className="mt-4 flex flex-col">
                <p className="flex items-center gap-2.5 text-[0.6875rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                    <span>
                        For {property.price_type === 'sale' ? 'sale' : 'rent'}
                    </span>
                    {property.property_type && (
                        <>
                            <span
                                aria-hidden
                                className="h-2.5 w-px bg-border"
                            />
                            <span className="truncate">
                                {property.property_type.name}
                            </span>
                        </>
                    )}
                    {property.featured && (
                        <>
                            <span
                                aria-hidden
                                className="h-2.5 w-px bg-border"
                            />
                            <span className="text-brand">Featured</span>
                        </>
                    )}
                </p>

                <h3
                    className={`mt-2 font-medium text-foreground ${
                        feature ? 'text-xl' : 'text-base'
                    }`}
                >
                    <Link href={href} className="after:absolute after:inset-0">
                        <span className="line-clamp-1">{property.title}</span>
                    </Link>
                </h3>

                <p className="mt-1 truncate text-sm text-muted-foreground">
                    {property.address}, {property.city}
                    {property.state ? `, ${property.state}` : ''}
                </p>

                <p
                    className={`mt-3 font-semibold tracking-tight text-foreground tabular-nums ${
                        feature ? 'text-2xl' : 'text-lg'
                    }`}
                >
                    {formatPrice(
                        property.price,
                        property.price_type,
                        property.rent_period,
                    )}
                </p>

                <dl className="mt-3 flex items-center gap-3 border-t border-border pt-3 text-sm text-muted-foreground">
                    <div className="flex gap-1.5">
                        <dt className="sr-only">Bedrooms</dt>
                        <dd className="text-foreground tabular-nums">
                            {property.bedrooms}
                        </dd>
                        <dd>bd</dd>
                    </div>
                    <span aria-hidden className="h-3 w-px bg-border" />
                    <div className="flex gap-1.5">
                        <dt className="sr-only">Bathrooms</dt>
                        <dd className="text-foreground tabular-nums">
                            {property.bathrooms}
                        </dd>
                        <dd>ba</dd>
                    </div>
                    <span aria-hidden className="h-3 w-px bg-border" />
                    <div className="flex gap-1.5">
                        <dt className="sr-only">Interior area</dt>
                        <dd className="text-foreground tabular-nums">
                            {Number(property.area_sqft).toLocaleString()}
                        </dd>
                        <dd>sqft</dd>
                    </div>
                </dl>
            </div>
        </article>
    );
}
