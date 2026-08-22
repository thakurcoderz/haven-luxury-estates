import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import SettingsLayout from '@/layouts/settings/layout';

export default function Appearance() {
    return (
        <SettingsLayout>
            <Head title="Appearance & Theme | Settings" />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Theme & Visual Preference"
                    description="Customize your interface appearance with light, dark, or system default mode."
                />
                <AppearanceTabs />
            </div>
        </SettingsLayout>
    );
}

