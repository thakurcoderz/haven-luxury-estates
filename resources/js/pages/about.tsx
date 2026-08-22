import { Head, Link } from '@inertiajs/react';
import {
    Award,
    Building2,
    CheckCircle2,
    Compass,
    Globe,
    Heart,
    Shield,
    Sparkles,
    TrendingUp,
    Users,
} from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import GuestLayout from '@/layouts/guest-layout';
import type { User } from '@/types';

interface AboutProps {
    agents: User[];
    stats: {
        properties_listed: number;
        properties_sold: number;
        active_agents: number;
        client_satisfaction: string;
    };
}

export default function About({ agents = [], stats }: AboutProps) {
    return (
        <GuestLayout>
            <Head title="About Haven Real Estate | Our Heritage & Team" />

            {/* Header Banner */}
            <div className="bg-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <img
                        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
                        alt="Architecture"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        Our Heritage & Vision
                    </Badge>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                        Curating Extraordinary Living Spaces Since 2012
                    </h1>
                    <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        Haven Real Estate was founded on a singular conviction: luxury property acquisition should be characterized by unmatched transparency, deep architectural passion, and bespoke discretion.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-card border border-border rounded-3xl p-8 shadow-sm text-center">
                    <div className="space-y-1">
                        <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                            {stats.properties_listed}+
                        </div>
                        <p className="text-xs text-muted-foreground font-semibold">Active Portfolios</p>
                    </div>
                    <div className="space-y-1">
                        <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
                            {stats.properties_sold}+
                        </div>
                        <p className="text-xs text-muted-foreground font-semibold">Properties Closed</p>
                    </div>
                    <div className="space-y-1">
                        <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                            {stats.active_agents}+
                        </div>
                        <p className="text-xs text-muted-foreground font-semibold">Senior Advisors</p>
                    </div>
                    <div className="space-y-1">
                        <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
                            {stats.client_satisfaction}
                        </div>
                        <p className="text-xs text-muted-foreground font-semibold">Satisfaction Rate</p>
                    </div>
                </div>

                {/* Mission & Values */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            <Award className="size-3.5" />
                            <span>Core Operating Principles</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                            Built On Integrity, Precision, and Global Connectivity
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            From coastal beachfront estates to cosmopolitan architectural penthouses, our firm provides institutional-grade research, rigorous valuation models, and discreet representation.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div className="p-4 rounded-2xl bg-muted/50 border border-border/60 space-y-2">
                                <Shield className="size-5 text-emerald-600" />
                                <h4 className="font-bold text-sm text-foreground">Absolute Discretion</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Confidential transaction handling tailored for high-profile clients and institutional trusts.
                                </p>
                            </div>
                            <div className="p-4 rounded-2xl bg-muted/50 border border-border/60 space-y-2">
                                <TrendingUp className="size-5 text-emerald-600" />
                                <h4 className="font-bold text-sm text-foreground">Yield Optimization</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Deep quantitative underwriting and submarket forecasting to ensure sound financial appreciation.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-border">
                        <img
                            src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"
                            alt="Luxury Architecture"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Team Showcase */}
                <div className="space-y-10">
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            <Users className="size-3.5" />
                            <span>Leadership & Advisors</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                            Meet Our Real Estate Partners
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {agents.map((agent) => (
                            <div
                                key={agent.id}
                                className="bg-card border border-border/70 rounded-2xl p-6 text-center space-y-4 shadow-sm"
                            >
                                <img
                                    src={agent.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                                    alt={agent.name}
                                    className="size-24 rounded-full object-cover mx-auto border-2 border-emerald-500/30"
                                />
                                <div>
                                    <h3 className="font-bold text-base text-foreground">{agent.name}</h3>
                                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
                                        {agent.role === 'admin' ? 'Broker / Director' : 'Senior Luxury Advisor'}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-3">
                                        {agent.bio || 'Advising private clients and developers across prestigious residential property sectors.'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
