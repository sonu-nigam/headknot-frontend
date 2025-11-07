import {
    SidebarInset,
    SidebarProvider,
} from '@workspace/ui/components/sidebar';
import { AppSidebar } from './app-sidebar';
import { AppHeader } from './app-header';
import { QuickCapture } from './QuickCapture';
import { useAppStore } from '@/state/store';

export default function AppLayout({
    children,
    breadcrumbs,
}: {
    children: React.ReactNode;
    breadcrumbs?: { label: string; href?: string }[];
}) {
    const captureMemoryFormVisible = useAppStore(
        (state) => state.captureMemoryFormVisible,
    );

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="overflow-hidden">
                <AppHeader breadcrumbs={breadcrumbs} />
                {captureMemoryFormVisible && <QuickCapture />}
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
