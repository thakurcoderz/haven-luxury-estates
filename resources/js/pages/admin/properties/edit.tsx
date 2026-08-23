import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Bath,
    Bed,
    Building2,
    Check,
    DollarSign,
    ExternalLink,
    Image as ImageIcon,
    Layers,
    MapPin,
    Maximize,
    Plus,
    Save,
    Sparkles,
    Trash2,
    Video,
} from 'lucide-react';
import React, { useState } from 'react';
import FlashMessage from '@/components/flash-message';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Property, PropertyType, User } from '@/types';

interface EditProps {
    property: Property;
    propertyTypes: PropertyType[];
    agents: User[];
}

export default function AdminPropertyEdit({
    property,
    propertyTypes = [],
    agents = [],
}: EditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/admin' },
        { title: 'Properties', href: '/admin/properties' },
        { title: `Edit: ${property.title}`, href: `/admin/properties/${property.id}/edit` },
    ];

    const availableAmenities = [
        'Swimming Pool',
        'Central Air Conditioning',
        'High Speed Fiber Internet',
        'Gym & Fitness Center',
        'Private Balcony & Terrace',
        '24/7 Security & CCTV',
        'Underground Garage Parking',
        'Lush Landscaped Garden',
        'Pet Friendly',
        'Panoramic City/Ocean View',
        'Elevator Access',
        'Smart Home Automation',
        'Modern Fireplace',
        'Chef Kitchen with Island',
        'Walk-in Closet',
        'Spa & Jacuzzi',
    ];

    const { data, setData, put, processing, errors } = useForm({
        title: property.title || '',
        property_type_id: property.property_type_id ? property.property_type_id.toString() : '',
        user_id: property.user_id ? property.user_id.toString() : '',
        description: property.description || '',
        price: property.price ? property.price.toString() : '',
        price_type: property.price_type || 'sale',
        rent_period: property.rent_period || 'monthly',
        status: property.status || 'available',
        featured: Boolean(property.featured),
        bedrooms: property.bedrooms ? property.bedrooms.toString() : '0',
        bathrooms: property.bathrooms ? property.bathrooms.toString() : '0',
        area_sqft: property.area_sqft ? property.area_sqft.toString() : '0',
        garages: property.garages ? property.garages.toString() : '0',
        year_built: property.year_built ? property.year_built.toString() : '',
        address: property.address || '',
        city: property.city || '',
        state: property.state || '',
        zip_code: property.zip_code || '',
        country: property.country || 'USA',
        latitude: property.latitude ? property.latitude.toString() : '',
        longitude: property.longitude ? property.longitude.toString() : '',
        amenities: (property.amenities || []) as string[],
        images: (property.images || []) as string[],
        video_url: property.video_url || '',
    });

    const [newImageUrl, setNewImageUrl] = useState('');

    const handleAmenityToggle = (amenity: string) => {
        if (data.amenities.includes(amenity)) {
            setData(
                'amenities',
                data.amenities.filter((a) => a !== amenity)
            );
        } else {
            setData('amenities', [...data.amenities, amenity]);
        }
    };

    const handleAddImage = () => {
        if (newImageUrl.trim()) {
            setData('images', [...data.images, newImageUrl.trim()]);
            setNewImageUrl('');
        }
    };

    const handleRemoveImage = (index: number) => {
        setData(
            'images',
            data.images.filter((_, i) => i !== index)
        );
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/properties/${property.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Property: ${property.title} | Admin Panel`} />
            <FlashMessage />

            <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <Link
                            href="/admin/properties"
                            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-1"
                        >
                            <ArrowLeft className="size-3.5" />
                            <span>Back to Listings</span>
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground truncate max-w-xl">
                            Edit Property Listing
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href={`/properties/${property.slug}`} target="_blank">
                            <Button variant="outline" size="sm" className="rounded-md gap-1.5 text-xs">
                                <ExternalLink className="size-3.5" />
                                <span>Preview Live</span>
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            form="property-edit-form"
                            disabled={processing}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md shadow-md gap-2"
                        >
                            <Save className="size-4" />
                            <span>{processing ? 'Saving...' : 'Update Listing'}</span>
                        </Button>
                    </div>
                </div>

                <form id="property-edit-form" onSubmit={submit} className="space-y-8">
                    {/* Section 1: Basic Information */}
                    <div className="bg-card border border-border rounded-md p-6 shadow-sm space-y-6">
                        <h3 className="text-base font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
                            <Building2 className="size-4.5 text-brand" />
                            <span>Basic Information & Classification</span>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2 space-y-1.5">
                                <Label htmlFor="title">Property Title *</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                    className="rounded-md"
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="property_type_id">Property Category *</Label>
                                <Select
                                    value={data.property_type_id}
                                    onValueChange={(val) => setData('property_type_id', val)}
                                >
                                    <SelectTrigger className="rounded-md">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {propertyTypes.map((pt) => (
                                            <SelectItem key={pt.id} value={pt.id.toString()}>
                                                {pt.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.property_type_id} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="user_id">Listing Representative / Agent</Label>
                                <Select
                                    value={data.user_id}
                                    onValueChange={(val) => setData('user_id', val)}
                                >
                                    <SelectTrigger className="rounded-md">
                                        <SelectValue placeholder="Assign Agent" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {agents.map((agent) => (
                                            <SelectItem key={agent.id} value={agent.id.toString()}>
                                                {agent.name} ({agent.role})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.user_id} />
                            </div>

                            <div className="md:col-span-2 space-y-1.5">
                                <Label htmlFor="description">Detailed Architectural Description *</Label>
                                <textarea
                                    id="description"
                                    rows={4}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    required
                                    className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring/50"
                                />
                                <InputError message={errors.description} />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Pricing & Status */}
                    <div className="bg-card border border-border rounded-md p-6 shadow-sm space-y-6">
                        <h3 className="text-base font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
                            <DollarSign className="size-4.5 text-brand" />
                            <span>Pricing & Availability</span>
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="price">Price ($ USD) *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    required
                                    className="rounded-md"
                                />
                                <InputError message={errors.price} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="price_type">Price Type *</Label>
                                <Select
                                    value={data.price_type}
                                    onValueChange={(val) => setData('price_type', val)}
                                >
                                    <SelectTrigger className="rounded-md">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sale">For Sale</SelectItem>
                                        <SelectItem value="rent">For Rent</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.price_type} />
                            </div>

                            {data.price_type === 'rent' && (
                                <div className="space-y-1.5">
                                    <Label htmlFor="rent_period">Rent Period</Label>
                                    <Select
                                        value={data.rent_period}
                                        onValueChange={(val) => setData('rent_period', val)}
                                    >
                                        <SelectTrigger className="rounded-md">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                            <SelectItem value="yearly">Yearly</SelectItem>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <Label htmlFor="status">Listing Status *</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(val) => setData('status', val)}
                                >
                                    <SelectTrigger className="rounded-md">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="available">Available</SelectItem>
                                        <SelectItem value="pending">Pending Under Contract</SelectItem>
                                        <SelectItem value="sold">Sold</SelectItem>
                                        <SelectItem value="rented">Rented</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.status} />
                            </div>

                            <div className="flex items-center space-x-2 pt-6">
                                <Checkbox
                                    id="featured"
                                    checked={data.featured}
                                    onCheckedChange={(checked) => setData('featured', checked === true)}
                                />
                                <Label htmlFor="featured" className="text-xs font-semibold cursor-pointer">
                                    Mark as Featured Signature Listing
                                </Label>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Physical Specifications */}
                    <div className="bg-card border border-border rounded-md p-6 shadow-sm space-y-6">
                        <h3 className="text-base font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
                            <Maximize className="size-4.5 text-brand" />
                            <span>Physical Specifications</span>
                        </h3>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="bedrooms">Bedrooms *</Label>
                                <Input
                                    id="bedrooms"
                                    type="number"
                                    min="0"
                                    value={data.bedrooms}
                                    onChange={(e) => setData('bedrooms', e.target.value)}
                                    required
                                    className="rounded-md"
                                />
                                <InputError message={errors.bedrooms} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="bathrooms">Bathrooms *</Label>
                                <Input
                                    id="bathrooms"
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    value={data.bathrooms}
                                    onChange={(e) => setData('bathrooms', e.target.value)}
                                    required
                                    className="rounded-md"
                                />
                                <InputError message={errors.bathrooms} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="area_sqft">Area (Sq. Ft.) *</Label>
                                <Input
                                    id="area_sqft"
                                    type="number"
                                    min="0"
                                    value={data.area_sqft}
                                    onChange={(e) => setData('area_sqft', e.target.value)}
                                    required
                                    className="rounded-md"
                                />
                                <InputError message={errors.area_sqft} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="garages">Garage Spaces</Label>
                                <Input
                                    id="garages"
                                    type="number"
                                    min="0"
                                    value={data.garages}
                                    onChange={(e) => setData('garages', e.target.value)}
                                    className="rounded-md"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="year_built">Year Built</Label>
                                <Input
                                    id="year_built"
                                    type="number"
                                    value={data.year_built}
                                    onChange={(e) => setData('year_built', e.target.value)}
                                    className="rounded-md"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Location & Address */}
                    <div className="bg-card border border-border rounded-md p-6 shadow-sm space-y-6">
                        <h3 className="text-base font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
                            <MapPin className="size-4.5 text-brand" />
                            <span>Location & Coordinates</span>
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="sm:col-span-2 space-y-1.5">
                                <Label htmlFor="address">Street Address *</Label>
                                <Input
                                    id="address"
                                    type="text"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    required
                                    className="rounded-md"
                                />
                                <InputError message={errors.address} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="city">City *</Label>
                                <Input
                                    id="city"
                                    type="text"
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    required
                                    className="rounded-md"
                                />
                                <InputError message={errors.city} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="state">State / Province</Label>
                                <Input
                                    id="state"
                                    type="text"
                                    value={data.state}
                                    onChange={(e) => setData('state', e.target.value)}
                                    className="rounded-md"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="zip_code">Postal / Zip Code</Label>
                                <Input
                                    id="zip_code"
                                    type="text"
                                    value={data.zip_code}
                                    onChange={(e) => setData('zip_code', e.target.value)}
                                    className="rounded-md"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    type="text"
                                    value={data.country}
                                    onChange={(e) => setData('country', e.target.value)}
                                    className="rounded-md"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="latitude">Latitude (GPS)</Label>
                                <Input
                                    id="latitude"
                                    type="text"
                                    value={data.latitude}
                                    onChange={(e) => setData('latitude', e.target.value)}
                                    className="rounded-md"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="longitude">Longitude (GPS)</Label>
                                <Input
                                    id="longitude"
                                    type="text"
                                    value={data.longitude}
                                    onChange={(e) => setData('longitude', e.target.value)}
                                    className="rounded-md"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 5: Amenities */}
                    <div className="bg-card border border-border rounded-md p-6 shadow-sm space-y-6">
                        <h3 className="text-base font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
                            <Sparkles className="size-4.5 text-brand" />
                            <span>Amenities & Features</span>
                        </h3>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {availableAmenities.map((amenity) => {
                                const isChecked = data.amenities.includes(amenity);
                                return (
                                    <label
                                        key={amenity}
                                        onClick={() => handleAmenityToggle(amenity)}
                                        className={`flex items-center gap-2.5 p-3 rounded-md border text-xs font-medium cursor-pointer transition-all ${
                                            isChecked
                                                ? 'bg-brand-soft border-brand text-foreground font-semibold'
                                                : 'bg-muted/40 border-border text-muted-foreground hover:bg-muted'
                                        }`}
                                    >
                                        <Checkbox checked={isChecked} />
                                        <span>{amenity}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Section 6: Image Gallery & Video */}
                    <div className="bg-card border border-border rounded-md p-6 shadow-sm space-y-6">
                        <h3 className="text-base font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
                            <ImageIcon className="size-4.5 text-brand" />
                            <span>High-Resolution Photo Gallery & Video</span>
                        </h3>

                        <div className="space-y-4">
                            {/* Add Image Input */}
                            <div className="flex gap-2">
                                <Input
                                    type="url"
                                    placeholder="Enter Image URL (e.g. https://images.unsplash.com/...)"
                                    value={newImageUrl}
                                    onChange={(e) => setNewImageUrl(e.target.value)}
                                    className="rounded-md text-xs"
                                />
                                <Button
                                    type="button"
                                    onClick={handleAddImage}
                                    className="bg-muted hover:bg-muted/80 text-foreground text-xs rounded-md gap-1 shrink-0"
                                >
                                    <Plus className="size-4" />
                                    <span>Add Image</span>
                                </Button>
                            </div>

                            {/* Images Preview Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {data.images.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className="group relative aspect-[16/10] rounded-md overflow-hidden bg-muted border border-border"
                                    >
                                        <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(idx)}
                                            className="absolute top-2 right-2 size-7 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                        >
                                            <Trash2 className="size-3.5" />
                                        </button>
                                        <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                                            #{idx + 1}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-1.5 pt-2">
                                <Label htmlFor="video_url">Video Walkthrough URL</Label>
                                <Input
                                    id="video_url"
                                    type="url"
                                    value={data.video_url}
                                    onChange={(e) => setData('video_url', e.target.value)}
                                    className="rounded-md text-xs"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Row */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Link href="/admin/properties">
                            <Button variant="outline" type="button" className="rounded-md">
                                Cancel
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-md shadow-md gap-2"
                        >
                            <Save className="size-4" />
                            <span>{processing ? 'Saving...' : 'Update Property'}</span>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
