import {
    QuickCaptureForm,
    SubmitButton,
} from '@/forms/QuickCaptureForm/QuickCaptureForm';
import {
    quickCaptureFormResolver,
    quickCaptureFormSchema,
    QuickCaptureFormValues,
} from '@/validations/form/QuickCaptureForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@workspace/ui/components/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@workspace/ui/components/dialog';
import { Form } from '@workspace/ui/components/form';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@workspace/ui/components/tooltip';
import { Maximize2Icon, MessageCircleQuestionIcon } from 'lucide-react';
import { PropsWithChildren } from 'react';
import { useForm } from 'react-hook-form';

export function QuickCaptureModal({ children }: PropsWithChildren) {
    const form = useForm<QuickCaptureFormValues>({
        resolver: quickCaptureFormResolver,
        mode: 'onChange', // live validity for footer button disable
        defaultValues: { title: '' },
    });

    function onSubmit(values: QuickCaptureFormValues) {
        debugger;
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
    }

    function onInvalid() {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        debugger;
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent
                className="max-w-5xl pt-4 sm:max-w-2xl"
                showCloseButton={false}
                aria-describedby="qc-desc"
            >
                <p id="qc-desc" className="sr-only">
                    Quick Capture Memory form. Provide title and optional
                    details.
                </p>
                <Form {...form}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center">
                            <span className="mr-auto">Capture memory</span>
                            <Tooltip>
                                <TooltipTrigger>
                                    <MessageCircleQuestionIcon className="size-4" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Help</p>
                                </TooltipContent>
                            </Tooltip>
                            <Button
                                size="icon"
                                className="size-8 ml-1"
                                variant="ghost"
                            >
                                <Maximize2Icon />
                            </Button>
                        </DialogTitle>
                    </DialogHeader>

                    {/* FORM BODY */}
                    <QuickCaptureForm
                        onSubmit={onSubmit}
                        onInvalid={onInvalid}
                    />

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </DialogClose>
                        <SubmitButton onSubmit={onSubmit} />
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
