import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@workspace/ui/components/dialog';
import { Button } from '@workspace/ui/components/button';
import { Textarea } from '@workspace/ui/components/textarea';
import { Loader2, AlertTriangle, FileText } from 'lucide-react';
import { Schemas } from '@/types/api';
import { $api } from '@workspace/api-client';
import { useResolveConflict } from '@/hooks/conflicts/useResolveConflict';

type ResolutionChoice = 'PREFER_A' | 'PREFER_B' | 'MERGE';

interface ResolveConflictDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    conflict: Schemas['ConflictResponse'];
}

function ClaimCard({
    label,
    claim,
    isLoading,
}: {
    label: string;
    claim?: Schemas['ClaimResponse'];
    isLoading: boolean;
}) {
    const confidence = Math.round((claim?.confidence ?? 0) * 100);

    return (
        <div className="bg-muted/50 rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {label}
                </span>
                {claim?.lifecycleStatus && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground border">
                        {claim.lifecycleStatus}
                    </span>
                )}
            </div>
            {isLoading ? (
                <div className="flex items-center justify-center py-4">
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                </div>
            ) : claim ? (
                <>
                    <p className="text-sm leading-relaxed">
                        {claim.claimText || 'No claim text available'}
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="w-16 bg-muted h-1.5 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full ${
                                    confidence >= 70
                                        ? 'bg-green-400'
                                        : confidence >= 40
                                          ? 'bg-yellow-400'
                                          : 'bg-red-400'
                                }`}
                                style={{ width: `${confidence}%` }}
                            />
                        </div>
                        <span className="text-xs font-mono font-bold">
                            {confidence}% confidence
                        </span>
                    </div>
                </>
            ) : (
                <p className="text-xs text-muted-foreground italic">
                    Claim not found
                </p>
            )}
        </div>
    );
}

export function ResolveConflictDialog({
    open,
    onOpenChange,
    conflict,
}: ResolveConflictDialogProps) {
    const [choice, setChoice] = useState<ResolutionChoice | null>(null);
    const [note, setNote] = useState('');

    const resolve = useResolveConflict();

    const { data: claimA, isLoading: loadingA } = $api.useQuery(
        "get",
        "/knowledge/claims/{claimId}",
        { params: { path: { claimId: conflict.sourceClaimId ?? '' } } },
        { enabled: open && !!conflict.sourceClaimId },
    );

    const { data: claimB, isLoading: loadingB } = $api.useQuery(
        "get",
        "/knowledge/claims/{claimId}",
        { params: { path: { claimId: conflict.targetClaimId ?? '' } } },
        { enabled: open && !!conflict.targetClaimId },
    );

    const handleResolve = () => {
        if (!conflict.id || !choice) return;
        resolve.mutate({ params: { path: { id: conflict.id } } }, {
            onSuccess: () => {
                setChoice(null);
                setNote('');
                onOpenChange(false);
            },
        });
    };

    const handleCancel = () => {
        setChoice(null);
        setNote('');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="size-5 text-destructive" />
                        Resolve Conflict
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Conflict description */}
                    {conflict.description && (
                        <p className="text-sm text-muted-foreground">
                            {conflict.description}
                        </p>
                    )}

                    {/* Claim A */}
                    <div className="space-y-2">
                        <ClaimCard
                            label="Claim A (Source)"
                            claim={claimA}
                            isLoading={loadingA}
                        />
                        <label className="flex items-center gap-2 cursor-pointer px-1">
                            <input
                                type="radio"
                                name="resolution"
                                checked={choice === 'PREFER_A'}
                                onChange={() => setChoice('PREFER_A')}
                                className="accent-primary"
                            />
                            <span className="text-sm font-medium">
                                Prefer Claim A
                            </span>
                        </label>
                    </div>

                    {/* Claim B */}
                    <div className="space-y-2">
                        <ClaimCard
                            label="Claim B (Target)"
                            claim={claimB}
                            isLoading={loadingB}
                        />
                        <label className="flex items-center gap-2 cursor-pointer px-1">
                            <input
                                type="radio"
                                name="resolution"
                                checked={choice === 'PREFER_B'}
                                onChange={() => setChoice('PREFER_B')}
                                className="accent-primary"
                            />
                            <span className="text-sm font-medium">
                                Prefer Claim B
                            </span>
                        </label>
                    </div>

                    {/* Merge option */}
                    <label className="flex items-center gap-2 cursor-pointer px-1 py-2 rounded-lg border bg-muted/30">
                        <input
                            type="radio"
                            name="resolution"
                            checked={choice === 'MERGE'}
                            onChange={() => setChoice('MERGE')}
                            className="accent-primary ml-1"
                        />
                        <FileText className="size-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                            Merge -- Both Valid
                        </span>
                    </label>

                    {/* Resolution note */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Resolution Note
                        </label>
                        <Textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Explain the rationale for this resolution..."
                            rows={3}
                            className="resize-none text-sm"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="ghost"
                        onClick={handleCancel}
                        disabled={resolve.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleResolve}
                        disabled={!choice || resolve.isPending}
                    >
                        {resolve.isPending && (
                            <Loader2 className="size-4 mr-2 animate-spin" />
                        )}
                        Resolve Conflict
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
