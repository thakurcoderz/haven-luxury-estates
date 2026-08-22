import { Link, router, usePage } from '@inertiajs/react';
import {
    Bath,
    Bed,
    Building2,
    Car,
    Heart,
    MapPin,
    Maximize,
    Sparkles,
} from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import type { Auth, Property } from '@/types';

interface PropertyCardProps {
    property: Property;
    isSaved?: boolean;
}

export default function PropertyCard({ property, isSaved = false }: PropertyCardProps) {
    const { auth } = usePage<{ auth?: Auth }>().props;
    const [saved, setSaved] = useState(isSaved);
    const [isHovered, setIsHovered] = useState(false);

    const formatPrice = (price: number | string, priceType: string, rentPeriod?: string | null) => {
        const num = typeof price === 'string' ? parseFloat(price) : price;
        const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(num);

        if (priceType === 'rent') {
            return `${formatted} / ${rentPeriod || 'mo'}`;
        }
        return formatted;
    };

    const handleToggleSave = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

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

    const imageUrl =
        property.images && property.images.length > 0
            ? property.images[0]
            : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';

    return (
        <div
            className="group relative bg-card border border-border/70 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <img
                    src={imageUrl}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                />

                {/* Gradient overlay for badges/price */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

                {/* Top Badges */}
                <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-1.5 z-10">
                    <Badge
                        className={`font-semibold tracking-wide uppercase text-[11px] shadow-sm ${
                            property.price_type === 'sale'
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-sky-600 hover:bg-sky-700 text-white'
                        }`}
                    >
                        For {property.price_type === 'sale' ? 'Sale' : 'Rent'}
                    </Badge>

                    {property.featured && (
                        <Badge className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] gap-1 shadow-sm">
                            <Sparkles className="size-3 fill-slate-950" />
                            Featured
                        </Badge>
                    )}

                    {property.property_type && (
                        <Badge variant="secondary" className="bg-black/60 backdrop-blur-md text-white border-white/20 text-[11px]">
                            {property.property_type.name}
                        </Badge>
                    )}
                </div>

                {/* Favorite Bookmark Button */}
                <button
                    type="button"
                    onClick={handleToggleSave}
                    className={`absolute top-3.5 right-3.5 size-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 z-10 shadow-md ${
                        saved
                            ? 'bg-rose-500 text-white shadow-rose-500/40'
                            : 'bg-black/40 text-white hover:bg-black/70 hover:scale-110'
                    }`}
                    title={saved ? 'Remove from saved' : 'Save property'}
                    aria-label="Save Property"
                >
                    <Heart className={`size-4 ${saved ? 'fill-white' : ''}`} />
                </button>

                {/* Price Tag Overlay */}
                <div className="absolute bottom-3.5 left-3.5 z-10 text-white">
                    <div className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-md">
                        {formatPrice(property.price, property.price_type, property.rent_period)}
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                        <MapPin className="size-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{property.address}, {property.city}, {property.state} {property.zip_code}</span>
                    </div>

                    {/* Title */}
                    <Link href={`/properties/${property.slug}`}>
                        <h3 className="font-bold text-base sm:text-lg text-foreground group-hover:text-emerald-600 transition-colors line-clamp-1">
                            {property.title}
                        </h3>
                    </Link>

                    {/* Short Description */}
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed">
                        {property.description}
                    </p>
                </div>

                {/* Key Specs Bar */}
                <div className="pt-3 border-t border-border/60 grid grid-cols-3 gap-2 text-xs text-muted-foreground font-medium">
                    <div className="flex items-center gap-1.5">
                        <Bed className="size-4 text-emerald-600 shrink-0" />
                        <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Bath className="size-4 text-emerald-600 shrink-0" />
                        <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Maximize className="size-4 text-emerald-600 shrink-0" />
                        <span>{Number(property.area_sqft).toLocaleString()} sqft</span>
                    </div>
                </div>

                {/* Footer with Agent info & View Details button */}
                <div className="pt-3 border-t border-border/40 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                        {property.user?.avatar ? (
                            <img
                                src={property.user.avatar}
                                alt={property.user.name}
                                className="size-6 rounded-full object-cover border border-border shrink-0"
                            />
                        ) : (
                            <div className="size-6 rounded-full bg-emerald-600/10 text-emerald-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                                {property.user?.name ? property.user.name.charAt(0) : 'A'}
                            </div>
                        )}
                        <span className="text-xs text-muted-foreground truncate font-medium">
                            {property.user?.name || 'Haven Agent'}
                        </span>
                    </div>

                    <Link
                        href={`/properties/${property.slug}`}
                        className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 shrink-0"
                    >
                        View Details →
                    </Link>
                </div>
            </div>
        </div>
    );
}
