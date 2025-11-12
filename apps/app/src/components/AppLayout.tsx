import {
    SidebarInset,
    SidebarProvider,
} from '@workspace/ui/components/sidebar';
import { AppSidebar } from './app-sidebar';
import { AppHeader } from './app-header';

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
