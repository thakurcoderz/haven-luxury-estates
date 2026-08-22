import { Form, Head, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SettingsLayout from '@/layouts/settings/layout';
import { send } from '@/routes/verification';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
};

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<PageProps>().props;
    const user = auth?.user;

    return (
        <SettingsLayout>
            <Head title="Personal Info | Profile Settings" />

            <div className="space-y-8">
                <div>
                    <Heading
                        variant="small"
                        title="Personal Information"
                        description="Update your contact details so our brokerage advisors can reach you regarding tours and offers."
                    />
                </div>

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        className="rounded-xl"
                                        defaultValue={user?.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="e.g. Eleanor Vance"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        className="rounded-xl"
                                        defaultValue={user?.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="e.g. eleanor@example.com"
                                    />
                                    <InputError message={errors.email} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone Number (For Tour Confirmations)</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        className="rounded-xl"
                                        defaultValue={user?.phone ?? ''}
                                        name="phone"
                                        placeholder="+1 (555) 234-5678"
                                    />
                                    <InputError message={errors.phone} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="role">Account Type</Label>
                                    <Input
                                        id="role"
                                        className="rounded-xl bg-muted/60 capitalize"
                                        defaultValue={user?.role ?? 'Client'}
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="bio">Buyer Preferences & Notes</Label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    rows={3}
                                    defaultValue={user?.bio ?? ''}
                                    placeholder="Tell our agents about your desired neighborhoods, budget range, and timeline..."
                                    className="w-full rounded-2xl border border-input bg-background px-3.5 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                                />
                                <InputError message={errors.bio} />
                            </div>

                            {mustVerifyEmail && user?.email_verified_at === null && (
                                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                                    <p className="text-xs text-amber-800 dark:text-amber-300">
                                        Your email address is unverified.{' '}
                                        <Link
                                            href={send()}
                                            as="button"
                                            className="font-bold underline underline-offset-4 hover:text-amber-900"
                                        >
                                            Click here to re-send the verification email.
                                        </Link>
                                    </p>

                                    {status === 'verification-link-sent' && (
                                        <div className="mt-2 text-xs font-bold text-emerald-600">
                                            A new verification link has been sent to your email address.
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center gap-4 pt-2">
                                <Button
                                    disabled={processing}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs px-6"
                                    data-test="update-profile-button"
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                <div className="pt-8 border-t border-border/60">
                    <DeleteUser />
                </div>
            </div>
        </SettingsLayout>
    );
}

