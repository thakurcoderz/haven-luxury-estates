import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, Search } from 'lucide-react';
import React, { useState } from 'react';
import PropertyCard from '@/components/property-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import GuestLayout from '@/layouts/guest-layout';
import type { Property, PropertyType, User } from '@/types';

interface WelcomeProps {
    featuredProperties: Property[];
    latestProperties: Property[];
    propertyTypes: PropertyType[];
    agents: User[];
    cities: { city: string; count: number }[];
    stats: {
        total_properties: number;
        total_cities: number;
        total_agents: number;
        happy_clients: number;
    };
}

/** One photograph per seeded category, so the tiles are not text-only. */
const CATEGORY_IMAGES: Record<string, string> = {
    'luxury-villa':
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=80',
    'modern-apartment':
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
    'penthouse-suite':
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
    townhouse:
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
    'beachfront-estate':
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
    'mountain-chalet':
        'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=900&q=80',
    'historic-manor':
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80',
    'commercial-office':
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80',
};

const CATEGORY_FALLBACK =
    'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=900&q=80';

export default function Welcome({
    featuredProperties = [],
    latestProperties = [],
    propertyTypes = [],
    agents = [],
    cities = [],
    stats,
}: WelcomeProps) {
    const [priceType, setPriceType] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedCity, setSelectedCity] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params: Record<string, string> = {};

        if (searchQuery) {
            params.search = searchQuery;
        }

        if (priceType !== 'all') {
            params.price_type = priceType;
        }

        if (selectedType !== 'all') {
            params.type = selectedType;
        }

        if (selectedCity !== 'all') {
            params.city = selectedCity;
        }

        router.get('/properties', params);
    };

    const [lead, ...restFeatured] = featuredProperties;
    const hasEditorialTrio = featuredProperties.length >= 3;

    return (
        <GuestLayout>
            <Head title="Haven Estates | Homes worth the search" />

            {/* Hero: asymmetric split, text left, photograph right */}
            <section className="border-b border-border">
                <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-4 pt-14 pb-14 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-10 lg:pt-20 lg:pb-20">
                    <div className="lg:col-span-5">
                        <h1 className="font-serif text-5xl leading-[1.02] font-semibold tracking-[-0.015em] text-balance text-foreground sm:text-6xl lg:text-[4.25rem]">
                            Homes worth the search.
                        </h1>

                        <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
                            Villas, penthouses, and estates across{' '}
                            {stats.total_cities} markets.{' '}
                            {stats.total_properties} listings are open to view
                            right now.
                        </p>

                        <div className="mt-9 flex flex-wrap items-center gap-3">
                            <Button asChild size="lg" className="h-11 px-6">
                                <Link href="/properties">
                                    View all listings
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="h-11 px-6"
                            >
                                <Link href="/contact">Book a consultation</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        <div className="overflow-hidden rounded-sm bg-muted">
                            <img
                                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85"
                                alt="A contemporary hillside residence with full-height glazing at dusk"
                                fetchPriority="high"
                                className="settle aspect-[4/3] w-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Search: a control bar, not part of the hero stack */}
            <section className="border-b border-border bg-muted/60">
                <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-10">
                    <form
                        onSubmit={handleSearch}
                        className="flex flex-col gap-4 lg:flex-row lg:items-end"
                    >
                        <fieldset className="lg:w-auto">
                            <legend className="mb-2 text-xs font-medium text-muted-foreground">
                                Looking to
                            </legend>
                            <div className="flex gap-1 rounded-sm border border-border bg-background p-1">
                                {[
                                    { value: 'all', label: 'Everything' },
                                    { value: 'sale', label: 'Buy' },
                                    { value: 'rent', label: 'Rent' },
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() =>
                                            setPriceType(option.value)
                                        }
                                        aria-pressed={
                                            priceType === option.value
                                        }
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
                        </fieldset>

                        <div className="flex-1">
                            <label
                                htmlFor="hero-search"
                                className="mb-2 block text-xs font-medium text-muted-foreground"
                            >
                                Where
                            </label>
                            <div className="relative">
                                <Search
                                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                                    strokeWidth={1.5}
                                />
                                <Input
                                    id="hero-search"
                                    type="search"
                                    placeholder="City, neighborhood, or zip code"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="h-10 bg-background pl-9"
                                />
                            </div>
                        </div>

                        <div className="lg:w-52">
                            <label
                                htmlFor="hero-type"
                                className="mb-2 block text-xs font-medium text-muted-foreground"
                            >
                                Property type
                            </label>
                            <Select
                                value={selectedType}
                                onValueChange={setSelectedType}
                            >
                                <SelectTrigger
                                    id="hero-type"
                                    className="h-10 w-full bg-background"
                                >
                                    <SelectValue placeholder="Any type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Any type
                                    </SelectItem>
                                    {propertyTypes.map((type) => (
                                        <SelectItem
                                            key={type.slug}
                                            value={type.slug}
                                        >
                                            {type.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="lg:w-52">
                            <label
                                htmlFor="hero-city"
                                className="mb-2 block text-xs font-medium text-muted-foreground"
                            >
                                Market
                            </label>
                            <Select
                                value={selectedCity}
                                onValueChange={setSelectedCity}
                            >
                                <SelectTrigger
                                    id="hero-city"
                                    className="h-10 w-full bg-background"
                                >
                                    <SelectValue placeholder="All markets" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All markets
                                    </SelectItem>
                                    {cities.map((entry) => (
                                        <SelectItem
                                            key={entry.city}
                                            value={entry.city}
                                        >
                                            {entry.city} ({entry.count})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button type="submit" className="h-10 px-6 lg:mb-px">
                            Search
                        </Button>
                    </form>
                </div>
            </section>

            {/* Featured: asymmetric editorial grid, lead listing carries the row */}
            {featuredProperties.length > 0 && (
                <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
                    <h2 className="reveal max-w-2xl font-serif text-4xl leading-tight font-semibold tracking-[-0.01em] text-foreground sm:text-5xl">
                        This season's signature listings
                    </h2>

                    {hasEditorialTrio ? (
                        <div className="reveal mt-12 grid gap-x-8 gap-y-12 lg:grid-cols-3 lg:grid-rows-2">
                            <div className="lg:col-span-2 lg:row-span-2">
                                <PropertyCard property={lead} feature />
                            </div>
                            {restFeatured.slice(0, 2).map((property) => (
                                <PropertyCard
                                    key={property.id}
                                    property={property}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="reveal mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                            {featuredProperties.map((property) => (
                                <PropertyCard
                                    key={property.id}
                                    property={property}
                                />
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* Numbers: plain typography, hairlines instead of cards */}
            <section className="border-y border-border bg-muted/40">
                <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
                    <dl className="grid grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                value: stats.total_properties,
                                label: 'Listings available',
                            },
                            {
                                value: stats.total_cities,
                                label: 'Markets covered',
                            },
                            {
                                value: stats.total_agents,
                                label: 'Advisors on staff',
                            },
                            {
                                value: stats.happy_clients,
                                label: 'Clients represented',
                            },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="border-t border-border py-10 pr-4 lg:border-t-0 lg:border-l lg:py-14 lg:pl-8 lg:first:border-l-0 lg:first:pl-0"
                            >
                                <dt className="sr-only">{stat.label}</dt>
                                <dd className="font-serif text-5xl leading-none font-semibold text-foreground tabular-nums lg:text-6xl">
                                    {stat.value.toLocaleString()}
                                </dd>
                                <dd className="mt-3 text-sm text-muted-foreground">
                                    {stat.label}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>

            {/* Categories: horizontal scroll-snap rail */}
            {propertyTypes.length > 0 && (
                <section className="py-20 lg:py-28">
                    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
                        <h2 className="reveal max-w-xl font-serif text-4xl leading-tight font-semibold tracking-[-0.01em] text-foreground sm:text-5xl">
                            Browse by what you are after
                        </h2>

                        <ul className="mt-10 flex snap-x [scrollbar-width:thin] gap-6 overflow-x-auto pb-4">
                            {propertyTypes.map((type) => (
                                <li
                                    key={type.id}
                                    className="w-[16rem] shrink-0 snap-start sm:w-[19rem]"
                                >
                                    <Link
                                        href={`/properties?type=${type.slug}`}
                                        className="group block"
                                    >
                                        <div className="overflow-hidden rounded-sm bg-muted">
                                            <img
                                                src={
                                                    CATEGORY_IMAGES[
                                                        type.slug
                                                    ] ?? CATEGORY_FALLBACK
                                                }
                                                alt=""
                                                loading="lazy"
                                                className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                                            />
                                        </div>
                                        <div className="mt-4 flex items-baseline justify-between gap-3">
                                            <h3 className="text-base font-medium text-foreground">
                                                {type.name}
                                            </h3>
                                            <span className="text-sm text-muted-foreground tabular-nums">
                                                {type.properties_count ?? 0}
                                            </span>
                                        </div>
                                        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                                            {type.description}
                                        </p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}

            {/* How we work: the page's single text and image split */}
            <section className="border-y border-border bg-muted/40">
                <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:py-28">
                    <div className="overflow-hidden rounded-sm bg-muted lg:order-2">
                        <img
                            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80"
                            alt="A double-height living room with a stone fireplace and oak floors"
                            loading="lazy"
                            className="aspect-[4/3] w-full object-cover"
                        />
                    </div>

                    <div className="reveal lg:order-1">
                        <h2 className="max-w-lg font-serif text-4xl leading-tight font-semibold tracking-[-0.01em] text-foreground sm:text-5xl">
                            Three things we do before a listing goes live
                        </h2>

                        <ol className="mt-10 space-y-8">
                            <li className="border-t border-border pt-6">
                                <h3 className="text-base font-medium text-foreground">
                                    Verify the title and the survey
                                </h3>
                                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                                    Every property clears a title search,
                                    boundary check, and structural inspection
                                    before we photograph it.
                                </p>
                            </li>
                            <li className="border-t border-border pt-6">
                                <h3 className="text-base font-medium text-foreground">
                                    Price it against real comparables
                                </h3>
                                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                                    Asking prices are set from closed sales in
                                    the same submarket, not from what the seller
                                    hopes to get.
                                </p>
                            </li>
                            <li className="border-t border-border pt-6">
                                <h3 className="text-base font-medium text-foreground">
                                    Assign one advisor, start to close
                                </h3>
                                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                                    You deal with the same person through
                                    viewings, offer, escrow, and keys. No
                                    handoffs to a call center.
                                </p>
                            </li>
                        </ol>

                        <Link
                            href="/about"
                            className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-foreground"
                        >
                            <span className="rule-link">About the firm</span>
                            <ArrowRight
                                className="size-4 text-brand"
                                strokeWidth={1.5}
                            />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Latest: the one conventional listing grid */}
            {latestProperties.length > 0 && (
                <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <h2 className="font-serif text-4xl leading-tight font-semibold tracking-[-0.01em] text-foreground sm:text-5xl">
                            New to the market
                        </h2>
                        <Link
                            href="/properties"
                            className="inline-flex items-center gap-2 text-sm font-medium text-foreground"
                        >
                            <span className="rule-link">View all listings</span>
                            <ArrowRight
                                className="size-4 text-brand"
                                strokeWidth={1.5}
                            />
                        </Link>
                    </div>

                    <div className="reveal mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                        {latestProperties.map((property) => (
                            <PropertyCard
                                key={property.id}
                                property={property}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Advisors: portrait strip, no card chrome */}
            {agents.length > 0 && (
                <section className="border-t border-border">
                    <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
                        <h2 className="max-w-xl font-serif text-4xl leading-tight font-semibold tracking-[-0.01em] text-foreground sm:text-5xl">
                            The people you will actually be working with
                        </h2>

                        <ul className="reveal mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-x-8">
                            {agents.map((agent) => (
                                <li key={agent.id}>
                                    <div className="overflow-hidden rounded-sm bg-muted">
                                        <img
                                            src={
                                                agent.avatar ??
                                                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'
                                            }
                                            alt=""
                                            loading="lazy"
                                            className="aspect-[3/4] w-full object-cover grayscale transition-all duration-500 hover:grayscale-0"
                                        />
                                    </div>
                                    <h3 className="mt-4 text-base font-medium text-foreground">
                                        {agent.name}
                                    </h3>
                                    <p className="mt-0.5 text-sm text-muted-foreground">
                                        {agent.role === 'admin'
                                            ? 'Managing broker'
                                            : 'Senior advisor'}
                                    </p>
                                    <p className="mt-3 border-t border-border pt-3 text-sm text-muted-foreground tabular-nums">
                                        {agent.properties_count ?? 0} active{' '}
                                        {agent.properties_count === 1
                                            ? 'listing'
                                            : 'listings'}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}

            {/* Closing band: full bleed photograph with a scrim */}
            <section className="relative isolate overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=2000&q=80"
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 -z-10 size-full object-cover"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/65 to-black/30" />

                <div className="mx-auto max-w-[1400px] px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
                    <div className="max-w-xl">
                        <h2 className="font-serif text-4xl leading-tight font-semibold tracking-[-0.01em] text-white sm:text-5xl">
                            Thinking about selling this year?
                        </h2>
                        <p className="mt-5 text-base leading-relaxed text-white/80">
                            We will walk the property, pull the comparables, and
                            give you a written valuation. No fee, no obligation
                            to list with us.
                        </p>
                        <Button
                            asChild
                            size="lg"
                            className="mt-9 h-11 bg-white px-6 text-neutral-900 hover:bg-white/90"
                        >
                            <Link href="/contact">Book a consultation</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
