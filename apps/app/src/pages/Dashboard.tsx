import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    SearchIcon,
    FileTextIcon,
    CircuitBoardIcon,
    BrainCircuitIcon,
    ClockIcon,
} from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useSearchDialog } from '@/components/SearchCommandDialog';

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
            <div className="flex flex-1 flex-col items-center justify-center h-full overflow-auto relative">
                {/* Background decorative arcs */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                    <div className="w-[600px] h-[600px] rounded-full border border-muted-foreground/5" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                    <div className="w-[800px] h-[800px] rounded-full border border-muted-foreground/[0.03]" />
                </div>

                <div className="relative z-10 flex flex-col items-center w-full max-w-3xl px-4">
                    {/* Logo */}
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-muted-foreground/70 to-muted-foreground/90 rounded-2xl flex items-center justify-center shadow-lg">
                            <BrainCircuitIcon className="size-8 text-white" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold italic text-foreground mb-2 text-center">
                        Cognitive Infrastructure
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase mb-10">
                        The Intelligent Arbiter &bull; V1.0.2
                    </p>

                    {/* Search bar */}
                    <form
                        onSubmit={handleSearchSubmit}
                        className="w-full max-w-2xl bg-background border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-colors shadow-sm mb-12"
                    >
                        <div className="px-5 py-4 flex items-center gap-3 text-muted-foreground">
                            <SearchIcon className="size-5" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Ask Headknot a question..."
                                className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
                            />
                            <button
                                type="button"
                                onClick={() => setSearchOpen(true)}
                                className="text-xs bg-muted px-2 py-1 rounded font-medium hover:bg-muted/80"
                            >
                                ⌘K
                            </button>
                        </div>
                    </form>

                    {/* Stat cards */}
                    <div className="w-full max-w-2xl grid grid-cols-3 gap-4 mb-10">
                        {/* Recent Docs */}
                        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
                            <div className="flex items-start justify-between mb-4">
                                <FileTextIcon className="size-6 text-muted-foreground" />
                            </div>
                            <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1">
                                Recent Docs
                            </p>
                            <p className="text-sm font-medium text-foreground">
                                Causality Mapping.pdf
                            </p>
                        </div>

                        {/* Integrations */}
                        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
                            <div className="flex items-start justify-between mb-4">
                                <CircuitBoardIcon className="size-6 text-muted-foreground" />
                                <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-medium">
                                    4/6
                                </span>
                            </div>
                            <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1">
                                Integrations
                            </p>
                            <p className="text-sm font-medium text-foreground">
                                Active Nodes
                                <br />
                                Connected
                            </p>
                        </div>

                        {/* Memory Nodes */}
                        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
                            <div className="flex items-start justify-between mb-4">
                                <BrainCircuitIcon className="size-6 text-muted-foreground" />
                            </div>
                            <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1">
                                Memory Nodes
                            </p>
                            <p className="text-sm font-medium text-foreground">
                                1.2M Indexed Claims
                            </p>
                        </div>
                    </div>

                    {/* Status footer */}
                    <div className="flex items-center gap-6 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <span>System Operational</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ClockIcon className="size-3.5" />
                            <span>Last sync: 2m ago</span>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
