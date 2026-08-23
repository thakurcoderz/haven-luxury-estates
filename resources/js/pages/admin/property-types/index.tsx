import { Head, router, useForm } from '@inertiajs/react';
import {
    Building,
    Building2,
    Castle,
    Edit,
    Home,
    KeyRound,
    Landmark,
    Layers,
    Plus,
    Save,
    Sparkles,
    Trash2,
    Warehouse,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import FlashMessage from '@/components/flash-message';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import type { BreadcrumbItem, PropertyType } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Property Categories', href: '/admin/property-types' },
];

interface PropertyTypesProps {
    propertyTypes: PropertyType[];
}

export default function AdminPropertyTypesIndex({ propertyTypes = [] }: PropertyTypesProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingType, setEditingType] = useState<PropertyType | null>(null);

    const iconOptions = [
        { label: 'Villa / Estate (Castle)', value: 'Castle' },
        { label: 'Modern Apartment (Building2)', value: 'Building2' },
        { label: 'Penthouse (Sparkles)', value: 'Sparkles' },
        { label: 'Single Family (Home)', value: 'Home' },
        { label: 'Beachfront (Landmark)', value: 'Landmark' },
        { label: 'Commercial (Building)', value: 'Building' },
        { label: 'Industrial / Loft (Warehouse)', value: 'Warehouse' },
        { label: 'Studio (KeyRound)', value: 'KeyRound' },
    ];

    const createForm = useForm({
        name: '',
        icon: 'Building2',
        description: '',
    });

    const editForm = useForm({
        name: '',
        icon: 'Building2',
        description: '',
    });

    const handleOpenEdit = (type: PropertyType) => {
        setEditingType(type);
        editForm.setData({
            name: type.name,
            icon: type.icon || 'Building2',
            description: type.description || '',
        });
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/admin/property-types', {
            onSuccess: () => {
                createForm.reset();
                setIsCreateOpen(false);
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingType) return;
        editForm.put(`/admin/property-types/${editingType.id}`, {
            onSuccess: () => {
                setEditingType(null);
            },
        });
    };

    const handleDelete = (type: PropertyType) => {
        if (confirm(`Are you sure you want to delete category "${type.name}"?`)) {
            router.delete(`/admin/property-types/${type.id}`);
        }
    };

    const getIconComponent = (iconName: string | null) => {
        switch (iconName) {
            case 'Castle':
                return <Castle className="size-5" />;
            case 'Building2':
                return <Building2 className="size-5" />;
            case 'Sparkles':
                return <Sparkles className="size-5" />;
            case 'Home':
                return <Home className="size-5" />;
            case 'Landmark':
                return <Landmark className="size-5" />;
            case 'Building':
                return <Building className="size-5" />;
            case 'Warehouse':
                return <Warehouse className="size-5" />;
            default:
                return <KeyRound className="size-5" />;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Property Types | Admin Panel" />
            <FlashMessage />

            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Property Types & Asset Categories
                        </h1>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                            Categorize listings for quick buyer navigation and search segmentation.
                        </p>
                    </div>

                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md shadow-md gap-2"
                    >
                        <Plus className="size-4" />
                        <span>New Category</span>
                    </Button>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {propertyTypes.map((type) => (
                        <div
                            key={type.id}
                            className="bg-card border border-border rounded-md p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="size-10 rounded-md bg-brand-soft text-brand flex items-center justify-center">
                                        {getIconComponent(type.icon)}
                                    </div>
                                    <Badge variant="secondary" className="text-xs font-semibold">
                                        {type.properties_count || 0} Listings
                                    </Badge>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-foreground">{type.name}</h3>
                                    <p className="text-xs font-mono text-muted-foreground mt-0.5">
                                        slug: {type.slug}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                                        {type.description || 'No description provided.'}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOpenEdit(type)}
                                    className="rounded-md text-xs gap-1.5 h-8"
                                >
                                    <Edit className="size-3.5" />
                                    <span>Edit</span>
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(type)}
                                    className="text-rose-600 hover:bg-rose-500/10 rounded-md text-xs gap-1.5 h-8"
                                >
                                    <Trash2 className="size-3.5" />
                                    <span>Delete</span>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Create Modal Dialog */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="rounded-md">
                        <DialogHeader>
                            <DialogTitle>Add Property Category</DialogTitle>
                            <DialogDescription>
                                Create a new category for classification and navigation.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="name">Category Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Modern Penthouse"
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData('name', e.target.value)}
                                    required
                                    className="rounded-md"
                                />
                                <InputError message={createForm.errors.name} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="icon">Display Icon</Label>
                                <Select
                                    value={createForm.data.icon}
                                    onValueChange={(val) => createForm.setData('icon', val)}
                                >
                                    <SelectTrigger className="rounded-md">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {iconOptions.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    rows={3}
                                    placeholder="Brief summary of what this property category represents..."
                                    value={createForm.data.description}
                                    onChange={(e) => createForm.setData('description', e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring/50"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="rounded-md"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={createForm.processing}
                                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md shadow-md"
                                >
                                    {createForm.processing ? 'Creating...' : 'Create Category'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Edit Modal Dialog */}
                <Dialog open={editingType !== null} onOpenChange={(open) => !open && setEditingType(null)}>
                    <DialogContent className="rounded-md">
                        <DialogHeader>
                            <DialogTitle>Edit Property Category</DialogTitle>
                            <DialogDescription>
                                Modify details for {editingType?.name}.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-name">Category Name *</Label>
                                <Input
                                    id="edit-name"
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    required
                                    className="rounded-md"
                                />
                                <InputError message={editForm.errors.name} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="edit-icon">Display Icon</Label>
                                <Select
                                    value={editForm.data.icon}
                                    onValueChange={(val) => editForm.setData('icon', val)}
                                >
                                    <SelectTrigger className="rounded-md">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {iconOptions.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="edit-description">Description</Label>
                                <textarea
                                    id="edit-description"
                                    rows={3}
                                    value={editForm.data.description}
                                    onChange={(e) => editForm.setData('description', e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring/50"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditingType(null)}
                                    className="rounded-md"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md shadow-md"
                                >
                                    {editForm.processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
