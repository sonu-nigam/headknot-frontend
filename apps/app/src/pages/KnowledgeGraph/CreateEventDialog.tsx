import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@workspace/ui/components/dialog';
import { Loader2 } from 'lucide-react';
import { useAppStore } from '@/state/store';
import { useCreateGraphEvent } from '@/hooks/graph/useCreateGraphEvent';
import { graphEntitiesQueryOptions } from '@/query/options/graph';

const EVENT_TYPES = [
    'WORKS_AT',
    'FOUNDED',
    'ACQUIRED',
    'MEMBER_OF',
    'LOCATED_IN',
    'RELATED_TO',
    'CAUSED',
    'PARTICIPATED_IN',
    'PRODUCED',
    'USES',
    'CUSTOM',
] as const;

const TEMPORAL_TYPES = ['ATEMPORAL', 'STATIC', 'DYNAMIC'] as const;

const schema = z.object({
    eventType: z.enum(EVENT_TYPES),
    description: z.string().optional(),
    confidence: z.coerce.number().min(0).max(1).optional(),
    validFrom: z.string().optional(),
    validTo: z.string().optional(),
    temporalType: z.enum(TEMPORAL_TYPES),
    subjectId: z.string().min(1, 'Subject entity is required'),
    objectId: z.string().min(1, 'Object entity is required'),
});

type FormValues = z.infer<typeof schema>;

interface CreateEventDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateEventDialog({
    open,
    onOpenChange,
}: CreateEventDialogProps) {
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
    const createMutation = useCreateGraphEvent();

    const { data: entities } = useQuery(
        graphEntitiesQueryOptions(selectedWorkspaceId ?? ''),
    );

    const entityList = entities ?? [];

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            eventType: 'RELATED_TO',
            description: '',
            confidence: 0.9,
            validFrom: '',
            validTo: '',
            temporalType: 'STATIC',
            subjectId: '',
            objectId: '',
        },
    });

    const onSubmit = (values: FormValues) => {
        if (!selectedWorkspaceId) return;

        createMutation.mutate(
            {
                eventType: values.eventType,
                description: values.description || undefined,
                confidence: values.confidence,
                validFrom: values.validFrom
                    ? new Date(values.validFrom).toISOString()
                    : undefined,
                validTo: values.validTo
                    ? new Date(values.validTo).toISOString()
                    : undefined,
                temporalType: values.temporalType,
                subjectId: values.subjectId,
                objectId: values.objectId,
                workspaceId: selectedWorkspaceId,
            },
            {
                onSuccess: () => {
                    reset();
                    onOpenChange(false);
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Event</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Event Type */}
                    <div className="space-y-1.5">
                        <Label htmlFor="event-type" className="text-xs">
                            Event Type
                        </Label>
                        <select
                            id="event-type"
                            {...register('eventType')}
                            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            {EVENT_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type.replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>
                        {errors.eventType && (
                            <p className="text-xs text-destructive">
                                {errors.eventType.message}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <Label htmlFor="event-desc" className="text-xs">
                            Description
                        </Label>
                        <textarea
                            id="event-desc"
                            rows={2}
                            placeholder="Describe the event..."
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                            {...register('description')}
                        />
                    </div>

                    {/* Subject Entity */}
                    <div className="space-y-1.5">
                        <Label htmlFor="subject" className="text-xs">
                            Subject Entity
                        </Label>
                        <select
                            id="subject"
                            {...register('subjectId')}
                            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            <option value="">Select subject...</option>
                            {entityList.map((entity) => (
                                <option key={entity.id} value={entity.id}>
                                    {entity.name} ({entity.entityType})
                                </option>
                            ))}
                        </select>
                        {errors.subjectId && (
                            <p className="text-xs text-destructive">
                                {errors.subjectId.message}
                            </p>
                        )}
                    </div>

                    {/* Object Entity */}
                    <div className="space-y-1.5">
                        <Label htmlFor="object" className="text-xs">
                            Object Entity
                        </Label>
                        <select
                            id="object"
                            {...register('objectId')}
                            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            <option value="">Select object...</option>
                            {entityList.map((entity) => (
                                <option key={entity.id} value={entity.id}>
                                    {entity.name} ({entity.entityType})
                                </option>
                            ))}
                        </select>
                        {errors.objectId && (
                            <p className="text-xs text-destructive">
                                {errors.objectId.message}
                            </p>
                        )}
                    </div>

                    {/* Confidence + Temporal Type */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="confidence" className="text-xs">
                                Confidence
                            </Label>
                            <Input
                                id="confidence"
                                type="number"
                                step="0.01"
                                min="0"
                                max="1"
                                className="h-9"
                                {...register('confidence')}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="temporal-type" className="text-xs">
                                Temporal Type
                            </Label>
                            <select
                                id="temporal-type"
                                {...register('temporalType')}
                                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                {TEMPORAL_TYPES.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Valid From / To */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="valid-from" className="text-xs">
                                Valid From
                            </Label>
                            <Input
                                id="valid-from"
                                type="date"
                                className="h-9"
                                {...register('validFrom')}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="valid-to" className="text-xs">
                                Valid To
                            </Label>
                            <Input
                                id="valid-to"
                                type="date"
                                className="h-9"
                                {...register('validTo')}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={createMutation.isPending}
                            className="gap-1.5"
                        >
                            {createMutation.isPending && (
                                <Loader2 className="size-3 animate-spin" />
                            )}
                            Create Event
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
