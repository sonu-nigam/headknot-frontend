import {
    SidebarInset,
    SidebarProvider,
} from '@workspace/ui/components/sidebar';
import { AppSidebar } from './sidebar/AppSidebar';
import { AppHeader } from './AppHeader';
import { ContextPanel } from './ContextPanel';
import { SearchCommandDialog } from './SearchCommandDialog';
import BillingBanner from './BillingBanner';

export default function AppLayout({
    children,
    breadcrumbs,
}: {
    children: React.ReactNode;
    breadcrumbs?: { label: string; href?: string }[];
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <BillingBanner />
                <AppHeader breadcrumbs={breadcrumbs} />
                {children}
            </SidebarInset>
            <ContextPanel />
            <SearchCommandDialog />
        </SidebarProvider>
    );
}
