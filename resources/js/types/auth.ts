export type User = {
    id: number;
    name: string;
    email: string;
    role?: 'admin' | 'agent' | 'user' | string;
    phone?: string | null;
    avatar?: string;
    bio?: string | null;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    properties_count?: number;
    enquiries_count?: number;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

/** Seeded one-click sign in accounts. Present outside production only. */
export type DemoAccount = {
    name: string;
    role: string;
    description: string;
};

/* @chisel-passkeys */
export type Passkey = {
    id: number;
    name: string;
    authenticator: string | null;
    created_at_diff: string;
    last_used_at_diff: string | null;
};
/* @end-chisel-passkeys */

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
