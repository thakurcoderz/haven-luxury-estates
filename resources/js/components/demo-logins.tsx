import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

/**
 * One-click sign in for the seeded demo accounts.
 *
 * `demoAccounts` is shared by the server only outside production, so this
 * renders nothing at all on a deployed site. The path is written out rather
 * than imported from Wayfinder because the route does not exist in
 * production, and a generated import would break that build.
 */
export default function DemoLogins() {
    const demoAccounts = usePage().props.demoAccounts;
    const [pendingEmail, setPendingEmail] = useState<string | null>(null);

    if (!demoAccounts || Object.keys(demoAccounts).length === 0) {
        return null;
    }

    const signInAs = (email: string) => {
        setPendingEmail(email);
        router.post(
            '/demo-login',
            { email },
            { onFinish: () => setPendingEmail(null) },
        );
    };

    return (
        <div className="mt-8 border-t border-border pt-6">
            <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-sm font-medium text-foreground">
                    Demo accounts
                </h2>
                <span className="text-xs text-muted-foreground">
                    Local environment only
                </span>
            </div>

            <ul className="mt-4 space-y-2">
                {Object.entries(demoAccounts).map(([email, account]) => (
                    <li key={email}>
                        <button
                            type="button"
                            onClick={() => signInAs(email)}
                            disabled={pendingEmail !== null}
                            className="flex w-full items-center justify-between gap-4 rounded-sm border border-border px-4 py-3 text-left transition-colors hover:border-brand hover:bg-muted/60 disabled:opacity-60"
                        >
                            <span className="min-w-0">
                                <span className="block truncate text-sm font-medium text-foreground">
                                    {account.name}
                                </span>
                                <span className="block truncate text-xs text-muted-foreground">
                                    {account.description}
                                </span>
                            </span>

                            <span className="flex shrink-0 items-center gap-2">
                                {pendingEmail === email && <Spinner />}
                                <span className="text-[0.6875rem] font-semibold tracking-[0.14em] text-brand uppercase">
                                    {account.role}
                                </span>
                            </span>
                        </button>
                    </li>
                ))}
            </ul>

            <p className="mt-3 text-xs text-muted-foreground">
                Every seeded account uses the password{' '}
                <code className="rounded-sm bg-muted px-1 py-0.5">
                    password
                </code>{' '}
                if you would rather sign in through the form.
            </p>
        </div>
    );
}
