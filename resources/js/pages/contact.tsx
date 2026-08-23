import { Head } from '@inertiajs/react';
import React from 'react';
import EnquiryForm from '@/components/enquiry-form';
import GuestLayout from '@/layouts/guest-layout';
import type { User } from '@/types';

interface ContactProps {
    agents: User[];
}

const OFFICES = [
    {
        city: 'Beverly Hills',
        address: '450 North Canon Drive, Suite 300, Beverly Hills, CA 90210',
        phone: '+1 (310) 555-8900',
        email: 'beverlyhills@havenrealestate.com',
        hours: 'Monday to Saturday, 8:00 to 19:00 PT',
    },
    {
        city: 'Miami',
        address: '1421 Brickell Avenue, 18th Floor, Miami, FL 33131',
        phone: '+1 (305) 555-4200',
        email: 'miami@havenrealestate.com',
        hours: 'Monday to Saturday, 8:30 to 19:30 ET',
    },
    {
        city: 'New York',
        address: '77 Franklin Street, Penthouse Floor, New York, NY 10013',
        phone: '+1 (212) 555-7300',
        email: 'newyork@havenrealestate.com',
        hours: 'Monday to Friday, 8:00 to 20:00 ET',
    },
];

export default function Contact({ agents = [] }: ContactProps) {
    return (
        <GuestLayout>
            <Head title="Contact | Haven Estates" />

            <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
                <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
                    <h1 className="font-serif text-4xl leading-[1.08] font-semibold tracking-[-0.015em] text-foreground sm:text-5xl lg:col-span-6 lg:text-6xl">
                        Talk to an advisor.
                    </h1>
                    <p className="max-w-md text-base leading-relaxed text-muted-foreground lg:col-span-6 lg:self-end">
                        Buying, selling, letting, or just want a valuation. Send
                        a message or call the nearest office directly.
                        {agents.length > 0 &&
                            ` ${agents.length} advisors are on the roster.`}
                    </p>
                </div>
            </section>

            <div className="mx-auto max-w-[1400px] px-4 pb-20 sm:px-6 lg:px-10 lg:pb-28">
                <div className="grid gap-12 border-t border-border pt-12 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-6 xl:col-span-7">
                        <h2 className="font-serif text-3xl font-semibold text-foreground">
                            Offices
                        </h2>

                        <ul className="mt-8 space-y-8">
                            {OFFICES.map((office) => (
                                <li
                                    key={office.city}
                                    className="border-t border-border pt-6"
                                >
                                    <h3 className="text-lg font-medium text-foreground">
                                        {office.city}
                                    </h3>
                                    <address className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground not-italic">
                                        {office.address}
                                    </address>

                                    <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                                        <a
                                            href={`tel:${office.phone.replace(/[^+\d]/g, '')}`}
                                            className="rule-link text-foreground"
                                        >
                                            {office.phone}
                                        </a>
                                        <a
                                            href={`mailto:${office.email}`}
                                            className="rule-link text-foreground"
                                        >
                                            {office.email}
                                        </a>
                                    </div>

                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {office.hours}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-6 xl:col-span-5">
                        <div className="border border-border bg-card p-6 lg:p-8">
                            <h2 className="font-serif text-3xl font-semibold text-foreground">
                                Send a message
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                An advisor reads every message and replies
                                within one working day.
                            </p>

                            <div className="mt-7">
                                <EnquiryForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
