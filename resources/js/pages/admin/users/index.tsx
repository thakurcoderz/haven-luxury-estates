import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    CheckCircle2,
    Edit,
    Mail,
    Phone,
    Save,
    Search,
    Shield,
    User as UserIcon,
    Users,
} from 'lucide-react';
import React, { useState } from 'react';
import FlashMessage from '@/components/flash-message';
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
import type { BreadcrumbItem, PaginatedData, User } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Users & Agents', href: '/admin/users' },
];

interface UsersProps {
    users: PaginatedData<User>;
    filters: {
        search?: string | null;
        role?: string | null;
    };
    roleCounts: {
        all: number;
        admin: number;
        agent: number;
        user: number;
    };
}

export default function AdminUsersIndex({
    users,
    filters,
    roleCounts,
}: UsersProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || 'all');
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const editForm = useForm({
        role: 'user',
        phone: '',
        bio: '',
    });

    const handleFilter = (customParams?: Record<string, any>) => {
        const queryParams = {
            search: search || undefined,
            role: role !== 'all' ? role : undefined,
            ...customParams,
        };

        router.get('/admin/users', queryParams, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleOpenEdit = (user: User) => {
        setEditingUser(user);
        editForm.setData({
            role: user.role || 'user',
            phone: user.phone || '',
            bio: user.bio || '',
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        editForm.put(`/admin/users/${editingUser.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingUser(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Users & Agents | Admin Panel" />
            <FlashMessage />

            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Users & Real Estate Agents
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        Manage registered client accounts, assign agent permissions, and update broker credentials.
                    </p>
                </div>

                {/* Role Tabs & Search */}
                <div className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Role Pills */}
                        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-muted rounded-xl text-xs font-semibold">
                            {[
                                { label: 'All Users', value: 'all', count: roleCounts.all },
                                { label: 'Admins', value: 'admin', count: roleCounts.admin },
                                { label: 'Agents', value: 'agent', count: roleCounts.agent },
                                { label: 'Regular Clients', value: 'user', count: roleCounts.user },
                            ].map((tab) => (
                                <button
                                    key={tab.value}
                                    type="button"
                                    onClick={() => {
                                        setRole(tab.value);
                                        handleFilter({ role: tab.value !== 'all' ? tab.value : undefined });
                                    }}
                                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                                        role === tab.value
                                            ? 'bg-background text-foreground shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    <span>{tab.label}</span>
                                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-muted/80 font-mono">
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative sm:w-72">
                            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search by name, email, phone..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                className="pl-9 h-9 rounded-xl text-xs"
                            />
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-border bg-muted/50 text-muted-foreground font-semibold uppercase tracking-wider">
                                    <th className="py-3 px-4">User / Agent</th>
                                    <th className="py-3 px-4">Role</th>
                                    <th className="py-3 px-4">Contact Phone</th>
                                    <th className="py-3 px-4 text-center">Listings</th>
                                    <th className="py-3 px-4 text-center">Inquiries</th>
                                    <th className="py-3 px-4">Joined Date</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {users.data.length > 0 ? (
                                    users.data.map((u) => (
                                        <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                                            {/* User info */}
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-full overflow-hidden bg-muted border border-border shrink-0">
                                                        <img
                                                            src={
                                                                u.avatar ||
                                                                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                                                            }
                                                            alt={u.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <span className="font-bold text-sm text-foreground block truncate">
                                                            {u.name}
                                                        </span>
                                                        <span className="text-[11px] text-muted-foreground truncate block">
                                                            {u.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Role */}
                                            <td className="py-3 px-4">
                                                <Badge
                                                    className={`text-[10px] uppercase font-bold ${
                                                        u.role === 'admin'
                                                            ? 'bg-emerald-600 text-white'
                                                            : u.role === 'agent'
                                                            ? 'bg-sky-600 text-white'
                                                            : 'bg-muted text-muted-foreground'
                                                    }`}
                                                >
                                                    {u.role || 'user'}
                                                </Badge>
                                            </td>

                                            {/* Phone */}
                                            <td className="py-3 px-4 text-muted-foreground">
                                                {u.phone || '—'}
                                            </td>

                                            {/* Listings count */}
                                            <td className="py-3 px-4 text-center font-bold">
                                                {u.properties_count || 0}
                                            </td>

                                            {/* Inquiries count */}
                                            <td className="py-3 px-4 text-center font-bold">
                                                {u.enquiries_count || 0}
                                            </td>

                                            {/* Joined */}
                                            <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                                                {new Date(u.created_at).toLocaleDateString()}
                                            </td>

                                            {/* Actions */}
                                            <td className="py-3 px-4 text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleOpenEdit(u)}
                                                    className="h-8 px-2.5 rounded-xl text-xs gap-1.5"
                                                >
                                                    <Edit className="size-3.5" />
                                                    <span>Edit Role</span>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-muted-foreground">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.links.length > 3 && (
                        <div className="p-4 border-t border-border flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                                Page {users.current_page} of {users.last_page} ({users.total} total)
                            </span>
                            <div className="flex items-center gap-1">
                                {users.links.map((link, i) => (
                                    link.url ? (
                                        <Link key={i} href={link.url} preserveScroll>
                                            <Button
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                className={`h-8 w-8 p-0 rounded-lg text-xs ${
                                                    link.active ? 'bg-emerald-600 text-white font-bold' : ''
                                                }`}
                                            >
                                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                            </Button>
                                        </Link>
                                    ) : null
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Edit Role Dialog */}
                <Dialog open={editingUser !== null} onOpenChange={(open) => !open && setEditingUser(null)}>
                    <DialogContent className="rounded-3xl max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Edit User Profile & Role</DialogTitle>
                            <DialogDescription>
                                Modify role permissions and agent credentials for {editingUser?.name}.
                            </DialogDescription>
                        </DialogHeader>

                        {editingUser && (
                            <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="role">Account Role *</Label>
                                    <Select
                                        value={editForm.data.role}
                                        onValueChange={(val) => editForm.setData('role', val)}
                                    >
                                        <SelectTrigger className="rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Administrator (Full Access)</SelectItem>
                                            <SelectItem value="agent">Real Estate Agent</SelectItem>
                                            <SelectItem value="user">Regular Client / User</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="phone">Contact Phone</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+1 (555) 000-0000"
                                        value={editForm.data.phone}
                                        onChange={(e) => editForm.setData('phone', e.target.value)}
                                        className="rounded-xl"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="bio">Broker / Agent Professional Bio</Label>
                                    <textarea
                                        id="bio"
                                        rows={3}
                                        placeholder="Professional experience, awards, specialization..."
                                        value={editForm.data.bio}
                                        onChange={(e) => editForm.setData('bio', e.target.value)}
                                        className="w-full px-3 py-2 text-sm bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-3 border-t border-border">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setEditingUser(null)}
                                        className="rounded-xl"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={editForm.processing}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md gap-2"
                                    >
                                        <Save className="size-4" />
                                        <span>{editForm.processing ? 'Saving...' : 'Save User'}</span>
                                    </Button>
                                </div>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
