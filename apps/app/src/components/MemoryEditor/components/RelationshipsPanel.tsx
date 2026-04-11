import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@workspace/ui/hooks/use-mobile';
import { Sheet, SheetContent, SheetTitle } from '@workspace/ui/components/sheet';
import { useRelationshipsPanelStore } from '@/state/relationshipsPanelStore';
import { $api } from '@workspace/api-client';
import { Schemas } from '@/types/api';
import {
    NetworkIcon,
    UserIcon,
    MapPinIcon,
    BuildingIcon,
    BrainIcon,
    CpuIcon,
    CalendarIcon,
    CircleDotIcon,
    ArrowRightIcon,
    LinkIcon,
    FileTextIcon,
    ChevronRightIcon,
    ExternalLinkIcon,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { convertMemoryIdToSlug } from '@/lib/memoryUtils';

const ENTITY_TYPE_ICONS: Record<string, React.ElementType> = {
    person: UserIcon,
    place: MapPinIcon,
    organization: BuildingIcon,
    concept: BrainIcon,
    technology: CpuIcon,
    event: CalendarIcon,
    other: CircleDotIcon,
};

const RELATIONSHIP_COLORS: Record<string, string> = {
    supports: 'text-green-500 bg-green-500/10',
    contradicts: 'text-red-500 bg-red-500/10',
    references: 'text-blue-500 bg-blue-500/10',
    derives_from: 'text-purple-500 bg-purple-500/10',
    related: 'text-amber-500 bg-amber-500/10',
};

export function RelationshipsPanel() {
    const isMobile = useIsMobile();
    const { view, memoryId, activeBlockId, close } =
        useRelationshipsPanelStore();

    const [slotEl, setSlotEl] = useState<HTMLElement | null>(null);
    useEffect(() => {
        const el = document.getElementById('context-panel-slot');
        setSlotEl(el);
    }, []);

    if (!view) return null;

    const content = (
        <div className="flex h-full flex-col">
            {view === 'memory' && memoryId && (
                <MemoryRelationshipsView memoryId={memoryId} />
            )}
            {view === 'block' && memoryId && activeBlockId && (
                <BlockRelationshipsView
                    memoryId={memoryId}
                    blockId={activeBlockId}
                />
            )}
        </div>
    );

    if (isMobile) {
        return (
            <Sheet
                open={!!view}
                onOpenChange={(open) => {
                    if (!open) close();
                }}
            >
                <SheetContent
                    side="right"
                    className="w-80 p-0 bg-sidebar text-sidebar-foreground [&>button]:hidden"
                >
                    <SheetTitle className="sr-only">Relationships</SheetTitle>
                    {content}
                </SheetContent>
            </Sheet>
        );
    }

    if (!slotEl) return null;
    return createPortal(content, slotEl);
}

// ── Memory-level view: shows entities + their linked memories ────────────

function MemoryRelationshipsView({ memoryId }: { memoryId: string }) {
    const { data: entityLinks, isLoading } = $api.useQuery(
        "get",
        "/knowledge/entities/by-memory/{memoryId}",
        { params: { path: { memoryId } } },
        { enabled: !!memoryId },
    );

    if (isLoading) {
        return (
            <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-16 bg-muted/50 rounded-lg animate-pulse"
                    />
                ))}
            </div>
        );
    }

    if (!entityLinks || entityLinks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <NetworkIcon className="size-8 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">
                    No entities linked to this memory yet.
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                    Entities and relationships are extracted automatically as
                    you write.
                </p>
            </div>
        );
    }

    return (
        <div className="p-3 space-y-1.5">
            {entityLinks.map((link) => (
                <EntityCard
                    key={link.entityId}
                    entityId={link.entityId!}
                    currentMemoryId={memoryId}
                />
            ))}
        </div>
    );
}

// ── Entity card: entity details, linked memories, and claims ─────────────

function EntityCard({
    entityId,
    currentMemoryId,
}: {
    entityId: string;
    currentMemoryId: string;
}) {
    const { data: entity, isLoading } = $api.useQuery(
        "get",
        "/knowledge/entities/{entityId}",
        { params: { path: { entityId } } },
        { enabled: !!entityId },
    );
    const { data: claims } = $api.useQuery(
        "get",
        "/knowledge/claims",
        { params: { query: { entityId } } },
        { enabled: !!entityId },
    );
    const { data: memoryLinks } = $api.useQuery(
        "get",
        "/knowledge/entities/{entityId}/memories",
        { params: { path: { entityId } } },
        { enabled: !!entityId },
    );
    const [expanded, setExpanded] = useState(false);

    // Filter out the current memory to show only connected ones
    const linkedMemories =
        memoryLinks?.filter((link) => link.memoryId !== currentMemoryId) ?? [];

    if (isLoading) {
        return (
            <div className="h-12 bg-muted/50 rounded-lg animate-pulse" />
        );
    }

    if (!entity) return null;

    const Icon =
        ENTITY_TYPE_ICONS[entity.entityType ?? 'other'] ?? CircleDotIcon;

    return (
        <div className="rounded-lg border border-border/50 overflow-hidden">
            <button
                className="w-full flex items-center gap-2.5 p-2.5 hover:bg-muted/50 transition-colors text-left"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="p-1.5 rounded-md bg-primary/10">
                    <Icon className="size-3.5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                        {entity.name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                        {entity.entityType}
                        {linkedMemories.length > 0 && (
                            <span>
                                {' '}
                                &middot; {linkedMemories.length} linked memor
                                {linkedMemories.length !== 1 ? 'ies' : 'y'}
                            </span>
                        )}
                    </p>
                </div>
                <ChevronRightIcon
                    className={`size-3.5 text-muted-foreground transition-transform ${expanded ? 'rotate-90' : ''}`}
                />
            </button>

            {expanded && (
                <div className="border-t border-border/50">
                    {/* Linked memories section */}
                    {linkedMemories.length > 0 && (
                        <div className="px-2.5 py-2 space-y-1">
                            <p className="text-xs font-medium text-muted-foreground px-0.5 mb-1">
                                Connected memories
                            </p>
                            {linkedMemories.map((link) => (
                                <LinkedMemoryCard
                                    key={link.memoryId}
                                    memoryId={link.memoryId!}
                                />
                            ))}
                        </div>
                    )}

                    {/* Claims section */}
                    {claims && claims.length > 0 && (
                        <div
                            className={`px-2.5 py-2 space-y-1.5 ${linkedMemories.length > 0 ? 'border-t border-border/30' : ''}`}
                        >
                            <p className="text-xs font-medium text-muted-foreground px-0.5 mb-1">
                                Claims ({claims.length})
                            </p>
                            {claims.map((claim) => (
                                <ClaimItem key={claim.id} claim={claim} />
                            ))}
                        </div>
                    )}

                    {linkedMemories.length === 0 &&
                        (!claims || claims.length === 0) && (
                            <div className="px-2.5 py-3 text-center">
                                <p className="text-xs text-muted-foreground">
                                    No connections yet
                                </p>
                            </div>
                        )}
                </div>
            )}
        </div>
    );
}

// ── Linked memory card: clickable snapshot that navigates to the memory ──

function LinkedMemoryCard({ memoryId }: { memoryId: string }) {
    const navigate = useNavigate();
    const close = useRelationshipsPanelStore((s) => s.close);
    const { data: memory, isLoading } = $api.useQuery("get", "/memory/{id}", {
        params: { path: { id: memoryId } },
    });

    if (isLoading) {
        return (
            <div className="h-10 bg-muted/30 rounded-md animate-pulse" />
        );
    }

    // Extract a title from the first block's text, or fall back to "Untitled"
    const firstBlock = memory?.blocks?.[0];
    const title =
        firstBlock?.text?.slice(0, 60) || 'Untitled memory';
    const blockCount = memory?.blocks?.length ?? 0;

    const handleClick = () => {
        close();
        navigate(`/${convertMemoryIdToSlug(memoryId)}`);
    };

    return (
        <button
            onClick={handleClick}
            className="w-full flex items-center gap-2.5 p-2 rounded-md hover:bg-primary/5 border border-border/30 hover:border-primary/30 transition-colors text-left group"
        >
            <div className="p-1 rounded bg-muted">
                <FileTextIcon className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">
                    {title}
                </p>
                <p className="text-xs text-muted-foreground">
                    {blockCount} block{blockCount !== 1 ? 's' : ''}
                    {memory?.createdAt && (
                        <span>
                            {' '}
                            &middot;{' '}
                            {formatDistanceToNow(new Date(memory.createdAt), {
                                addSuffix: true,
                            })}
                        </span>
                    )}
                </p>
            </div>
            <ExternalLinkIcon className="size-3 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0" />
        </button>
    );
}

// ── Claim item: shows claim text and its relationships ───────────────────

function ClaimItem({ claim }: { claim: Schemas['ClaimResponse'] }) {
    const { data: relationships } = $api.useQuery(
        "get",
        "/relationships",
        { params: { query: { claimId: claim.id! } } },
        { enabled: !!claim.id },
    );

    return (
        <div className="space-y-1">
            <div className="flex items-start gap-2 py-1">
                <FileTextIcon className="size-3 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-xs leading-relaxed">{claim.claimText}</p>
            </div>

            {relationships && relationships.length > 0 && (
                <div className="ml-5 space-y-1">
                    {relationships.map((rel) => (
                        <RelationshipBadge key={rel.id} relationship={rel} />
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Relationship badge ───────────────────────────────────────────────────

function RelationshipBadge({
    relationship,
}: {
    relationship: Schemas['RelationshipResponse'];
}) {
    const colorClass =
        RELATIONSHIP_COLORS[relationship.type ?? 'related'] ??
        RELATIONSHIP_COLORS.related;

    return (
        <div className="flex items-center gap-1.5">
            <ArrowRightIcon className={`size-3 ${colorClass.split(' ')[0]}`} />
            <span
                className={`text-xs px-1.5 py-0.5 rounded ${colorClass} capitalize`}
            >
                {relationship.type?.replace('_', ' ')}
            </span>
            {relationship.confidence != null && (
                <span className="text-xs text-muted-foreground">
                    {Math.round(relationship.confidence * 100)}%
                </span>
            )}
            <StatusDot status={relationship.status} />
        </div>
    );
}

function StatusDot({
    status,
}: {
    status?: 'SUGGESTED' | 'CONFIRMED' | 'REJECTED';
}) {
    if (!status || status === 'CONFIRMED') return null;
    const color =
        status === 'SUGGESTED'
            ? 'bg-amber-400'
            : status === 'REJECTED'
              ? 'bg-red-400'
              : 'bg-gray-400';
    return (
        <span
            className={`size-1.5 rounded-full ${color}`}
            title={status.toLowerCase()}
        />
    );
}

// ── Block-level view: shows claims for a specific block ──────────────────

function BlockRelationshipsView({
    memoryId,
    blockId,
}: {
    memoryId: string;
    blockId: string;
}) {
    const { data: claims, isLoading } = $api.useQuery(
        "get",
        "/knowledge/claims",
        { params: { query: { blockId } } },
        { enabled: !!blockId },
    );

    if (isLoading) {
        return (
            <div className="p-4 space-y-3">
                {[1, 2].map((i) => (
                    <div
                        key={i}
                        className="h-12 bg-muted/50 rounded-lg animate-pulse"
                    />
                ))}
            </div>
        );
    }

    if (!claims || claims.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <LinkIcon className="size-8 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">
                    No connections found for this block.
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                    Claims and relationships are extracted automatically.
                </p>
            </div>
        );
    }

    return (
        <div className="p-3 space-y-2">
            <p className="text-xs text-muted-foreground px-1 mb-2">
                {claims.length} claim{claims.length !== 1 ? 's' : ''} from this
                block
            </p>
            {claims.map((claim) => (
                <div
                    key={claim.id}
                    className="rounded-lg border border-border/50 p-2.5"
                >
                    <ClaimItem claim={claim} />
                    {claim.entityId && (
                        <div className="mt-2 pt-2 border-t border-border/30">
                            <EntityMiniCard
                                entityId={claim.entityId}
                                currentMemoryId={memoryId}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

// ── Compact entity display inside block view (with linked memories) ──────

function EntityMiniCard({
    entityId,
    currentMemoryId,
}: {
    entityId: string;
    currentMemoryId: string;
}) {
    const navigate = useNavigate();
    const close = useRelationshipsPanelStore((s) => s.close);
    const { data: entity } = $api.useQuery(
        "get",
        "/knowledge/entities/{entityId}",
        { params: { path: { entityId } } },
        { enabled: !!entityId },
    );
    const { data: memoryLinks } = $api.useQuery(
        "get",
        "/knowledge/entities/{entityId}/memories",
        { params: { path: { entityId } } },
        { enabled: !!entityId },
    );

    const linkedMemories =
        memoryLinks?.filter((link) => link.memoryId !== currentMemoryId) ?? [];

    if (!entity) return null;

    const Icon =
        ENTITY_TYPE_ICONS[entity.entityType ?? 'other'] ?? CircleDotIcon;

    return (
        <div className="space-y-1.5">
            <div className="flex items-center gap-2">
                <Icon className="size-3 text-primary" />
                <span className="text-xs font-medium">{entity.name}</span>
                <span className="text-xs text-muted-foreground capitalize">
                    {entity.entityType}
                </span>
            </div>
            {linkedMemories.length > 0 && (
                <div className="ml-5 space-y-1">
                    {linkedMemories.slice(0, 3).map((link) => (
                        <LinkedMemoryInline
                            key={link.memoryId}
                            memoryId={link.memoryId!}
                            onNavigate={() => {
                                close();
                                navigate(`/${convertMemoryIdToSlug(link.memoryId!)}`);
                            }}
                        />
                    ))}
                    {linkedMemories.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                            +{linkedMemories.length - 3} more
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

// ── Inline linked memory (compact, for block view) ───────────────────────

function LinkedMemoryInline({
    memoryId,
    onNavigate,
}: {
    memoryId: string;
    onNavigate: () => void;
}) {
    const { data: memory } = $api.useQuery("get", "/memory/{id}", {
        params: { path: { id: memoryId } },
    });

    const title =
        memory?.blocks?.[0]?.text?.slice(0, 50) || 'Untitled memory';

    return (
        <button
            onClick={onNavigate}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
            <ExternalLinkIcon className="size-2.5 shrink-0" />
            <span className="truncate">{title}</span>
        </button>
    );
}
