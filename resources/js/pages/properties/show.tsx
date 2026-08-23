import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    Bath,
    Bed,
    Car,
    Check,
    Heart,
    Mail,
    Maximize,
    Phone,
    Share2,
} from 'lucide-react';
import React, { useState } from 'react';
import EnquiryForm from '@/components/enquiry-form';
import PropertyCard, { formatPrice } from '@/components/property-card';
import { Button } from '@/components/ui/button';
import GuestLayout from '@/layouts/guest-layout';
import type { Auth, Property } from '@/types';

interface PropertyShowProps {
    property: Property;
    similarProperties: Property[];
    isSaved: boolean;
}

const FALLBACK_IMAGE =
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80';

export default function PropertyShow({
    property,
    similarProperties = [],
    isSaved = false,
}: PropertyShowProps) {
    const { auth } = usePage<{ auth?: Auth }>().props;
    const [saved, setSaved] = useState(isSaved);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [copied, setCopied] = useState(false);

    const images = property.images?.length ? property.images : [FALLBACK_IMAGE];

    const handleToggleSave = () => {
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

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: property.title,
                url: window.location.href,
            });

            return;
        }

        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    const specs = [
        { icon: Bed, value: property.bedrooms, label: 'Bedrooms' },
        { icon: Bath, value: property.bathrooms, label: 'Bathrooms' },
        {
            icon: Maximize,
            value: Number(property.area_sqft).toLocaleString(),
            label: 'Square feet',
        },
        { icon: Car, value: property.garages, label: 'Garage spaces' },
    ];

    const mapQuery =
        property.latitude && property.longitude
            ? `${property.latitude},${property.longitude}`
            : `${property.address}, ${property.city}, ${property.state ?? ''}`;

    return (
        <GuestLayout>
            <Head title={`${property.title} | Haven Estates`} />

            <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-10">
                <nav
                    aria-label="Breadcrumb"
                    className="text-sm text-muted-foreground"
                >
                    <ol className="flex flex-wrap items-center gap-2">
                        <li>
                            <Link href="/" className="hover:text-foreground">
                                Home
                            </Link>
                        </li>
                        <li aria-hidden>/</li>
                        <li>
                            <Link
                                href="/properties"
                                className="hover:text-foreground"
                            >
                                Listings
                            </Link>
                        </li>
                        {property.property_type && (
                            <>
                                <li aria-hidden>/</li>
                                <li>
                                    <Link
                                        href={`/properties?type=${property.property_type.slug}`}
                                        className="hover:text-foreground"
                                    >
                                        {property.property_type.name}
                                    </Link>
                                </li>
                            </>
                        )}
                        <li aria-hidden>/</li>
                        <li className="max-w-[16rem] truncate text-foreground">
                            {property.title}
                        </li>
                    </ol>
                </nav>
            </div>

            {/* Gallery leads, the way a property listing should */}
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
                <div className="overflow-hidden rounded-sm bg-muted">
                    <img
                        src={images[selectedImageIndex]}
                        alt={`${property.title}, view ${selectedImageIndex + 1}`}
                        fetchPriority="high"
                        className="aspect-[4/3] w-full object-cover sm:aspect-[16/9] lg:aspect-[21/9]"
                    />
                </div>

                {images.length > 1 && (
                    <ul className="mt-3 flex [scrollbar-width:thin] gap-3 overflow-x-auto pb-2">
                        {images.map((image, index) => (
                            <li key={image}>
                                <button
                                    type="button"
                                    onClick={() => setSelectedImageIndex(index)}
                                    aria-current={selectedImageIndex === index}
                                    aria-label={`View photo ${index + 1} of ${images.length}`}
                                    className={`block size-20 shrink-0 overflow-hidden rounded-sm transition-opacity sm:size-24 ${
                                        selectedImageIndex === index
                                            ? 'ring-2 ring-brand ring-offset-2 ring-offset-background'
                                            : 'opacity-60 hover:opacity-100'
                                    }`}
                                >
                                    <img
                                        src={image}
                                        alt=""
                                        loading="lazy"
                                        className="size-full object-cover"
                                    />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-7 xl:col-span-8">
                        <p className="flex flex-wrap items-center gap-2.5 text-[0.6875rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                            <span>
                                For{' '}
                                {property.price_type === 'sale'
                                    ? 'sale'
                                    : 'rent'}
                            </span>
                            {property.property_type && (
                                <>
                                    <span
                                        aria-hidden
                                        className="h-2.5 w-px bg-border"
                                    />
                                    <span>{property.property_type.name}</span>
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
                            <span
                                aria-hidden
                                className="h-2.5 w-px bg-border"
                            />
                            <span className="tabular-nums">
                                Ref {property.id.toString().padStart(5, '0')}
                            </span>
                        </p>

                        <h1 className="mt-4 font-serif text-4xl leading-tight font-semibold tracking-[-0.01em] text-foreground sm:text-5xl">
                            {property.title}
                        </h1>

                        <p className="mt-3 text-base text-muted-foreground">
                            {property.address}, {property.city}
                            {property.state ? `, ${property.state}` : ''}{' '}
                            {property.zip_code}
                        </p>

                        <dl className="mt-10 grid grid-cols-2 border-t border-border sm:grid-cols-4">
                            {specs.map(({ icon: Icon, value, label }) => (
                                <div
                                    key={label}
                                    className="border-b border-border py-6 pr-4 sm:border-b-0"
                                >
                                    <Icon
                                        className="size-5 text-brand"
                                        strokeWidth={1.5}
                                        aria-hidden
                                    />
                                    <dd className="mt-3 text-2xl font-semibold text-foreground tabular-nums">
                                        {value}
                                    </dd>
                                    <dt className="mt-1 text-sm text-muted-foreground">
                                        {label}
                                    </dt>
                                </div>
                            ))}
                        </dl>

                        {(property.year_built || property.status) && (
                            <p className="border-t border-border pt-6 text-sm text-muted-foreground">
                                {property.year_built && (
                                    <>
                                        Built{' '}
                                        <span className="text-foreground tabular-nums">
                                            {property.year_built}
                                        </span>
                                        {'. '}
                                    </>
                                )}
                                <span className="text-foreground capitalize">
                                    {property.status}
                                </span>
                            </p>
                        )}

                        <section className="mt-14">
                            <h2 className="font-serif text-3xl font-semibold text-foreground">
                                About this property
                            </h2>
                            <div className="mt-5 max-w-[65ch] text-base leading-relaxed whitespace-pre-line text-muted-foreground">
                                {property.description}
                            </div>
                        </section>

                        {property.amenities &&
                            property.amenities.length > 0 && (
                                <section className="mt-14">
                                    <h2 className="font-serif text-3xl font-semibold text-foreground">
                                        Features
                                    </h2>
                                    <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {property.amenities.map((amenity) => (
                                            <li
                                                key={amenity}
                                                className="flex items-start gap-2.5 text-sm text-foreground"
                                            >
                                                <Check
                                                    className="mt-0.5 size-4 shrink-0 text-brand"
                                                    strokeWidth={1.5}
                                                    aria-hidden
                                                />
                                                <span>{amenity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                        <section className="mt-14">
                            <h2 className="font-serif text-3xl font-semibold text-foreground">
                                Location
                            </h2>
                            <div className="mt-6 border-t border-border pt-6">
                                <p className="text-base text-foreground">
                                    {property.address}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {property.city}
                                    {property.state
                                        ? `, ${property.state}`
                                        : ''}{' '}
                                    {property.zip_code}, {property.country}
                                </p>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground"
                                >
                                    <span className="rule-link">
                                        Open in Google Maps
                                    </span>
                                    <ArrowUpRight
                                        className="size-4 text-brand"
                                        strokeWidth={1.5}
                                    />
                                </a>
                            </div>
                        </section>
                    </div>

                    {/* Price and inquiry rail */}
                    <div className="lg:col-span-5 xl:col-span-4">
                        <div className="sticky top-24 border border-border bg-card p-6 lg:p-7">
                            <p className="text-sm text-muted-foreground">
                                {property.price_type === 'sale'
                                    ? 'Asking price'
                                    : 'Rent'}
                            </p>
                            <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground tabular-nums">
                                {formatPrice(
                                    property.price,
                                    property.price_type,
                                    property.rent_period,
                                )}
                            </p>

                            <div className="mt-5 flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={handleToggleSave}
                                    aria-pressed={saved}
                                    className={`h-9 flex-1 gap-2 ${
                                        saved ? 'border-brand text-brand' : ''
                                    }`}
                                >
                                    <Heart
                                        className="size-4"
                                        strokeWidth={1.5}
                                        fill={saved ? 'currentColor' : 'none'}
                                    />
                                    {saved ? 'Saved' : 'Save'}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleShare}
                                    className="h-9 flex-1 gap-2"
                                >
                                    <Share2
                                        className="size-4"
                                        strokeWidth={1.5}
                                    />
                                    {copied ? 'Link copied' : 'Share'}
                                </Button>
                            </div>

                            <div className="mt-7 border-t border-border pt-7">
                                <h2 className="text-base font-medium text-foreground">
                                    Request a viewing
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Tell us when suits and the listing advisor
                                    will confirm.
                                </p>

                                <div className="mt-5">
                                    <EnquiryForm property={property} />
                                </div>
                            </div>

                            {property.user && (
                                <div className="mt-7 border-t border-border pt-7">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={
                                                property.user.avatar ??
                                                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
                                            }
                                            alt=""
                                            className="size-11 rounded-full object-cover"
                                        />
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-foreground">
                                                {property.user.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Listing advisor
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-2">
                                        {property.user.phone && (
                                            <a
                                                href={`tel:${property.user.phone}`}
                                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                                            >
                                                <Phone
                                                    className="size-4 shrink-0 text-brand"
                                                    strokeWidth={1.5}
                                                />
                                                {property.user.phone}
                                            </a>
                                        )}
                                        <a
                                            href={`mailto:${property.user.email}`}
                                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                                        >
                                            <Mail
                                                className="size-4 shrink-0 text-brand"
                                                strokeWidth={1.5}
                                            />
                                            <span className="truncate">
                                                {property.user.email}
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {similarProperties.length > 0 && (
                    <section className="mt-20 border-t border-border pt-16 lg:mt-28">
                        <h2 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl">
                            Others you may want to see
                        </h2>
                        <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                            {similarProperties.map((similar) => (
                                <PropertyCard
                                    key={similar.id}
                                    property={similar}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </GuestLayout>
    );
}
