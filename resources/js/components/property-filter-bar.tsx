import { router } from '@inertiajs/react';
import { Search, SlidersHorizontal } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

const PRICE_TYPES = [
    { value: 'all', label: 'Everything' },
    { value: 'sale', label: 'Buy' },
    { value: 'rent', label: 'Rent' },
];

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

    const applyFilters = (
        customParams?: Record<string, string | undefined>,
    ) => {
        const queryParams: Record<string, string | undefined> = {
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

        const cleanedParams: Record<string, string> = {};
        Object.entries(queryParams).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                cleanedParams[key] = value;
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
        <form
            onSubmit={handleSearchSubmit}
            className="border-b border-border pb-6"
        >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="flex gap-1 rounded-sm border border-border p-1">
                    {PRICE_TYPES.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                setPriceType(option.value);
                                applyFilters({
                                    price_type:
                                        option.value !== 'all'
                                            ? option.value
                                            : undefined,
                                });
                            }}
                            aria-pressed={priceType === option.value}
                            className={`rounded-sm px-4 py-1.5 text-sm transition-colors ${
                                priceType === option.value
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                <div className="relative flex-1">
                    <Label htmlFor="listing-search" className="sr-only">
                        Search listings
                    </Label>
                    <Search
                        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                        strokeWidth={1.5}
                    />
                    <Input
                        id="listing-search"
                        type="search"
                        placeholder="Search by city, neighborhood, zip code, or listing name"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-10 pl-9"
                    />
                </div>

                <div className="lg:w-52">
                    <Label htmlFor="listing-type" className="sr-only">
                        Property type
                    </Label>
                    <Select
                        value={type}
                        onValueChange={(value) => {
                            setType(value);
                            applyFilters({
                                type: value !== 'all' ? value : undefined,
                            });
                        }}
                    >
                        <SelectTrigger
                            id="listing-type"
                            className="h-10 w-full"
                        >
                            <SelectValue placeholder="Any type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Any type</SelectItem>
                            {propertyTypes.map((propertyType) => (
                                <SelectItem
                                    key={propertyType.slug}
                                    value={propertyType.slug}
                                >
                                    {propertyType.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-2">
                    <Button
                        type="submit"
                        className="h-10 flex-1 px-6 lg:flex-none"
                    >
                        Search
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setExpanded(!expanded)}
                        aria-expanded={expanded}
                        className={`h-10 gap-2 px-3 ${
                            activeFilterCount > 0
                                ? 'border-brand text-brand'
                                : ''
                        }`}
                    >
                        <SlidersHorizontal
                            className="size-4"
                            strokeWidth={1.5}
                        />
                        <span>Filters</span>
                        {activeFilterCount > 0 && (
                            <span className="tabular-nums">
                                ({activeFilterCount})
                            </span>
                        )}
                    </Button>
                </div>
            </div>

            {expanded && (
                <div className="mt-6 grid animate-in gap-4 border-t border-border pt-6 duration-200 fade-in slide-in-from-top-1 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="filter-city">Market</Label>
                        <Select
                            value={city}
                            onValueChange={(value) => {
                                setCity(value);
                                applyFilters({
                                    city: value !== 'all' ? value : undefined,
                                });
                            }}
                        >
                            <SelectTrigger
                                id="filter-city"
                                className="h-9 w-full"
                            >
                                <SelectValue placeholder="All markets" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All markets</SelectItem>
                                {cities.map((entry) => (
                                    <SelectItem key={entry} value={entry}>
                                        {entry}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="filter-bedrooms">Bedrooms</Label>
                        <Select
                            value={bedrooms}
                            onValueChange={(value) => {
                                setBedrooms(value);
                                applyFilters({
                                    bedrooms:
                                        value !== 'all' ? value : undefined,
                                });
                            }}
                        >
                            <SelectTrigger
                                id="filter-bedrooms"
                                className="h-9 w-full"
                            >
                                <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Any</SelectItem>
                                {[1, 2, 3, 4, 5].map((count) => (
                                    <SelectItem
                                        key={count}
                                        value={String(count)}
                                    >
                                        {count} or more
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="filter-min-price">Min price</Label>
                        <Input
                            id="filter-min-price"
                            type="number"
                            inputMode="numeric"
                            placeholder="500000"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="h-9"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="filter-max-price">Max price</Label>
                        <Input
                            id="filter-max-price"
                            type="number"
                            inputMode="numeric"
                            placeholder="5000000"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="h-9"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="filter-sort">Sort by</Label>
                        <Select
                            value={sort}
                            onValueChange={(value) => {
                                setSort(value);
                                applyFilters({ sort: value });
                            }}
                        >
                            <SelectTrigger
                                id="filter-sort"
                                className="h-9 w-full"
                            >
                                <SelectValue placeholder="Newest" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">
                                    Newest first
                                </SelectItem>
                                <SelectItem value="price_asc">
                                    Price, low to high
                                </SelectItem>
                                <SelectItem value="price_desc">
                                    Price, high to low
                                </SelectItem>
                                <SelectItem value="area_desc">
                                    Largest first
                                </SelectItem>
                                <SelectItem value="oldest">
                                    Oldest first
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center justify-end gap-4 sm:col-span-2 lg:col-span-5">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                        >
                            Reset filters
                        </button>
                        <Button
                            type="button"
                            onClick={() => applyFilters()}
                            className="h-9 px-5"
                        >
                            Apply
                        </Button>
                    </div>
                </div>
            )}
        </form>
    );
}
