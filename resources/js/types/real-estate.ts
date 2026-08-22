import type { User } from './auth';

export type PropertyType = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    created_at?: string;
    updated_at?: string;
    properties_count?: number;
};

export type Property = {
    id: number;
    property_type_id: number;
    user_id: number | null;
    title: string;
    slug: string;
    description: string;
    price: number | string;
    price_type: 'sale' | 'rent' | string;
    rent_period: 'monthly' | 'yearly' | 'weekly' | string | null;
    status: 'available' | 'pending' | 'sold' | 'rented' | string;
    featured: boolean;
    bedrooms: number;
    bathrooms: number;
    area_sqft: number;
    garages: number;
    year_built: number | null;
    address: string;
    city: string;
    state: string | null;
    zip_code: string | null;
    country: string;
    latitude: number | null;
    longitude: number | null;
    amenities: string[] | null;
    images: string[] | null;
    video_url: string | null;
    floor_plan_url: string | null;
    created_at?: string;
    updated_at?: string;
    property_type?: PropertyType;
    user?: User;
    enquiries_count?: number;
};

export type Enquiry = {
    id: number;
    property_id: number | null;
    user_id: number | null;
    name: string;
    email: string;
    phone: string | null;
    subject: string | null;
    message: string;
    enquiry_type: 'general' | 'property_inquiry' | 'schedule_tour' | 'make_offer' | 'price_quote' | string;
    preferred_date: string | null;
    status: 'new' | 'contacted' | 'resolved' | 'archived' | string;
    admin_notes: string | null;
    created_at: string;
    updated_at: string;
    property?: Property;
    user?: User;
};

export type PaginatedData<T> = {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
};

export type SharedFlash = {
    success?: string | null;
    error?: string | null;
    message?: string | null;
};
