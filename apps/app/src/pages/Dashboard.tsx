import { SearchIcon } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useQuery } from '@tanstack/react-query';
import { profileQueryOptions } from '@/query/options/profile';
import { useSearchDialog } from '@/components/SearchCommandDialog';
import { ActivityFeed } from '@/components/ActivityFeed';

export default function Dashboard() {
    const { data: userProfileData } = useQuery(profileQueryOptions);
    const setSearchOpen = useSearchDialog((s) => s.setOpen);

    return (
        <AppLayout
            breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Dashboard' }]}
        >
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0 h-full overflow-auto">
                <div className="max-w-3xl mx-auto h-full min-h-2/3 w-full">
                    <div className="mt-40">
                        <div className="text-5xl font-semibold text-center mb-8">
                            Headknot
                        </div>
                        {/* Search trigger that opens the command dialog */}
                        <div
                            onClick={() => setSearchOpen(true)}
                            className="bg-background border border-border rounded-2xl overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                        >
                            <div className="px-4 py-3 flex items-center gap-3 text-muted-foreground">
                                <SearchIcon className="size-5" />
                                <span className="text-sm">
                                    Search, recall, or capture a new memory —
                                    just start typing…
                                </span>
                                <span className="ml-auto text-xs bg-muted px-2 py-0.5 rounded">
                                    ⌘K
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="max-w-3xl mx-auto w-full">
                    <ActivityFeed limit={5} />
                </div>
            </div>
        </AppLayout>
    );
}
