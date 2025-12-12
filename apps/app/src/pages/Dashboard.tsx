import { WandSparklesIcon } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import PromptBox from '@/components/PromptBox';
import { useQuery } from '@tanstack/react-query';
import { profileQueryOptions } from '@/query/options/profile';

export default function Dashboard() {
    const { data: userProfileData } = useQuery(profileQueryOptions);

    return (
        <AppLayout
            breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Dashboard' }]}
        >
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0 h-full overflow-auto">
                <div className="max-w-3xl mx-auto h-full min-h-2/3 w-full">
                    {/*<Chatbox className="mt-20" />*/}
                    <div className="mt-40">
                        <div className="text-5xl font-semibold text-center mb-8">
                            Headknot
                        </div>
                        <PromptBox placeholder="Search, recall, or capture a new memory — just start typing…" />
                    </div>
                    {/*<DailySuggestion />*/}
                </div>
                {/*<div className="">
                    <ProjectsInFocus />
                </div>*/}
                {/*<div className="flex gap-4 w-full">
                    <div className="flex-3">
                        <div>
                            <div className="mb-2 flex gap-2">
                                <PinIcon />
                                <div className="text-lg font-semibold">
                                    Pinned Memory
                                </div>
                            </div>
                            <div className="bg-muted/50 rounded-xl">
                                {data.map((item, idx) => (
                                    <Fragment key={item.id}>
                                        <CompactMemoryCard item={item} />
                                        {idx !== data.length - 1 && (
                                            <Separator />
                                        )}
                                    </Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex-2">
                        <div className="mb-2 flex gap-2">
                            <HistoryIcon />
                            <div className="text-lg font-semibold">
                                Recent Activity
                            </div>
                        </div>
                        <div className="bg-muted/50 aspect-video rounded-xl"></div>
                    </div>
                </div>*/}
                {/*<div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />*/}
            </div>
        </AppLayout>
    );
}
