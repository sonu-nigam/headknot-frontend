import { SearchIcon } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { useSidebar } from '@workspace/ui/components/sidebar';
import { useSearchDialog } from '@/components/SearchCommandDialog';

export function SearchTrigger() {
    const { isMobile, state } = useSidebar();
    const isExpandedView = isMobile || state === 'expanded';
    const setOpen = useSearchDialog((s) => s.setOpen);

    return (
        <Button
            className="mx-2"
            size={isExpandedView ? 'sm' : 'icon-sm'}
            variant="ghost"
            onClick={() => setOpen(true)}
        >
            <SearchIcon />
            {isExpandedView && (
                <>
                    Search
                    <span className="ml-auto text-xs text-muted-foreground">
                        ⌘K
                    </span>
                </>
            )}
        </Button>
    );
}
