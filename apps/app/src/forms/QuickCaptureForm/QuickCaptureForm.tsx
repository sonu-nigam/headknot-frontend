import { ContentPolicyType } from '@workspace/types';
import { QuickCaptureFormValues } from '@/validations/form/QuickCaptureForm';
import { Button } from '@workspace/ui/components/button';
import { useFormContext } from 'react-hook-form';
import { FormField } from '@workspace/ui/components/form';
import {
    Description,
    PartOf,
    References,
    Tags,
    Title,
    TypeSelector,
    VisibilitySelector,
} from './Components';

export const contentPolicy: ContentPolicyType = {
    note: {
        allowed: [
            'text',
            'image',
            'checklist',
            'link-card',
            'file',
            'divider',
            'code',
            'quote',
        ],
    },
    highlight: {
        allowed: ['quote', 'text', 'link-card'],
        requiredOneOf: ['quote'],
    },
    link: {
        allowed: ['link-card', 'text', 'image', 'quote'],
        requiredOneOf: ['link-card'],
    },
    file: {
        allowed: ['file', 'text', 'image', 'divider'],
        requiredOneOf: ['file'],
    },
    task: { allowed: ['text', 'checklist', 'image', 'divider'] },
    event: { allowed: ['text', 'image', 'divider', 'link-card'] },
    code: { allowed: ['code', 'text', 'divider'], requiredOneOf: ['code'] },
    snippet: { allowed: ['text', 'code'] },
    image: { allowed: ['image', 'text', 'divider'], requiredOneOf: ['image'] },
    voice: { allowed: ['audio', 'text', 'divider'], requiredOneOf: ['audio'] },
};

export function QuickCaptureForm({
    onSubmit,
    onInvalid,
    formId,
}: {
    onSubmit: (data: QuickCaptureFormValues) => void | Promise<void>;
    onInvalid?: () => void;
    formId: string;
}) {
    const { register, handleSubmit, control } =
        useFormContext<QuickCaptureFormValues>();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4 py-2">
                {/* Type & Visibility */}
                <div className="flex gap-4">
                    <FormField
                        control={control}
                        name="title"
                        render={({ field }) => <TypeSelector />}
                    />
                    <FormField
                        control={control}
                        name="title"
                        render={({ field }) => <VisibilitySelector />}
                    />
                </div>

                {/* Title */}
                <div className="grid gap-2">
                    <FormField
                        control={control}
                        name="title"
                        render={({ field }) => <Title />}
                    />
                </div>

                {/* Tags */}
                <div className="grid gap-2">
                    {/*<Label>Tags</Label>*/}
                    <FormField
                        control={control}
                        name="title"
                        render={({ field }) => <Tags />}
                    />
                </div>

                {/* Content with inline blocks */}
                <div className="grid gap-2">
                    <FormField
                        control={control}
                        name="title"
                        render={({ field }) => <Description />}
                    />
                </div>

                <div className="flex gap-2">
                    <FormField
                        control={control}
                        name="title"
                        render={({ field }) => <PartOf />}
                    />
                    <FormField
                        control={control}
                        name="title"
                        render={({ field }) => <References />}
                    />
                </div>
            </div>
        </form>
    );
}

export function SubmitButton() {
    const { handleSubmit, formState } =
        useFormContext<QuickCaptureFormValues>();
    const onValid = (data: QuickCaptureFormValues) => {
        // submit logic…
    };

    return (
        <Button
            onClick={handleSubmit(onValid)}
            disabled={formState.isSubmitting}
        >
            {formState.isSubmitting ? 'Saving…' : 'Save'}
        </Button>
    );
}
