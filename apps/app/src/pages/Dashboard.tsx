import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Button } from '@workspace/ui/components/button';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@workspace/ui/components/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@workspace/ui/components/separator';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@workspace/ui/components/breadcrumb';
import { FilePlus2 } from 'lucide-react';

type Memory = { id: string; title: string; updatedAt: string };

export default function Dashboard() {
    // const qc = useQueryClient();

    // const { data: memories, isLoading } = useQuery({
    //     queryKey: ['memories'],
    //     queryFn: () => api<Memory[]>('/bff/memories'),
    // });

    // const createMemory = useMutation({
    //     mutationFn: async (title: string) =>
    //         api<Memory>('/bff/memories', {
    //             method: 'POST',
    //             headers: { 'content-type': 'application/json' },
    //             body: JSON.stringify({ title }),
    //         }),
    //     onMutate: async (title) => {
    //         await qc.cancelQueries({ queryKey: ['memories'] });
    //         const prev = qc.getQueryData<Memory[]>(['memories']) || [];
    //         const temp: Memory = { id: 'temp-' + Date.now(), title, updatedAt: new Date().toISOString() };
    //         qc.setQueryData<Memory[]>(['memories'], [temp, ...prev]);
    //         return { prev };
    //     },
    //     onError: (_e, _v, ctx) => ctx?.prev && qc.setQueryData(['memories'], ctx.prev),
    //     onSettled: () => qc.invalidateQueries({ queryKey: ['memories'] }),
    // });

    // if (isLoading) return <div className="p-6">Loading…</div>;

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex w-full items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">
                                        Building Your Application
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <div className="ml-auto flex items-center gap-2">
                            <Button variant="default" type="button" className="hidden sm:flex">
                                <FilePlus2 className="mr-2" />
                                <a
                                    href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    className="dark:text-foreground"
                                >
                                    Capture Memory
                                </a>
                            </Button>
                        </div>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                    </div>
                    <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
