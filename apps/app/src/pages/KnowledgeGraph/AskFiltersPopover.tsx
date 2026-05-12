import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Separator } from '@workspace/ui/components/separator';
import { $api } from '@workspace/api-client';
import { useAppStore } from '@/state/store';
import type { Schemas } from '@/types/api';

type AskFilters = Schemas['AskFiltersDto'];

interface AskFiltersPopoverProps {
    anchorRef: React.RefObject<HTMLElement | null>;
    open: boolean;
    onClose: () => void;
    filters: AskFilters;
    onChange: (next: AskFilters) => void;
}

function toIsoStart(dateStr: string): string | undefined {
    if (!dateStr) return undefined;
    return new Date(`${dateStr}T00:00:00Z`).toISOString();
}

function toIsoEnd(dateStr: string): string | undefined {
    if (!dateStr) return undefined;
    return new Date(`${dateStr}T23:59:59Z`).toISOString();
}

function fromIso(iso?: string): string {
    if (!iso) return '';
    return iso.slice(0, 10);
}

export function AskFiltersPopover({
    anchorRef,
    open,
    onClose,
    filters,
    onChange,
}: AskFiltersPopoverProps) {
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
    const popoverRef = useRef<HTMLDivElement>(null);
    const [entityTypeDraft, setEntityTypeDraft] = useState('');

    const { data: integrations } = $api.useQuery(
        'get',
        '/integrations/workspace/{workspaceId}',
        { params: { path: { workspaceId: selectedWorkspaceId ?? '' } } },
        {
            enabled: !!selectedWorkspaceId && open,
            staleTime: Infinity,
            gcTime: Infinity,
        },
    );

    const sourceAppOptions: string[] = Array.from(
        new Set(
            ((integrations ?? []) as Schemas['IntegrationResponse'][])
                .map((i) => (i.type ?? '').toLowerCase().replace(/_/g, '-'))
                .filter((s): s is string => Boolean(s)),
        ),
    );

    useEffect(() => {
        if (!open) return;
        const handleClick = (e: MouseEvent) => {
            const target = e.target as Node;
            if (popoverRef.current?.contains(target)) return;
            if (anchorRef.current?.contains(target)) return;
            onClose();
        };
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleKey);
        };
    }, [open, onClose, anchorRef]);

    if (!open) return null;

    const toggleSourceApp = (app: string) => {
        const current = filters.sourceApps ?? [];
        const next = current.includes(app)
            ? current.filter((a) => a !== app)
            : [...current, app];
        onChange({
            ...filters,
            sourceApps: next.length ? next : undefined,
        });
    };

    const addEntityType = () => {
        const value = entityTypeDraft.trim();
        if (!value) return;
        const current = filters.entityTypes ?? [];
        if (current.includes(value)) {
            setEntityTypeDraft('');
            return;
        }
        onChange({
            ...filters,
            entityTypes: [...current, value],
        });
        setEntityTypeDraft('');
    };

    const removeEntityType = (value: string) => {
        const next = (filters.entityTypes ?? []).filter((t) => t !== value);
        onChange({
            ...filters,
            entityTypes: next.length ? next : undefined,
        });
    };

    const clearAll = () => {
        onChange({});
        setEntityTypeDraft('');
    };

    const minConfidence = filters.minConfidence ?? 0;

    return (
        <div
            ref={popoverRef}
            className="absolute bottom-full mb-2 left-0 w-96 max-h-[60vh] overflow-y-auto bg-popover text-popover-foreground rounded-xl border shadow-xl z-40 p-4 space-y-4"
            role="dialog"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Filters</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={clearAll}
                >
                    Clear all
                </Button>
            </div>

            <Separator />

            {/* Source apps */}
            <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Source apps
                </Label>
                {sourceAppOptions.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                        No connected integrations.
                    </p>
                ) : (
                    <div className="flex flex-wrap gap-1.5">
                        {sourceAppOptions.map((app) => {
                            const active = (filters.sourceApps ?? []).includes(app);
                            return (
                                <button
                                    key={app}
                                    type="button"
                                    onClick={() => toggleSourceApp(app)}
                                    className={
                                        active
                                            ? 'rounded-full border border-primary bg-primary text-primary-foreground text-xs px-2.5 py-1 capitalize'
                                            : 'rounded-full border bg-muted text-muted-foreground hover:bg-muted/70 text-xs px-2.5 py-1 capitalize'
                                    }
                                >
                                    {app}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Entity types */}
            <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Entity types
                </Label>
                <div className="flex gap-1.5">
                    <Input
                        value={entityTypeDraft}
                        onChange={(e) => setEntityTypeDraft(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                addEntityType();
                            }
                        }}
                        placeholder="e.g. Person, Project"
                        className="h-8 text-xs"
                    />
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs"
                        onClick={addEntityType}
                        disabled={!entityTypeDraft.trim()}
                    >
                        Add
                    </Button>
                </div>
                {(filters.entityTypes ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {(filters.entityTypes ?? []).map((t) => (
                            <Badge
                                key={t}
                                variant="secondary"
                                className="gap-1 pr-1 text-xs"
                            >
                                {t}
                                <button
                                    type="button"
                                    onClick={() => removeEntityType(t)}
                                    className="hover:text-foreground"
                                    aria-label={`Remove ${t}`}
                                >
                                    <X className="size-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            {/* Ingested date range */}
            <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Ingested
                </Label>
                <div className="grid grid-cols-2 gap-2">
                    <Input
                        type="date"
                        value={fromIso(filters.ingestedAfter)}
                        onChange={(e) =>
                            onChange({
                                ...filters,
                                ingestedAfter: toIsoStart(e.target.value),
                            })
                        }
                        className="h-8 text-xs"
                    />
                    <Input
                        type="date"
                        value={fromIso(filters.ingestedBefore)}
                        onChange={(e) =>
                            onChange({
                                ...filters,
                                ingestedBefore: toIsoEnd(e.target.value),
                            })
                        }
                        className="h-8 text-xs"
                    />
                </div>
            </div>

            {/* Fact valid date range */}
            <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Fact valid
                </Label>
                <div className="grid grid-cols-2 gap-2">
                    <Input
                        type="date"
                        value={fromIso(filters.factValidAfter)}
                        onChange={(e) =>
                            onChange({
                                ...filters,
                                factValidAfter: toIsoStart(e.target.value),
                            })
                        }
                        className="h-8 text-xs"
                    />
                    <Input
                        type="date"
                        value={fromIso(filters.factValidBefore)}
                        onChange={(e) =>
                            onChange({
                                ...filters,
                                factValidBefore: toIsoEnd(e.target.value),
                            })
                        }
                        className="h-8 text-xs"
                    />
                </div>
            </div>

            {/* Min confidence */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Min confidence
                    </Label>
                    <span className="text-xs font-mono text-muted-foreground">
                        {minConfidence.toFixed(2)}
                    </span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={minConfidence}
                    onChange={(e) =>
                        onChange({
                            ...filters,
                            minConfidence:
                                e.target.value === '0'
                                    ? undefined
                                    : parseFloat(e.target.value),
                        })
                    }
                    className="w-full accent-primary"
                />
            </div>
        </div>
    );
}

export function countActiveFilters(filters: Schemas['AskFiltersDto']): number {
    let count = 0;
    if (filters.sourceApps?.length) count += 1;
    if (filters.sourceIds?.length) count += 1;
    if (filters.entityTypes?.length) count += 1;
    if (filters.ingestedAfter || filters.ingestedBefore) count += 1;
    if (filters.factValidAfter || filters.factValidBefore) count += 1;
    if (filters.minConfidence !== undefined) count += 1;
    return count;
}
