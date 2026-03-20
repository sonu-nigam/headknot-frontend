import { useSyncExternalStore } from 'react';
import { X } from 'lucide-react';
import { useIsMobile } from '@workspace/ui/hooks/use-mobile';
import { Sheet, SheetContent, SheetTitle } from '@workspace/ui/components/sheet';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';
import { contextPanelStore } from '@/state/contextPanelStore';

export function ContextPanel() {
    const { isOpen, title } = useSyncExternalStore(
        contextPanelStore.subscribe,
        contextPanelStore.getState,
    );
    const isMobile = useIsMobile();

    const header = (
        <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-3">
            <span className="text-sm font-semibold text-sidebar-foreground">{title}</span>
            <Button variant="ghost" size="icon-sm" onClick={contextPanelStore.close}>
                <X className="size-4" />
            </Button>
        </div>
    );

    const slot = <div id="context-panel-slot" className="flex-1 overflow-y-auto" />;

    if (isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={(o) => !o && contextPanelStore.close()}>
                <SheetContent
                    side="right"
                    className="w-64 p-0 bg-sidebar text-sidebar-foreground [&>button]:hidden"
                >
                    <SheetTitle className="sr-only">{title}</SheetTitle>
                    <div className="flex h-full flex-col">
                        {header}
                        {slot}
                    </div>
                </SheetContent>
            </Sheet>
        );
    }

    // Outer div controls width (collapses to 0, expands to 16rem) — pushes SidebarInset
    // Inner div is always w-64 so content doesn't squish during animation
    return (
        <div
            className={cn(
                'relative flex-shrink-0 overflow-hidden',
                'bg-sidebar text-sidebar-foreground border-l border-sidebar-border',
                'transition-[width] duration-200 ease-linear',
                isOpen ? 'w-64' : 'w-0 border-l-0',
            )}
        >
            <div className="flex h-full w-64 flex-col">
                {header}
                {slot}
            </div>
        </div>
    );
}
