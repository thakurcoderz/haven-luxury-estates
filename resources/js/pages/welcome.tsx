import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    Award,
    Building,
    Building2,
    Calendar,
    Castle,
    CheckCircle2,
    Compass,
    Home,
    KeyRound,
    Landmark,
    Mail,
    MapPin,
    Phone,
    Search,
    Shield,
    ShieldCheck,
    Sparkles,
    Star,
    TrendingUp,
    Users,
    Warehouse,
} from 'lucide-react';
import React, { useState } from 'react';
import PropertyCard from '@/components/property-card';
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

    const handleHeroSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params: Record<string, any> = {};
        if (searchQuery) params.search = searchQuery;
        if (priceType !== 'all') params.price_type = priceType;
        if (selectedType !== 'all') params.type = selectedType;
        if (selectedCity !== 'all') params.city = selectedCity;

        router.get('/properties', params);
    };

    const getIconComponent = (iconName: string | null) => {
        switch (iconName) {
            case 'Castle':
                return <Castle className="size-6 text-emerald-600 dark:text-emerald-400" />;
            case 'Building2':
                return <Building2 className="size-6 text-emerald-600 dark:text-emerald-400" />;
            case 'Sparkles':
                return <Sparkles className="size-6 text-emerald-600 dark:text-emerald-400" />;
            case 'Home':
                return <Home className="size-6 text-emerald-600 dark:text-emerald-400" />;
            case 'Landmark':
                return <Landmark className="size-6 text-emerald-600 dark:text-emerald-400" />;
            case 'Building':
                return <Building className="size-6 text-emerald-600 dark:text-emerald-400" />;
            case 'Warehouse':
                return <Warehouse className="size-6 text-emerald-600 dark:text-emerald-400" />;
            default:
                return <KeyRound className="size-6 text-emerald-600 dark:text-emerald-400" />;
        }
    };

    return (
        <GuestLayout>
            <Head title="Haven Real Estate | Exceptional Living & Prime Estates" />

            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center justify-center bg-slate-950 text-white overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
                {/* Background Image with Ambient Dark Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85"
                        alt="Luxury architectural residence"
                        className="w-full h-full object-cover opacity-35 scale-105 animate-in fade-in zoom-in-105 duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                    <div className="absolute inset-0 bg-radial from-transparent via-slate-950/50 to-slate-950" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold backdrop-blur-md">
                        <Sparkles className="size-3.5" />
                        <span>Curated Prime & Luxury Real Estate Portfolio</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-white">
                        Find Your Sanctuary In The{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                            World's Finest
                        </span>{' '}
                        Locations
                    </h1>

                    <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
                        Discover extraordinary architectural masterpieces, skyline penthouses, coastal villas, and high-yield commercial investments.
                    </p>

                    {/* Search Card */}
                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 sm:p-6 rounded-3xl border border-white/10 shadow-2xl text-foreground text-left max-w-4xl mx-auto">
                        <form onSubmit={handleHeroSearch} className="space-y-4">
                            {/* Segment Tabs: All / Buy / Rent */}
                            <div className="flex items-center gap-2 border-b border-border pb-3">
                                <button
                                    type="button"
                                    onClick={() => setPriceType('all')}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        priceType === 'all'
                                            ? 'bg-emerald-600 text-white shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    All Listings
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPriceType('sale')}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        priceType === 'sale'
                                            ? 'bg-emerald-600 text-white shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    For Sale
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPriceType('rent')}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        priceType === 'rent'
                                            ? 'bg-emerald-600 text-white shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    For Rent
                                </button>
                            </div>

                            {/* Search Fields Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
                                {/* Search keyword */}
                                <div className="lg:col-span-4 relative">
                                    <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Location, street, zip..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 h-11 rounded-xl bg-background"
                                    />
                                </div>

                                {/* Category Dropdown */}
                                <div className="lg:col-span-3">
                                    <Select value={selectedType} onValueChange={setSelectedType}>
                                        <SelectTrigger className="h-11 rounded-xl bg-background">
                                            <SelectValue placeholder="Property Category" />
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

                                {/* City Dropdown */}
                                <div className="lg:col-span-3">
                                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                                        <SelectTrigger className="h-11 rounded-xl bg-background">
                                            <SelectValue placeholder="City / Region" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Cities</SelectItem>
                                            {cities.map((c) => (
                                                <SelectItem key={c.city} value={c.city}>
                                                    {c.city} ({c.count})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Submit Button */}
                                <div className="lg:col-span-2">
                                    <Button
                                        type="submit"
                                        className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md shadow-emerald-600/30 gap-2"
                                    >
                                        <Search className="size-4" />
                                        <span>Explore</span>
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Quick City Tags */}
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-400">
                        <span>Popular locations:</span>
                        {cities.slice(0, 4).map((c) => (
                            <Link
                                key={c.city}
                                href={`/properties?city=${encodeURIComponent(c.city)}`}
                                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
                            >
                                {c.city}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Statistics Bar */}
            <section className="border-y border-border bg-card/60 py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div className="space-y-1">
                        <div className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                            ${stats.total_properties > 0 ? `${stats.total_properties}0M+` : '$250M+'}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground font-medium">Portfolio Asset Value</p>
                    </div>
                    <div className="space-y-1">
                        <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                            {stats.total_properties}+
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground font-medium">Exclusive Listings</p>
                    </div>
                    <div className="space-y-1">
                        <div className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                            {stats.total_agents}+
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground font-medium">Certified Broker Experts</p>
                    </div>
                    <div className="space-y-1">
                        <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                            99.4%
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground font-medium">Client Trust & Satisfaction</p>
                    </div>
                </div>
            </section>

            {/* Featured Properties Showcase */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                            <Sparkles className="size-3.5" />
                            <span>Handpicked Residences</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                            Featured Signature Properties
                        </h2>
                        <p className="text-muted-foreground text-sm sm:text-base mt-2 max-w-xl">
                            Explore our most coveted architectural homes, coastal estates, and skyline penthouses currently on the market.
                        </p>
                    </div>

                    <Link href="/properties">
                        <Button variant="outline" className="rounded-xl border-border/80 hover:border-emerald-500 gap-2">
                            <span>Browse All Listings</span>
                            <ArrowRight className="size-4" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredProperties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            </section>

            {/* Property Categories Grid */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/40 border-y border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            <Building2 className="size-3.5" />
                            <span>Diverse Asset Classes</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                            Explore By Property Category
                        </h2>
                        <p className="text-muted-foreground text-sm sm:text-base">
                            Whether searching for a contemporary urban penthouse or a peaceful coastal sanctuary, find the exact property type that fits your vision.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {propertyTypes.map((type) => (
                            <Link
                                key={type.id}
                                href={`/properties?type=${type.slug}`}
                                className="group bg-card border border-border/70 rounded-2xl p-6 hover:shadow-lg hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                                            {getIconComponent(type.icon)}
                                        </div>
                                        <Badge variant="secondary" className="text-xs font-semibold">
                                            {type.properties_count || 0} Listings
                                        </Badge>
                                    </div>

                                    <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-600 transition-colors">
                                        {type.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-2">
                                        {type.description || 'Explore our exclusive listings in this premium property category.'}
                                    </p>
                                </div>

                                <div className="pt-4 mt-4 border-t border-border/40 flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                                    <span>View Available Properties</span>
                                    <ArrowRight className="size-3.5 ml-1.5" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us & Trust Pillars */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            <ShieldCheck className="size-3.5" />
                            <span>The Haven Standard</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
                            White-Glove Brokerage Designed For Discerning Clients
                        </h2>

                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                            We combine deep localized real estate intelligence with global marketing reach, ensuring your buying, selling, or leasing journey is smooth, confidential, and exceptionally rewarding.
                        </p>

                        <div className="space-y-4 pt-2">
                            <div className="flex items-start gap-3.5">
                                <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <CheckCircle2 className="size-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-foreground">100% Vetted & Verified Listings</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Every property passes comprehensive title, architectural inspection, and valuation verification before entering our catalog.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3.5">
                                <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <Shield className="size-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-foreground">Confidential Escrow & Legal Support</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        End-to-end guidance from legal drafting to secure escrow settlement with dedicated luxury advisors.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3.5">
                                <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <TrendingUp className="size-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-foreground">High-Yield Investment Strategies</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Data-driven portfolio analytics to maximize rental yield, capital appreciation, and tax efficiency.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex items-center gap-4">
                            <Link href="/about">
                                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md">
                                    Learn About Us
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button variant="outline" className="rounded-xl border-border">
                                    Speak with an Advisor
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Image Collage */}
                    <div className="relative">
                        <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-border">
                            <img
                                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
                                alt="Modern interior design"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-6 -left-6 bg-card border border-border p-5 rounded-2xl shadow-xl max-w-[260px] hidden sm:block">
                            <div className="flex items-center gap-1 text-amber-500 mb-1.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="size-4 fill-amber-500" />
                                ))}
                            </div>
                            <p className="text-xs font-bold text-foreground">5-Star Client Rating</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                                Over 850 high-net-worth clients served across North America.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest Listed Properties */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-border">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                            <Sparkles className="size-3.5" />
                            <span>Fresh to Market</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                            Recently Added Residences
                        </h2>
                    </div>

                    <Link href="/properties">
                        <Button variant="ghost" className="text-emerald-600 dark:text-emerald-400 gap-1.5 font-semibold">
                            <span>View All Recent</span>
                            <ArrowRight className="size-4" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {latestProperties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            </section>

            {/* Meet Our Premier Brokers / Agents */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/40 border-t border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            <Users className="size-3.5" />
                            <span>Professional Representation</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                            Meet Our Elite Advisors
                        </h2>
                        <p className="text-muted-foreground text-sm sm:text-base">
                            Industry recognized specialists dedicated to guiding you through acquisitions, leasing, and valuations with complete integrity.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {agents.map((agent) => (
                            <div
                                key={agent.id}
                                className="bg-card border border-border/70 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center space-y-4 hover:shadow-md transition-shadow"
                            >
                                <div className="size-24 rounded-full overflow-hidden border-2 border-emerald-500/40 p-1">
                                    <img
                                        src={agent.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                                        alt={agent.name}
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold text-foreground">{agent.name}</h3>
                                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                                        {agent.role === 'admin' ? 'Managing Broker / Director' : 'Senior Luxury Advisor'}
                                    </p>
                                    <p className="text-xs text-muted-foreground line-clamp-2 pt-1 leading-relaxed">
                                        {agent.bio || 'Specializing in prime residential estates and confidential client advisory.'}
                                    </p>
                                </div>

                                <div className="w-full pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground font-medium">
                                    <span>{agent.properties_count || 0} Active Listings</span>
                                    <Link href="/contact">
                                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                                            Contact Agent →
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Interactive Call to Action Banner */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-8 sm:p-14 text-white shadow-2xl">
                    <div className="relative z-10 max-w-2xl space-y-6">
                        <Badge className="bg-white/10 text-emerald-300 border-white/20 backdrop-blur-md">
                            Ready For Your Next Move?
                        </Badge>
                        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                            Looking to List or Inquire About a Premier Property?
                        </h2>
                        <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                            Schedule a private consultation with our brokerage team to discuss bespoke acquisition opportunities, off-market listings, or a comprehensive property valuation.
                        </p>
                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <Link href="/contact">
                                <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-100 font-bold rounded-xl shadow-lg">
                                    Schedule Free Consultation
                                </Button>
                            </Link>
                            <Link href="/properties">
                                <Button size="lg" className="border border-white/30 bg-white/10 backdrop-blur-xs text-white hover:bg-white/20 hover:text-white font-medium rounded-xl shadow-sm">
                                    Browse All Properties
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Decorative abstract shapes */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 size-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
                </div>
            </section>
        </GuestLayout>
    );
}
