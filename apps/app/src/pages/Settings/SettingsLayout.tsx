import { Outlet } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';

export function SettingsLayout() {
    return (
        <AppLayout
            breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Settings' }]}
        >
            <main className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-3xl space-y-6 p-6 md:p-8 pb-24">
                    <Outlet />
                </div>
            </main>
        </AppLayout>
    );
}
