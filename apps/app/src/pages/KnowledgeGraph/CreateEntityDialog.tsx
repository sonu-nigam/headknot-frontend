import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { useCreateGraphEntity } from '@/hooks/graph/useCreateGraphEntity';
import { ENTITY_TYPE_LABELS } from './constants';

const ENTITY_TYPES = [
    'person',
    'place',
    'organization',
    'concept',
    'technology',
    'event',
    'other',
] as const;

const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    entityType: z.enum(ENTITY_TYPES),
    properties: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface CreateEntityDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateEntityDialog({
    open,
    onOpenChange,
}: CreateEntityDialogProps) {
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
    const createMutation = useCreateGraphEntity();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            entityType: 'concept',
            properties: '',
        },
    });

    const onSubmit = (values: FormValues) => {
        if (!selectedWorkspaceId) return;

        let properties: Record<string, unknown> | undefined;
        if (values.properties?.trim()) {
            try {
                properties = JSON.parse(values.properties);
            } catch {
                return;
            }
        }

        createMutation.mutate(
            {
                name: values.name,
                entityType: values.entityType,
                properties,
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
                    <DialogTitle>Create Entity</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <Label htmlFor="entity-name" className="text-xs">
                            Name
                        </Label>
                        <Input
                            id="entity-name"
                            placeholder="Entity name"
                            className="h-9"
                            {...register('name')}
                        />
                        {errors.name && (
                            <p className="text-xs text-destructive">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Entity Type */}
                    <div className="space-y-1.5">
                        <Label htmlFor="entity-type" className="text-xs">
                            Type
                        </Label>
                        <select
                            id="entity-type"
                            {...register('entityType')}
                            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            {ENTITY_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {ENTITY_TYPE_LABELS[type] ?? type}
                                </option>
                            ))}
                        </select>
                        {errors.entityType && (
                            <p className="text-xs text-destructive">
                                {errors.entityType.message}
                            </p>
                        )}
                    </div>

                    {/* Properties JSON */}
                    <div className="space-y-1.5">
                        <Label htmlFor="entity-props" className="text-xs">
                            Properties (JSON, optional)
                        </Label>
                        <textarea
                            id="entity-props"
                            rows={3}
                            placeholder='{"key": "value"}'
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                            {...register('properties')}
                        />
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
