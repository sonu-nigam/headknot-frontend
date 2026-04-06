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

const schema = z.object({
    label: z.string().min(1, 'Label is required'),
    description: z.string().optional(),
    occurredAt: z.string().optional(),
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
            label: '',
            description: '',
            occurredAt: '',
            subjectId: '',
            objectId: '',
        },
    });

    const onSubmit = (values: FormValues) => {
        if (!selectedWorkspaceId) return;

        createMutation.mutate(
            {
                label: values.label,
                description: values.description || undefined,
                occurredAt: values.occurredAt
                    ? new Date(values.occurredAt).toISOString()
                    : undefined,
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
                    {/* Label */}
                    <div className="space-y-1.5">
                        <Label htmlFor="event-label" className="text-xs">
                            Label
                        </Label>
                        <Input
                            id="event-label"
                            placeholder="Event label"
                            className="h-9"
                            {...register('label')}
                        />
                        {errors.label && (
                            <p className="text-xs text-destructive">
                                {errors.label.message}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <Label htmlFor="event-desc" className="text-xs">
                            Description (optional)
                        </Label>
                        <textarea
                            id="event-desc"
                            rows={2}
                            placeholder="Describe this event..."
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                            {...register('description')}
                        />
                    </div>

                    {/* Occurred At */}
                    <div className="space-y-1.5">
                        <Label htmlFor="event-date" className="text-xs">
                            Occurred At (optional)
                        </Label>
                        <Input
                            id="event-date"
                            type="date"
                            className="h-9"
                            {...register('occurredAt')}
                        />
                    </div>

                    {/* Subject Entity */}
                    <div className="space-y-1.5">
                        <Label htmlFor="event-subject" className="text-xs">
                            Subject Entity
                        </Label>
                        <select
                            id="event-subject"
                            {...register('subjectId')}
                            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            <option value="">Select entity...</option>
                            {entityList.map((entity) => (
                                <option key={entity.id} value={entity.id}>
                                    {entity.name}
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
                        <Label htmlFor="event-object" className="text-xs">
                            Object Entity
                        </Label>
                        <select
                            id="event-object"
                            {...register('objectId')}
                            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            <option value="">Select entity...</option>
                            {entityList.map((entity) => (
                                <option key={entity.id} value={entity.id}>
                                    {entity.name}
                                </option>
                            ))}
                        </select>
                        {errors.objectId && (
                            <p className="text-xs text-destructive">
                                {errors.objectId.message}
                            </p>
                        )}
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
                            Create
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
