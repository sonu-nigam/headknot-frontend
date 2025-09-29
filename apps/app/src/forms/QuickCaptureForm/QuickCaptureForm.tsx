import { ContentPolicyType } from '@workspace/types';
import {
    quickCaptureFormResolver,
    QuickCaptureFormValues,
} from '@/validations/form/QuickCaptureForm';
import { Button } from '@workspace/ui/components/button';
import { useForm, useFormContext } from 'react-hook-form';
import { Form, FormField } from '@workspace/ui/components/form';
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
}: {
    onSubmit: (data: QuickCaptureFormValues) => void | Promise<void>;
    onInvalid?: () => void;
}) {
    const form = useForm<QuickCaptureFormValues>({
        resolver: quickCaptureFormResolver,
        mode: 'onChange', // live validity for footer button disable
        defaultValues: { title: '' },
    });

    const { control, handleSubmit } = form;

    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit(onSubmit, onInvalid)}
                className="space-y-8"
            >
                <div className="grid gap-4 py-2">
                    {/* Title */}
                    <div className="grid gap-2">
                        <FormField
                            control={control}
                            name="title"
                            render={({ field }) => <Title {...field} />}
                        />
                    </div>

                    {/* Content with inline blocks */}
                    <div className="grid gap-2">
                        <FormField
                            control={control}
                            name="description"
                            render={({ field }) => <Description {...field} />}
                        />
                    </div>

                    {/* Tags */}
                    <div className="grid gap-2">
                        {/*<Label>Tags</Label>*/}
                        <Tags />
                    </div>

                    <div className="flex gap-2">
                        <PartOf />
                        <References />
                        {/*<FormField
                            control={control}
                            name="title"
                            render={({ field }) => <PartOf />}
                        />*/}
                        {/*<FormField
                            control={control}
                            name="title"
                            render={({ field }) => <References />}
                        />*/}
                    </div>
                </div>
                <div className="flex gap-3 items-center justify-between">
                    <FormField
                        control={control}
                        name="visibility"
                        render={({ field }) => (
                            <VisibilitySelector {...field} />
                        )}
                    />
                    <Button type="reset" className="ml-auto">
                        Reset
                    </Button>
                    <Button type="submit">Save</Button>
                </div>
            </form>
        </Form>
    );
}

export function SubmitButton({
    onSubmit,
}: {
    onSubmit: (data: QuickCaptureFormValues) => void | Promise<void>;
}) {
    const { handleSubmit, formState } =
        useFormContext<QuickCaptureFormValues>();

    return (
        <Button
            onClick={handleSubmit(onSubmit)}
            disabled={formState.isSubmitting}
        >
            {formState.isSubmitting ? 'Saving…' : 'Save'}
        </Button>
    );
}
