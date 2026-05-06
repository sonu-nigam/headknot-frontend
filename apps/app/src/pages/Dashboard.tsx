import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    SearchIcon,
    NetworkIcon,
} from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useSearchDialog } from '@/components/SearchCommandDialog';
import { Button } from '@workspace/ui/components/button';

// --- Main Dashboard ---

export default function Dashboard() {
    const setSearchOpen = useSearchDialog((s) => s.setOpen);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim().length >= 2) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <AppLayout
            breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Dashboard' }]}
        >
            <div className="flex-1 overflow-y-auto">
                <div className="p-6 md:p-8 pb-32 max-w-7xl mx-auto space-y-8">
                    {/* Header + Search */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Dashboard
                            </h1>
                            <p className="text-muted-foreground text-sm mt-1">
                                Overview of your knowledge workspace.
                            </p>
                        </div>
                        <form
                            onSubmit={handleSearchSubmit}
                            className="w-full max-w-sm bg-card border rounded-lg overflow-hidden hover:border-primary/50 transition-colors shadow-sm"
                        >
                            <div className="px-3 py-2 flex items-center gap-2 text-muted-foreground">
                                <SearchIcon className="size-4" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Ask Headknot..."
                                    className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
                                />
                                <button
                                    type="button"
                                    onClick={() => setSearchOpen(true)}
                                    className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-medium hover:bg-muted/80"
                                >
                                    ⌘K
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Network View CTA */}
                    <div className="bg-card border rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <NetworkIcon className="size-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold">
                                    Knowledge Graph
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Explore entities and relationships in an interactive network view.
                                </p>
                            </div>
                        </div>
                        <Button asChild variant="secondary" size="sm" className="gap-2">
                            <Link to="/knowledge-graph">
                                <NetworkIcon className="size-3.5" />
                                Open Explorer
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
