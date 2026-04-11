import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/state/store';
import { $api } from '@workspace/api-client';
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@workspace/ui/components/command';
import {
    FileTextIcon,
    LayoutDashboardIcon,
    BoxIcon,
    HourglassIcon,
    SearchIcon,
    FolderIcon,
} from 'lucide-react';
import { create } from 'zustand';
import { Schemas } from '@/types/api';
import { convertMemoryIdToSlug } from '@/lib/memoryUtils';

// Shared state so sidebar button and dashboard can both open the dialog
interface SearchDialogStore {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export const useSearchDialog = create<SearchDialogStore>((set) => ({
    open: false,
    setOpen: (open) => set({ open }),
}));

const ENTITY_ICONS: Record<string, React.ElementType> = {
    MEMORY: FileTextIcon,
    SPACE: FolderIcon,
    WORKSPACE: BoxIcon,
};

function getEntityIcon(entityType?: string) {
    const Icon = ENTITY_ICONS[entityType?.toUpperCase() ?? ''] ?? FileTextIcon;
    return <Icon className="size-4 text-muted-foreground shrink-0" />;
}

export function SearchCommandDialog() {
    const { open, setOpen } = useSearchDialog();
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const navigate = useNavigate();
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);

    // Debounce the query
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query), 300);
        return () => clearTimeout(timer);
    }, [query]);

    // Global Cmd+K shortcut
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setOpen(!open);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [open, setOpen]);

    // Search query
    const { data: searchResults, isLoading } = $api.useQuery("get", "/search", {
        params: { query: { workspaceId: selectedWorkspaceId ?? '', query: debouncedQuery, limit: 10 } },
    }, { enabled: !!debouncedQuery && debouncedQuery.length >= 2 && !!selectedWorkspaceId });

    const handleSelect = useCallback(
        (item: Schemas['SearchResultItem']) => {
            setOpen(false);
            setQuery('');
            if (item.entityType?.toUpperCase() === 'MEMORY' && item.entityId) {
                navigate(`/${convertMemoryIdToSlug(item.entityId)}`);
            }
        },
        [navigate, setOpen],
    );

    const handleNavigate = useCallback(
        (path: string) => {
            setOpen(false);
            setQuery('');
            navigate(path);
        },
        [navigate, setOpen],
    );

    const handleSearchAll = useCallback(() => {
        if (query.trim().length >= 2) {
            setOpen(false);
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
            setQuery('');
        }
    }, [query, navigate, setOpen]);

    return (
        <CommandDialog
            open={open}
            onOpenChange={setOpen}
            title="Search"
            description="Search memories, spaces, and more"
        >
            <Command shouldFilter={false}>
                <CommandInput
                    placeholder="Search memories, spaces, workspaces..."
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList>
                    {debouncedQuery.length >= 2 && !isLoading && !searchResults?.items?.length && (
                        <CommandEmpty>No results found.</CommandEmpty>
                    )}

                    {/* View all results */}
                    {debouncedQuery.length >= 2 && !isLoading && (
                        <CommandGroup heading="Search">
                            <CommandItem
                                onSelect={handleSearchAll}
                                className="gap-3"
                            >
                                <SearchIcon className="size-4" />
                                <span className="font-medium">
                                    View all results for &ldquo;{query}&rdquo;
                                </span>
                            </CommandItem>
                        </CommandGroup>
                    )}

                    {/* Search results */}
                    {searchResults?.items && searchResults.items.length > 0 && (
                        <CommandGroup heading="Results">
                            {searchResults.items.map((item) => (
                                <CommandItem
                                    key={item.entityId}
                                    onSelect={() => handleSelect(item)}
                                    className="gap-3"
                                >
                                    {getEntityIcon(item.entityType)}
                                    <div className="flex flex-col min-w-0">
                                        <span className="truncate font-medium">
                                            {item.title || 'Untitled'}
                                        </span>
                                        {item.snippet && (
                                            <span className="truncate text-xs text-muted-foreground">
                                                {item.snippet}
                                            </span>
                                        )}
                                    </div>
                                    {item.entityType && (
                                        <span className="ml-auto text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                            {item.entityType}
                                        </span>
                                    )}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}

                    {isLoading && debouncedQuery.length >= 2 && (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                            Searching...
                        </div>
                    )}

                    <CommandSeparator />

                    {/* Navigation shortcuts */}
                    <CommandGroup heading="Navigation">
                        <CommandItem onSelect={() => handleNavigate('/')}>
                            <LayoutDashboardIcon className="size-4" />
                            Dashboard
                        </CommandItem>
                        <CommandItem onSelect={() => handleNavigate('/workspace')}>
                            <BoxIcon className="size-4" />
                            Workspaces
                        </CommandItem>
                        <CommandItem onSelect={() => handleNavigate('/activity')}>
                            <HourglassIcon className="size-4" />
                            Activity
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
        </CommandDialog>
    );
}
