import { Head, Link } from '@inertiajs/react';
import { Compass, Heart, HeartOff } from 'lucide-react';
import React from 'react';
import PropertyCard from '@/components/property-card';
import { Button } from '@/components/ui/button';
import GuestLayout from '@/layouts/guest-layout';
import type { PaginatedData, Property } from '@/types';

interface SavedPropertiesProps {
    properties: PaginatedData<Property>;
}

export default function SavedProperties({ properties }: SavedPropertiesProps) {
    return (
        <GuestLayout>
            <Head title="Saved Properties | Haven Real Estate" />

            <div className="bg-muted/40 border-b border-border py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                        <Heart className="size-3.5 fill-current" />
                        <span>Saved Bookmarks</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                        Your Saved Properties
                    </h1>
                    <p className="text-sm text-muted-foreground max-w-2xl">
                        Keep track of your favorite luxury residences, penthouses, and investment opportunities for quick comparison.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {properties.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {properties.data.map((property) => (
                            <PropertyCard key={property.id} property={property} isSaved={true} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 px-4 bg-card border border-dashed border-border rounded-3xl space-y-4 max-w-md mx-auto">
                        <div className="size-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
                            <HeartOff className="size-8" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">No Saved Properties Yet</h3>
                        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                            You haven't added any properties to your saved favorites. Click the heart icon on any listing to save it here for later.
                        </p>
                        <Link href="/properties">
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold gap-2">
                                <Compass className="size-4" />
                                <span>Browse Catalog</span>
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </GuestLayout>
    );
}
