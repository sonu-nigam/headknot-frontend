import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Separator } from '@workspace/ui/components/separator';
import { Badge } from '@workspace/ui/components/badge';
import { X, Loader2, Filter } from 'lucide-react';
import { useAppStore } from '@/state/store';
import {
    graphEntitiesQueryOptions,
    graphTemporalQueryOptions,
} from '@/query/options/graph';

interface TemporalFilterPanelProps {
    onClose: () => void;
}

export function TemporalFilterPanel({ onClose }: TemporalFilterPanelProps) {
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);

    const [entityId, setEntityId] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [shouldQuery, setShouldQuery] = useState(false);

    const { data: entities } = useQuery(
        graphEntitiesQueryOptions(selectedWorkspaceId ?? ''),
    );

    const {
        data: events,
        isLoading: eventsLoading,
        isError: eventsError,
    } = useQuery({
        ...graphTemporalQueryOptions({
            entityId,
            from: fromDate,
            to: toDate,
        }),
        enabled: shouldQuery && !!entityId && !!fromDate && !!toDate,
    });

    const handleApply = () => {
        if (entityId && fromDate && toDate) {
            setShouldQuery(true);
        }
    };

    const entityList = entities ?? [];
    const eventList = events ?? [];

    return (
        <div className="absolute top-16 left-16 w-80 bg-card rounded-xl border shadow-xl z-30 flex flex-col max-h-[calc(100%-5rem)] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="text-sm font-semibold">Temporal Filter</h3>
                <Button variant="ghost" size="icon" className="size-7" onClick={onClose}>
                    <X className="size-4" />
                </Button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto">
                {/* Entity Selector */}
                <div className="space-y-1.5">
                    <Label className="text-xs">Entity</Label>
                    <select
                        value={entityId}
                        onChange={(e) => {
                            setEntityId(e.target.value);
                            setShouldQuery(false);
                        }}
                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        <option value="">Select entity...</option>
                        {entityList.map((entity) => (
                            <option key={entity.id} value={entity.id}>
                                {entity.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* From Date */}
                <div className="space-y-1.5">
                    <Label className="text-xs">From</Label>
                    <Input
                        type="date"
                        value={fromDate}
                        onChange={(e) => {
                            setFromDate(e.target.value);
                            setShouldQuery(false);
                        }}
                        className="h-9 text-xs"
                    />
                </div>

                {/* To Date */}
                <div className="space-y-1.5">
                    <Label className="text-xs">To</Label>
                    <Input
                        type="date"
                        value={toDate}
                        onChange={(e) => {
                            setToDate(e.target.value);
                            setShouldQuery(false);
                        }}
                        className="h-9 text-xs"
                    />
                </div>

                {/* Apply */}
                <Button
                    size="sm"
                    className="w-full gap-1.5 text-xs"
                    onClick={handleApply}
                    disabled={!entityId || !fromDate || !toDate || eventsLoading}
                >
                    {eventsLoading ? (
                        <Loader2 className="size-3 animate-spin" />
                    ) : (
                        <Filter className="size-3" />
                    )}
                    Apply Filter
                </Button>

                {/* Results */}
                {eventsLoading && (
                    <div className="flex items-center justify-center py-4">
                        <Loader2 className="size-5 animate-spin text-muted-foreground" />
                    </div>
                )}

                {eventsError && (
                    <p className="text-xs text-destructive text-center py-2">
                        Failed to query temporal events.
                    </p>
                )}

                {shouldQuery && !eventsLoading && !eventsError && (
                    <>
                        <Separator />
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Results
                                </h4>
                                <Badge variant="secondary" className="text-[10px]">
                                    {eventList.length} event{eventList.length !== 1 ? 's' : ''}
                                </Badge>
                            </div>

                            {eventList.length === 0 ? (
                                <p className="text-xs text-muted-foreground text-center py-2">
                                    No events found in this range.
                                </p>
                            ) : (
                                <div className="space-y-1.5">
                                    {eventList.map((event) => (
                                        <div
                                            key={event.id}
                                            className="rounded-lg border px-3 py-2"
                                        >
                                            <p className="text-xs font-medium truncate">
                                                {event.eventType ?? 'Event'}
                                            </p>
                                            {event.validFrom && (
                                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                                    {new Date(event.validFrom).toLocaleDateString()}
                                                </p>
                                            )}
                                            {event.description && (
                                                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                                                    {event.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
