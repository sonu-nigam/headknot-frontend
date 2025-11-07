import { QuickCaptureForm } from '@/forms/QuickCaptureForm/QuickCaptureForm';
import { draftByWorkspaceIdQueryOptions } from '@/query/options/draft';
import { myWorkspacesQueryOptions } from '@/query/options/workspace';
import { QuickCaptureFormValues } from '@/validations/form/QuickCaptureForm';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@workspace/ui/components/tabs';
import { useMemo, useState } from 'react';

export function QuickCapture() {
    const [activeTab, setActiveTab] = useState('note');
    const { data: activeWorkspace, isLoading: workspaceLoading } = useQuery({
        ...myWorkspacesQueryOptions,
        select: (data) => data?.find((workspace) => workspace.active),
    });

    const { data: draft, isLoading: draftLoading } = useQuery({
        ...draftByWorkspaceIdQueryOptions(activeWorkspace?.id || ''),
        enabled: !!activeWorkspace,
    });

    const memoryId = draft?.id;

    const capture = useMutation({
        mutationFn: async ({ description, title }: QuickCaptureFormValues) => {
            const { error, data } = await api.POST('/memory', {
                body: {
                    type: activeTab,
                    title,
                    workspaceId: activeWorkspace?.id || '',
                    blocks: [],
                },
            });
            if (error) throw error;
            return data;
        },
    });

    const onSubmit = async (values: QuickCaptureFormValues) => {
        await capture.mutateAsync(values);
    };

    return (
        <div className="min-h-96 mt-20">
            <div className="max-w-4xl mx-auto px-3">
                {/*<h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
                    Quick Capture
                </h1>*/}
                <Tabs
                    defaultValue="note"
                    className="mt-10"
                    onValueChange={(value) => setActiveTab(value)}
                >
                    <TabsList className="mx-auto">
                        <TabsTrigger value="note">Note</TabsTrigger>
                        <TabsTrigger value="task">Task</TabsTrigger>
                        <TabsTrigger value="decision">Decision</TabsTrigger>
                        <TabsTrigger value="research">Research</TabsTrigger>
                        <TabsTrigger value="canvas">Canvas</TabsTrigger>
                        <TabsTrigger value="timeline">Timeline</TabsTrigger>
                        <TabsTrigger value="artifact">Artifact</TabsTrigger>
                    </TabsList>
                </Tabs>
                <QuickCaptureForm
                    onSubmit={onSubmit}
                    memoryId={memoryId as string}
                />
            </div>
        </div>
    );
}
