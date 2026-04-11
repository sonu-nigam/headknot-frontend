import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@workspace/ui/components/table';
import {
    Plus,
    Search,
    User,
    MapPin,
    Building2,
    Lightbulb,
    Cpu,
    CalendarDays,
    CircleDot,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Inbox,
} from 'lucide-react';
import { useAppStore } from '@/state/store';
import { $api } from '@workspace/api-client';
import { Schemas } from '@/types/api';

// --- Helpers ---

type EntityType = NonNullable<Schemas['EntityResponse']['entityType']>;

const ENTITY_TYPE_LABELS: Record<EntityType, string> = {
    person: 'Person',
    place: 'Place',
    organization: 'Organization',
    concept: 'Concept',
    technology: 'Technology',
    event: 'Event',
    other: 'Other',
};

function entityTypeIcon(type?: EntityType) {
    const cls = 'size-4';
    switch (type) {
        case 'person':
            return <User className={cls} />;
        case 'place':
            return <MapPin className={cls} />;
        case 'organization':
            return <Building2 className={cls} />;
        case 'concept':
            return <Lightbulb className={cls} />;
        case 'technology':
            return <Cpu className={cls} />;
        case 'event':
            return <CalendarDays className={cls} />;
        default:
            return <CircleDot className={cls} />;
    }
}

function entityTypeBadgeColor(type?: EntityType) {
    switch (type) {
        case 'person':
            return 'bg-green-50 text-green-700 border-green-100 dark:bg-green-950 dark:text-green-400 dark:border-green-900';
        case 'place':
            return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900';
        case 'organization':
            return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900';
        case 'concept':
            return 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-900';
        case 'technology':
            return 'bg-cyan-50 text-cyan-700 border-cyan-100 dark:bg-cyan-950 dark:text-cyan-400 dark:border-cyan-900';
        case 'event':
            return 'bg-pink-50 text-pink-700 border-pink-100 dark:bg-pink-950 dark:text-pink-400 dark:border-pink-900';
        default:
            return 'bg-muted text-muted-foreground border-border';
    }
}

function formatDate(dateStr?: string) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

const PAGE_SIZE = 20;

// --- Main Page ---

export function EntityListPage() {
    const navigate = useNavigate();
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);

    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('');
    const [sort, setSort] = useState<'updated' | 'alpha' | 'claims'>('updated');
    const [page, setPage] = useState(0);

    const { data: entities, isLoading } = $api.useQuery(
        "get",
        "/knowledge/entities",
        { params: { query: { workspaceId: selectedWorkspaceId ?? '' } } },
        { enabled: !!selectedWorkspaceId },
    );

    const filtered = useMemo(() => {
        let list = entities ?? [];

        // Type filter
        if (typeFilter) {
            list = list.filter((e) => e.entityType === typeFilter);
        }

        // Search filter
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (e) =>
                    e.name?.toLowerCase().includes(q) ||
                    e.aliases?.some((a) => a.toLowerCase().includes(q)),
            );
        }

        // Sort
        list = [...list].sort((a, b) => {
            if (sort === 'alpha') {
                return (a.name ?? '').localeCompare(b.name ?? '');
            }
            if (sort === 'updated') {
                return (
                    new Date(b.updatedAt ?? b.createdAt ?? 0).getTime() -
                    new Date(a.updatedAt ?? a.createdAt ?? 0).getTime()
                );
            }
            return 0; // claims sort — no count available client-side, keep order
        });

        return list;
    }, [entities, typeFilter, search, sort]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
    const showFrom = filtered.length === 0 ? 0 : page * PAGE_SIZE + 1;
    const showTo = Math.min((page + 1) * PAGE_SIZE, filtered.length);

    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Entities' },
            ]}
        >
            <div className="flex-1 overflow-y-auto">
                <div className="p-6 md:p-8 pb-32 max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Knowledge Graph — Entities
                            </h1>
                            <p className="text-muted-foreground text-sm mt-1">
                                Browse and manage all entities in your knowledge
                                base.
                            </p>
                        </div>
                        <Button size="sm" className="gap-2">
                            <Plus className="size-3.5" />
                            Create Entity
                        </Button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            className="pl-10"
                            placeholder="Search entities by name or alias..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(0);
                            }}
                        />
                    </div>

                    {/* Filter Row */}
                    <div className="bg-muted rounded-xl p-3 flex flex-wrap items-center gap-3 border">
                        <select
                            value={typeFilter}
                            onChange={(e) => {
                                setTypeFilter(e.target.value);
                                setPage(0);
                            }}
                            className="bg-card border-none rounded-lg text-xs font-medium py-2 px-3 pr-8 focus:ring-1 focus:ring-ring"
                        >
                            <option value="">All Types</option>
                            {(
                                Object.keys(ENTITY_TYPE_LABELS) as EntityType[]
                            ).map((t) => (
                                <option key={t} value={t}>
                                    {ENTITY_TYPE_LABELS[t]}
                                </option>
                            ))}
                        </select>
                        <select
                            value={sort}
                            onChange={(e) =>
                                setSort(
                                    e.target.value as
                                        | 'updated'
                                        | 'alpha'
                                        | 'claims',
                                )
                            }
                            className="bg-card border-none rounded-lg text-xs font-medium py-2 px-3 pr-8 focus:ring-1 focus:ring-ring"
                        >
                            <option value="updated">Recently Updated</option>
                            <option value="alpha">Alphabetical</option>
                            <option value="claims">Claims Count</option>
                        </select>
                    </div>

                    {/* Loading */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="size-6 animate-spin text-muted-foreground" />
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && filtered.length === 0 && (
                        <div className="text-center py-16 space-y-3">
                            <div className="size-12 rounded-full bg-muted flex items-center justify-center mx-auto">
                                <Inbox className="size-6 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">
                                    No entities found
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {search || typeFilter
                                        ? 'Try adjusting your search or filters.'
                                        : 'Create your first entity to get started.'}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Table */}
                    {!isLoading && filtered.length > 0 && (
                        <div className="bg-card rounded-xl overflow-hidden shadow-sm border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="text-[11px] font-bold uppercase tracking-widest">
                                            Entity Name
                                        </TableHead>
                                        <TableHead className="text-[11px] font-bold uppercase tracking-widest">
                                            Type
                                        </TableHead>
                                        <TableHead className="text-[11px] font-bold uppercase tracking-widest">
                                            Aliases
                                        </TableHead>
                                        <TableHead className="text-[11px] font-bold uppercase tracking-widest">
                                            Created
                                        </TableHead>
                                        <TableHead className="text-[11px] font-bold uppercase tracking-widest text-right">
                                            &nbsp;
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paged.map((entity) => (
                                        <TableRow
                                            key={entity.id}
                                            className="group hover:bg-muted/50 transition-colors cursor-pointer"
                                            onClick={() =>
                                                navigate(
                                                    `/entities/${entity.id}`,
                                                )
                                            }
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                                        {entityTypeIcon(
                                                            entity.entityType,
                                                        )}
                                                    </div>
                                                    <span className="text-sm font-semibold">
                                                        {entity.name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${entityTypeBadgeColor(entity.entityType)}`}
                                                >
                                                    {ENTITY_TYPE_LABELS[
                                                        entity.entityType ??
                                                            'other'
                                                    ] ?? 'Other'}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-xs text-muted-foreground">
                                                    {entity.aliases?.length
                                                        ? entity.aliases.join(
                                                              ', ',
                                                          )
                                                        : '—'}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDate(
                                                        entity.createdAt,
                                                    )}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground"
                                                >
                                                    <ChevronRight className="size-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            <div className="bg-muted px-6 py-4 flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    Showing {showFrom}-{showTo} of{' '}
                                    {filtered.length} entities
                                </span>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-7"
                                        disabled={page === 0}
                                        onClick={() =>
                                            setPage((p) => Math.max(0, p - 1))
                                        }
                                    >
                                        <ChevronLeft className="size-4" />
                                    </Button>
                                    {Array.from(
                                        { length: Math.min(totalPages, 5) },
                                        (_, i) => i,
                                    ).map((i) => (
                                        <Button
                                            key={i}
                                            variant={
                                                i === page
                                                    ? 'default'
                                                    : 'ghost'
                                            }
                                            size="sm"
                                            className="h-7 px-2.5 text-xs font-bold"
                                            onClick={() => setPage(i)}
                                        >
                                            {i + 1}
                                        </Button>
                                    ))}
                                    {totalPages > 5 && (
                                        <>
                                            <span className="px-1 text-xs text-muted-foreground">
                                                ...
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 px-2.5 text-xs font-bold"
                                                onClick={() =>
                                                    setPage(totalPages - 1)
                                                }
                                            >
                                                {totalPages}
                                            </Button>
                                        </>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-7"
                                        disabled={page >= totalPages - 1}
                                        onClick={() =>
                                            setPage((p) =>
                                                Math.min(totalPages - 1, p + 1),
                                            )
                                        }
                                    >
                                        <ChevronRight className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
