import { router } from '@inertiajs/react';
import {
    ArrowUpDown,
    Bed,
    Building2,
    DollarSign,
    Filter,
    MapPin,
    RotateCcw,
    Search,
    SlidersHorizontal,
} from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { PropertyType } from '@/types';

interface PropertyFilterBarProps {
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
    onFilterChange?: () => void;
}

export default function PropertyFilterBar({
    propertyTypes,
    cities,
    filters,
}: PropertyFilterBarProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [type, setType] = useState(filters.type || 'all');
    const [priceType, setPriceType] = useState(filters.price_type || 'all');
    const [minPrice, setMinPrice] = useState(filters.min_price || '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price || '');
    const [bedrooms, setBedrooms] = useState(filters.bedrooms || 'all');
    const [bathrooms, setBathrooms] = useState(filters.bathrooms || 'all');
    const [city, setCity] = useState(filters.city || 'all');
    const [sort, setSort] = useState(filters.sort || 'newest');
    const [expanded, setExpanded] = useState(false);

    const applyFilters = (customParams?: Record<string, any>) => {
        const queryParams: Record<string, any> = {
            search: search || undefined,
            type: type !== 'all' ? type : undefined,
            price_type: priceType !== 'all' ? priceType : undefined,
            min_price: minPrice || undefined,
            max_price: maxPrice || undefined,
            bedrooms: bedrooms !== 'all' ? bedrooms : undefined,
            bathrooms: bathrooms !== 'all' ? bathrooms : undefined,
            city: city !== 'all' ? city : undefined,
            sort: sort !== 'newest' ? sort : undefined,
            ...customParams,
        };

        // Filter out undefined/empty keys
        const cleanedParams: Record<string, any> = {};
        Object.keys(queryParams).forEach((key) => {
            if (queryParams[key] !== undefined && queryParams[key] !== '') {
                cleanedParams[key] = queryParams[key];
            }
        });

        router.get('/properties', cleanedParams, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const handleReset = () => {
        setSearch('');
        setType('all');
        setPriceType('all');
        setMinPrice('');
        setMaxPrice('');
        setBedrooms('all');
        setBathrooms('all');
        setCity('all');
        setSort('newest');
        router.get('/properties', {}, { preserveScroll: true });
    };

    const activeFilterCount = [
        type !== 'all',
        priceType !== 'all',
        minPrice !== '',
        maxPrice !== '',
        bedrooms !== 'all',
        bathrooms !== 'all',
        city !== 'all',
    ].filter(Boolean).length;

    return (
        <div className="bg-card border border-border/80 rounded-2xl p-4 sm:p-6 shadow-sm mb-8">
            <form onSubmit={handleSearchSubmit} className="space-y-4">
                {/* Top Row: Search & Buy/Rent & Quick Submit */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    {/* Buy / Rent / All Segmented Control */}
                    <div className="md:col-span-3 flex p-1 bg-muted rounded-xl text-xs font-semibold">
                        <button
                            type="button"
                            onClick={() => {
                                setPriceType('all');
                                applyFilters({ price_type: undefined });
                            }}
                            className={`flex-1 py-2 rounded-lg transition-all ${
                                priceType === 'all'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            All
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setPriceType('sale');
                                applyFilters({ price_type: 'sale' });
                            }}
                            className={`flex-1 py-2 rounded-lg transition-all ${
                                priceType === 'sale'
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            For Sale
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setPriceType('rent');
                                applyFilters({ price_type: 'rent' });
                            }}
                            className={`flex-1 py-2 rounded-lg transition-all ${
                                priceType === 'rent'
                                    ? 'bg-sky-600 text-white shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            For Rent
                        </button>
                    </div>

                    {/* Search Input */}
                    <div className="md:col-span-5 relative">
                        <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search by neighborhood, title, city, zip code..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 h-10 rounded-xl"
                        />
                    </div>

                    {/* Property Type Dropdown */}
                    <div className="md:col-span-2">
                        <Select
                            value={type}
                            onValueChange={(val) => {
                                setType(val);
                                applyFilters({ type: val !== 'all' ? val : undefined });
                            }}
                        >
                            <SelectTrigger className="h-10 rounded-xl">
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

                    {/* Action Buttons */}
                    <div className="md:col-span-2 flex items-center gap-2">
                        <Button
                            type="submit"
                            className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm"
                        >
                            Search
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setExpanded(!expanded)}
                            className={`h-10 px-3 rounded-xl border-border ${
                                expanded || activeFilterCount > 0
                                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                                    : ''
                            }`}
                            title="More Filters"
                        >
                            <SlidersHorizontal className="size-4" />
                            {activeFilterCount > 0 && (
                                <span className="ml-1.5 size-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                                    {activeFilterCount}
                                </span>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Expanded Advanced Filter Drawer */}
                {expanded && (
                    <div className="pt-4 mt-4 border-t border-border/70 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* City Filter */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                                <MapPin className="size-3.5 text-emerald-600" /> City
                            </label>
                            <Select
                                value={city}
                                onValueChange={(val) => {
                                    setCity(val);
                                    applyFilters({ city: val !== 'all' ? val : undefined });
                                }}
                            >
                                <SelectTrigger className="h-9 rounded-lg text-xs">
                                    <SelectValue placeholder="All Cities" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Cities</SelectItem>
                                    {cities.map((c) => (
                                        <SelectItem key={c} value={c}>
                                            {c}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Bedrooms */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                                <Bed className="size-3.5 text-emerald-600" /> Bedrooms
                            </label>
                            <Select
                                value={bedrooms}
                                onValueChange={(val) => {
                                    setBedrooms(val);
                                    applyFilters({ bedrooms: val !== 'all' ? val : undefined });
                                }}
                            >
                                <SelectTrigger className="h-9 rounded-lg text-xs">
                                    <SelectValue placeholder="Any Beds" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Any Bedrooms</SelectItem>
                                    <SelectItem value="1">1+ Bedrooms</SelectItem>
                                    <SelectItem value="2">2+ Bedrooms</SelectItem>
                                    <SelectItem value="3">3+ Bedrooms</SelectItem>
                                    <SelectItem value="4">4+ Bedrooms</SelectItem>
                                    <SelectItem value="5">5+ Bedrooms</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Price Range: Min */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                                <DollarSign className="size-3.5 text-emerald-600" /> Min Price
                            </label>
                            <Input
                                type="number"
                                placeholder="e.g. 500000"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="h-9 rounded-lg text-xs"
                            />
                        </div>

                        {/* Price Range: Max */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                                <DollarSign className="size-3.5 text-emerald-600" /> Max Price
                            </label>
                            <Input
                                type="number"
                                placeholder="e.g. 5000000"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="h-9 rounded-lg text-xs"
                            />
                        </div>

                        {/* Sort Order */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                                <ArrowUpDown className="size-3.5 text-emerald-600" /> Sort By
                            </label>
                            <Select
                                value={sort}
                                onValueChange={(val) => {
                                    setSort(val);
                                    applyFilters({ sort: val });
                                }}
                            >
                                <SelectTrigger className="h-9 rounded-lg text-xs">
                                    <SelectValue placeholder="Sort" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Newest First</SelectItem>
                                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                                    <SelectItem value="area_desc">Largest Area</SelectItem>
                                    <SelectItem value="oldest">Oldest First</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Reset Row */}
                        <div className="sm:col-span-2 lg:col-span-5 flex justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleReset}
                                className="text-xs text-muted-foreground hover:text-foreground gap-1.5"
                            >
                                <RotateCcw className="size-3.5" />
                                Reset All Filters
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                onClick={() => applyFilters()}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 rounded-lg"
                            >
                                Apply Filters
                            </Button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
