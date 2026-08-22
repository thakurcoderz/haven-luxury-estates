import { usePage } from '@inertiajs/react';

import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { name } = usePage().props;
    const siteName = name === 'Laravel' ? 'Haven Real Estate' : name;

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-emerald-600 text-white">
                <AppLogoIcon className="size-5 fill-none stroke-white" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-bold text-foreground">
                    {siteName}
                </span>
            </div>
        </>
    );
}
