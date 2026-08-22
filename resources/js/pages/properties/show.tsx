import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Bath,
    Bed,
    Building2,
    Calendar,
    Car,
    Check,
    ChevronLeft,
    Clock,
    Compass,
    Eye,
    Globe,
    Heart,
    Mail,
    MapPin,
    Maximize,
    Phone,
    Share2,
    Shield,
    Sparkles,
    User,
} from 'lucide-react';
import React, { useState } from 'react';
import EnquiryForm from '@/components/enquiry-form';
import PropertyCard from '@/components/property-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import GuestLayout from '@/layouts/guest-layout';
import type { Auth, Property } from '@/types';

interface PropertyShowProps {
    property: Property;
    similarProperties: Property[];
    isSaved: boolean;
}

export default function PropertyShow({
    property,
    similarProperties = [],
    isSaved = false,
}: PropertyShowProps) {
    const { auth } = usePage<{ auth?: Auth }>().props;
    const [saved, setSaved] = useState(isSaved);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [copied, setCopied] = useState(false);

    const images = property.images && property.images.length > 0
        ? property.images
        : [
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        ];

    const formatPrice = (price: number | string, priceType: string, rentPeriod?: string | null) => {
        const num = typeof price === 'string' ? parseFloat(price) : price;
        const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(num);

        if (priceType === 'rent') {
            return `${formatted} / ${rentPeriod || 'month'}`;
        }
        return formatted;
    };

    const handleToggleSave = () => {
        if (!auth?.user) {
            router.visit('/login');
            return;
        }

        setSaved(!saved);
        router.post(
            `/properties/${property.id}/save`,
            {},
            {
                preserveScroll: true,
                onError: () => setSaved(saved),
            }
        );
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: property.title,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        }
    };

    return (
        <GuestLayout>
            <Head title={`${property.title} | Haven Real Estate`} />

            {/* Breadcrumb Navigation */}
            <div className="bg-muted/40 border-b border-border py-4 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="hover:text-foreground">Home</Link>
                        <span>/</span>
                        <Link href="/properties" className="hover:text-foreground">Properties</Link>
                        <span>/</span>
                        {property.property_type && (
                            <>
                                <Link
                                    href={`/properties?type=${property.property_type.slug}`}
                                    className="hover:text-foreground"
                                >
                                    {property.property_type.name}
                                </Link>
                                <span>/</span>
                            </>
                        )}
                        <span className="text-foreground truncate max-w-[200px] sm:max-w-xs">{property.title}</span>
                    </div>

                    <Link href="/properties" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1">
                        <ChevronLeft className="size-3.5" />
                        Back to Listings
                    </Link>
                </div>
            </div>

            {/* Main Details Wrapper */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-12">
                {/* Header Information Bar */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-border">
                    <div className="space-y-3 max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge
                                className={`font-semibold uppercase text-xs ${
                                    property.price_type === 'sale'
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-sky-600 text-white'
                                }`}
                            >
                                For {property.price_type === 'sale' ? 'Sale' : 'Rent'}
                            </Badge>

                            {property.featured && (
                                <Badge className="bg-amber-500 text-slate-950 font-bold text-xs gap-1">
                                    <Sparkles className="size-3.5 fill-slate-950" />
                                    Featured Signature
                                </Badge>
                            )}

                            {property.property_type && (
                                <Badge variant="outline" className="text-xs">
                                    {property.property_type.name}
                                </Badge>
                            )}

                            <span className="text-xs text-muted-foreground ml-2">
                                ID: #{property.id.toString().padStart(5, '0')}
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                            {property.title}
                        </h1>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="size-4 text-emerald-600 shrink-0" />
                            <span>
                                {property.address}, {property.city}, {property.state} {property.zip_code}, {property.country}
                            </span>
                        </div>
                    </div>

                    {/* Price and Action Buttons */}
                    <div className="flex flex-col sm:flex-row lg:flex-col sm:items-center lg:items-end justify-between gap-4">
                        <div className="text-left lg:text-right">
                            <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                                Offering Price
                            </div>
                            <div className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight text-emerald-600 dark:text-emerald-400">
                                {formatPrice(property.price, property.price_type, property.rent_period)}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleToggleSave}
                                className={`rounded-xl border-border gap-2 ${
                                    saved ? 'border-rose-500 text-rose-600 bg-rose-500/10' : ''
                                }`}
                            >
                                <Heart className={`size-4 ${saved ? 'fill-rose-600' : ''}`} />
                                <span>{saved ? 'Saved' : 'Save Property'}</span>
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleShare}
                                className="rounded-xl border-border gap-2"
                            >
                                <Share2 className="size-4" />
                                <span>{copied ? 'Link Copied!' : 'Share'}</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Gallery Section */}
                <div className="space-y-4">
                    {/* Main Featured Image */}
                    <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden bg-muted border border-border shadow-md">
                        <img
                            src={images[selectedImageIndex]}
                            alt={property.title}
                            className="w-full h-full object-cover transition-all duration-300"
                        />
                        <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                            Photo {selectedImageIndex + 1} of {images.length}
                        </div>
                    </div>

                    {/* Thumbnails Row */}
                    {images.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                            {images.map((img, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`relative size-20 sm:size-24 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                                        selectedImageIndex === index
                                            ? 'border-emerald-500 ring-2 ring-emerald-500/30 scale-95'
                                            : 'border-border/80 opacity-70 hover:opacity-100'
                                    }`}
                                >
                                    <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Two Columns: Left Details & Right Sticky Inquiry Form */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Column: Details & Amenities (8 cols) */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Key Specs Card */}
                        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                                Property Specifications
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                        <Bed className="size-5" />
                                        <span className="font-bold text-lg text-foreground">{property.bedrooms}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-medium">Bedrooms</p>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                        <Bath className="size-5" />
                                        <span className="font-bold text-lg text-foreground">{property.bathrooms}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-medium">Bathrooms</p>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                        <Maximize className="size-5" />
                                        <span className="font-bold text-lg text-foreground">
                                            {Number(property.area_sqft).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-medium">Total Sq. Ft.</p>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                        <Car className="size-5" />
                                        <span className="font-bold text-lg text-foreground">{property.garages}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-medium">Garage Spaces</p>
                                </div>
                            </div>

                            {property.year_built && (
                                <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                                    <span>Year Built: <strong className="text-foreground">{property.year_built}</strong></span>
                                    <span>Status: <strong className="text-emerald-600 capitalize">{property.status}</strong></span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                                Overview & Architectural Highlights
                            </h2>
                            <div className="prose dark:prose-invert max-w-none text-muted-foreground text-sm sm:text-base leading-relaxed whitespace-pre-line">
                                {property.description}
                            </div>
                        </div>

                        {/* Amenities Checklist */}
                        {property.amenities && property.amenities.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                                    Luxury Amenities & Features
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {property.amenities.map((amenity, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 p-3.5 rounded-xl bg-card border border-border/70 text-sm font-medium text-foreground"
                                        >
                                            <div className="size-6 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                                <Check className="size-4" />
                                            </div>
                                            <span>{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Location / Area Map Card */}
                        <div className="space-y-4">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                                Location & Neighborhood
                            </h2>
                            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="font-bold text-foreground">{property.city}, {property.state}</h4>
                                        <p className="text-xs text-muted-foreground mt-0.5">{property.address}</p>
                                    </div>
                                    <Badge variant="outline" className="text-xs gap-1">
                                        <MapPin className="size-3 text-emerald-600" />
                                        {property.zip_code}
                                    </Badge>
                                </div>

                                {/* Mock Interactive Map Canvas */}
                                <div className="relative aspect-[16/7] rounded-xl overflow-hidden bg-slate-900 border border-border flex items-center justify-center text-center p-6">
                                    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
                                    <div className="relative z-10 space-y-2 max-w-sm">
                                        <div className="size-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/40 animate-bounce">
                                            <MapPin className="size-5" />
                                        </div>
                                        <p className="text-xs font-semibold text-white">
                                            {property.address}, {property.city}
                                        </p>
                                        <p className="text-[11px] text-slate-400">
                                            GPS: {property.latitude || '34.0736'}° N, {property.longitude || '-118.4004'}° W
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Inquiry & Tour Booking Box (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="sticky top-28 bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-foreground">
                                    Inquire or Book a Tour
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Schedule a private showing or request confidential transaction terms.
                                </p>
                            </div>

                            {/* Enquiry Form */}
                            <EnquiryForm property={property} />

                            {/* Listing Agent Contact Card */}
                            {property.user && (
                                <div className="pt-6 border-t border-border space-y-3">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={property.user.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'}
                                            alt={property.user.name}
                                            className="size-12 rounded-full object-cover border-2 border-emerald-500/40"
                                        />
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-sm text-foreground truncate">
                                                {property.user.name}
                                            </h4>
                                            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                                Listing Representative
                                            </p>
                                        </div>
                                    </div>

                                    {property.user.phone && (
                                        <a
                                            href={`tel:${property.user.phone}`}
                                            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors p-2 rounded-xl bg-muted/60"
                                        >
                                            <Phone className="size-3.5 text-emerald-600 shrink-0" />
                                            <span>{property.user.phone}</span>
                                        </a>
                                    )}

                                    <a
                                        href={`mailto:${property.user.email}`}
                                        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors p-2 rounded-xl bg-muted/60"
                                    >
                                        <Mail className="size-3.5 text-emerald-600 shrink-0" />
                                        <span className="truncate">{property.user.email}</span>
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Similar Properties Section */}
                {similarProperties.length > 0 && (
                    <div className="pt-12 border-t border-border space-y-8">
                        <div>
                            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                                <Compass className="size-3.5" />
                                <span>Curated Alternatives</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                                Similar Properties You May Like
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {similarProperties.map((prop) => (
                                <PropertyCard key={prop.id} property={prop} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </GuestLayout>
    );
}
