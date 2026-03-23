import { useQuery } from '@tanstack/react-query';
import { snapshotListQueryOptions } from '@/query/options/snapshot';
import { useCheckoutSnapshot } from '@/hooks/memory/useCheckoutSnapshot';
import { useRollbackSnapshot } from '@/hooks/memory/useRollbackSnapshot';
import { Schemas } from '@/types/api';
import { formatDistanceToNow, format } from 'date-fns';
import {
    GitBranchIcon,
    RotateCcwIcon,
    LayersIcon,
    GitForkIcon,
} from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@workspace/ui/components/tooltip';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@workspace/ui/components/dialog';
import { useState } from 'react';

interface SnapshotTimelineProps {
    memoryId: string;
    onEditorReload?: () => void;
}

export function SnapshotTimeline({
    memoryId,
    onEditorReload,
}: SnapshotTimelineProps) {
    const { data: snapshots, isLoading } = useQuery(
        snapshotListQueryOptions(memoryId),
    );

    if (isLoading) {
        return (
            <div className="p-3 space-y-2 w-64">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-12 bg-muted/50 rounded-md animate-pulse"
                    />
                ))}
            </div>
        );
    }

    if (!snapshots || snapshots.length === 0) {
        return (
            <div className="p-4 text-center w-64">
                <LayersIcon className="size-6 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">
                    No snapshots yet
                </p>
            </div>
        );
    }

    // Show newest first
    const sorted = [...snapshots].reverse();

    return (
        <div className="w-72 max-h-80 overflow-y-auto">
            <div className="px-3 py-2 border-b border-border sticky top-0 bg-popover z-10">
                <p className="text-xs font-medium text-muted-foreground">
                    {snapshots.length} snapshot
                    {snapshots.length !== 1 ? 's' : ''}
                </p>
            </div>
            <div className="p-1.5 space-y-0.5">
                {sorted.map((snapshot, index) => (
                    <SnapshotItem
                        key={snapshot.id}
                        snapshot={snapshot}
                        allSnapshots={snapshots}
                        memoryId={memoryId}
                        isLatest={index === 0}
                        onEditorReload={onEditorReload}
                    />
                ))}
            </div>
        </div>
    );
}

function SnapshotItem({
    snapshot,
    allSnapshots,
    memoryId,
    isLatest,
    onEditorReload,
}: {
    snapshot: Schemas['SnapshotResponse'];
    allSnapshots: Schemas['SnapshotResponse'][];
    memoryId: string;
    isLatest: boolean;
    onEditorReload?: () => void;
}) {
    const checkout = useCheckoutSnapshot(memoryId);
    const rollback = useRollbackSnapshot(memoryId);
    const [showRollbackConfirm, setShowRollbackConfirm] = useState(false);

    const handleCheckout = () => {
        if (!snapshot.id) return;
        checkout.mutate(snapshot.id, {
            onSuccess: () => onEditorReload?.(),
        });
    };

    const handleRollback = () => {
        if (!snapshot.id) return;
        rollback.mutate(snapshot.id, {
            onSuccess: () => {
                setShowRollbackConfirm(false);
                onEditorReload?.();
            },
        });
    };

    const parentSnapshot = snapshot.parentSnapshotId
        ? allSnapshots.find((s) => s.id === snapshot.parentSnapshotId)
        : null;

    return (
        <>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors group">
                {/* Version badge */}
                <div
                    className={`size-7 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold ${
                        isLatest
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                    }`}
                >
                    {snapshot.version}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                        <p className="text-xs font-medium">
                            v{snapshot.version}
                        </p>
                        {isLatest && (
                            <span className="text-xs text-primary bg-primary/10 px-1 rounded">
                                latest
                            </span>
                        )}
                        {parentSnapshot && (
                            <span className="flex items-center gap-0.5 text-xs text-amber-500">
                                <GitForkIcon className="size-3" />
                                from v{parentSnapshot.version}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        {snapshot.committedAt && (
                            <span>
                                {formatDistanceToNow(
                                    new Date(snapshot.committedAt),
                                    { addSuffix: true },
                                )}
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions — visible on hover */}
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!isLatest && (
                        <>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-6"
                                        onClick={handleCheckout}
                                        disabled={checkout.isPending}
                                    >
                                        <GitBranchIcon className="size-3" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    Checkout
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-6 text-destructive hover:text-destructive"
                                        onClick={() =>
                                            setShowRollbackConfirm(true)
                                        }
                                    >
                                        <RotateCcwIcon className="size-3" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    Rollback
                                </TooltipContent>
                            </Tooltip>
                        </>
                    )}
                </div>
            </div>

            {/* Rollback confirmation dialog */}
            <Dialog
                open={showRollbackConfirm}
                onOpenChange={setShowRollbackConfirm}
            >
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Rollback to v{snapshot.version}?</DialogTitle>
                        <DialogDescription>
                            This is destructive. All snapshots after v
                            {snapshot.version} will be permanently deleted along
                            with their associated data.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowRollbackConfirm(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleRollback}
                            disabled={rollback.isPending}
                        >
                            {rollback.isPending
                                ? 'Rolling back...'
                                : 'Rollback'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
