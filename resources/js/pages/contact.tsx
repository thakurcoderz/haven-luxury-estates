import { Head, Link } from '@inertiajs/react';
import {
    Clock,
    Globe,
    HelpCircle,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    Send,
    Shield,
    Sparkles,
} from 'lucide-react';
import React from 'react';
import EnquiryForm from '@/components/enquiry-form';
import { Badge } from '@/components/ui/badge';
import GuestLayout from '@/layouts/guest-layout';
import type { User } from '@/types';

interface ContactProps {
    agents: User[];
}

export default function Contact({ agents = [] }: ContactProps) {
    const offices = [
        {
            city: 'Beverly Hills, CA',
            address: '450 North Canon Drive, Suite 300, Beverly Hills, CA 90210',
            phone: '+1 (310) 555-8900',
            email: 'beverlyhills@havenrealestate.com',
            hours: 'Mon - Sat: 8:00 AM - 7:00 PM PST',
        },
        {
            city: 'Miami Beach, FL',
            address: '1421 Brickell Avenue, 18th Floor, Miami, FL 33131',
            phone: '+1 (305) 555-4200',
            email: 'miami@havenrealestate.com',
            hours: 'Mon - Sat: 8:30 AM - 7:30 PM EST',
        },
        {
            city: 'New York, NY',
            address: '77 Franklin Street, Penthouse Floor, New York, NY 10013',
            phone: '+1 (212) 555-7300',
            email: 'newyork@havenrealestate.com',
            hours: 'Mon - Fri: 8:00 AM - 8:00 PM EST',
        },
    ];

    return (
        <GuestLayout>
            <Head title="Contact Us & Inquiries | Haven Real Estate" />

            {/* Header */}
            <div className="bg-muted/40 border-b border-border py-14 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center space-y-3">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        <Mail className="size-3.5" />
                        <span>Direct Communication</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                        Connect With Our Brokerage
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
                        Whether you are acquiring a signature residence, exploring off-market assets, or requesting a discreet valuation, our luxury specialists are at your service.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
                {/* Two Columns: Contact Info & General Inquiry Form */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Office Contacts & Agents */}
                    <div className="lg:col-span-6 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                                Principal Regional Offices
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Our regional flagship offices offer confidential conference facilities and bespoke buyer concierge services.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {offices.map((office, i) => (
                                <div
                                    key={i}
                                    className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                                            <MapPin className="size-4 text-emerald-600" />
                                            {office.city}
                                        </h3>
                                        <Badge variant="secondary" className="text-[10px]">
                                            Flagship Office
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {office.address}
                                    </p>
                                    <div className="pt-2 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1.5">
                                            <Phone className="size-3.5 text-emerald-600" />
                                            {office.phone}
                                        </span>
                                        <span className="flex items-center gap-1.5 truncate">
                                            <Mail className="size-3.5 text-emerald-600" />
                                            {office.email}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: General Enquiry Form */}
                    <div className="lg:col-span-6">
                        <div className="bg-card border border-border/80 rounded-3xl p-8 shadow-xl space-y-6">
                            <div>
                                <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                                    <MessageSquare className="size-3.5" />
                                    <span>Inquiry Portal</span>
                                </div>
                                <h3 className="text-2xl font-bold text-foreground">
                                    Send Us a Message
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                    Complete the form below and a managing partner will review and reply within 4 business hours.
                                </p>
                            </div>

                            <EnquiryForm />
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
