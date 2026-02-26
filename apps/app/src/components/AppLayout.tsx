import {
    SidebarInset,
    SidebarProvider,
} from '@workspace/ui/components/sidebar';
import { AppSidebar } from './sidebar/AppSidebar';
import { AppHeader } from './AppHeader';

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
                <AppHeader breadcrumbs={breadcrumbs} />
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
