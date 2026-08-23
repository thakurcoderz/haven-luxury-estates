import { Head, Link } from '@inertiajs/react';
import React from 'react';
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
    const figures = [
        {
            value: stats.properties_listed.toLocaleString(),
            label: 'Properties listed',
        },
        {
            value: stats.properties_sold.toLocaleString(),
            label: 'Sales closed',
        },
        {
            value: stats.active_agents.toLocaleString(),
            label: 'Advisors on staff',
        },
        { value: stats.client_satisfaction, label: 'Client satisfaction' },
    ];

    return (
        <GuestLayout>
            <Head title="About Haven Estates" />

            {/* Full-width plate, headline sits below it rather than on top */}
            <div className="mx-auto max-w-[1400px] px-4 pt-8 sm:px-6 lg:px-10">
                <div className="overflow-hidden rounded-sm bg-muted">
                    <img
                        src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=2000&q=85"
                        alt="A modernist house set into a hillside, seen from the approach"
                        fetchPriority="high"
                        className="aspect-[4/3] w-full object-cover sm:aspect-[16/9] lg:aspect-[21/9]"
                    />
                </div>
            </div>

            <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
                <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
                    <h1 className="font-serif text-4xl leading-[1.08] font-semibold tracking-[-0.015em] text-foreground sm:text-5xl lg:col-span-6 lg:text-6xl">
                        A brokerage built around the properties, not the
                        pipeline.
                    </h1>

                    <div className="space-y-5 text-base leading-relaxed text-muted-foreground lg:col-span-6">
                        <p>
                            Haven Estates opened in 2012 with four advisors and
                            a single office in Beverly Hills. We took on
                            architecturally interesting houses that other
                            brokerages found difficult to price.
                        </p>
                        <p>
                            That is still the work. We represent buyers,
                            sellers, and tenants across coastal, urban, and
                            estate markets, and we keep the roster small enough
                            that every listing has a named advisor behind it.
                        </p>
                    </div>
                </div>
            </section>

            <section className="border-y border-border bg-muted/40">
                <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
                    <dl className="grid grid-cols-2 lg:grid-cols-4">
                        {figures.map((figure) => (
                            <div
                                key={figure.label}
                                className="border-t border-border py-10 pr-4 lg:border-t-0 lg:border-l lg:py-14 lg:pl-8 lg:first:border-l-0 lg:first:pl-0"
                            >
                                <dt className="sr-only">{figure.label}</dt>
                                <dd className="font-serif text-5xl leading-none font-semibold text-foreground tabular-nums lg:text-6xl">
                                    {figure.value}
                                </dd>
                                <dd className="mt-3 text-sm text-muted-foreground">
                                    {figure.label}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>

            <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                    <div className="overflow-hidden rounded-sm bg-muted">
                        <img
                            src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=80"
                            alt="An open-plan kitchen with a marble island and steel-framed windows"
                            loading="lazy"
                            className="aspect-[4/3] w-full object-cover"
                        />
                    </div>

                    <div className="reveal">
                        <h2 className="max-w-lg font-serif text-4xl leading-tight font-semibold tracking-[-0.01em] text-foreground sm:text-5xl">
                            How we handle a transaction
                        </h2>

                        <dl className="mt-10 space-y-8">
                            <div className="border-t border-border pt-6">
                                <dt className="text-base font-medium text-foreground">
                                    Confidentiality by default
                                </dt>
                                <dd className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                                    Off-market listings stay off market. Client
                                    names, terms, and timelines are shared only
                                    with the people closing the deal.
                                </dd>
                            </div>
                            <div className="border-t border-border pt-6">
                                <dt className="text-base font-medium text-foreground">
                                    Valuations you can check
                                </dt>
                                <dd className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                                    Every valuation cites the closed sales it is
                                    based on, so you can see the reasoning
                                    rather than take a number on trust.
                                </dd>
                            </div>
                            <div className="border-t border-border pt-6">
                                <dt className="text-base font-medium text-foreground">
                                    One advisor, start to close
                                </dt>
                                <dd className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                                    The person who shows you the house is the
                                    person who negotiates it and sits with you
                                    at closing.
                                </dd>
                            </div>
                        </dl>

                        <Button asChild className="mt-10 h-10 px-6">
                            <Link href="/contact">Book a consultation</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {agents.length > 0 && (
                <section className="border-t border-border">
                    <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
                        <h2 className="max-w-xl font-serif text-4xl leading-tight font-semibold tracking-[-0.01em] text-foreground sm:text-5xl">
                            Advisors
                        </h2>

                        <ul className="reveal mt-12 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4 lg:gap-x-8">
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
                                    {agent.bio && (
                                        <p className="mt-3 line-clamp-3 border-t border-border pt-3 text-sm leading-relaxed text-muted-foreground">
                                            {agent.bio}
                                        </p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}
        </GuestLayout>
    );
}
