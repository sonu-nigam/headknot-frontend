import {
    SidebarInset,
    SidebarProvider,
} from '@workspace/ui/components/sidebar';
import { AppSidebar } from './app-sidebar';
import { AppHeader } from './app-header';
import { QuickCapture } from './QuickCapture';
import { useAppStore } from '@/state/store';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const captureMemoryFormVisible = useAppStore(
        (state) => state.captureMemoryFormVisible,
    );

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="overflow-hidden">
                <AppHeader />
                {captureMemoryFormVisible && <QuickCapture />}
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
