import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/AppLayout';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { useAppStore } from '@/state/store';
import { searchQueryOptions } from '@/query/options/search';
import {
    GitBranch,
    ExternalLink,
    BookOpen,
    Terminal,
    ShieldCheck,
    ClipboardCheck,
    AlertTriangle,
    Headphones,
    Loader2,
    SearchIcon,
    Check,
} from 'lucide-react';
import { StickyPromptBox } from '@/components/StickyPromptBox';

// --- Step-by-Step Guide ---

interface Step {
    number: number;
    title: string;
    description: string;
    codeSnippet?: string;
    tags?: string[];
    isFirst: boolean;
    isLast: boolean;
}

const steps: Step[] = [
    {
        number: 1,
        title: 'Initialize Node Synthesis',
        description:
            'Configure the base cognitive environment. Ensure all local caches are purged before starting the synchronization process to prevent semantic drift.',
        codeSnippet: '$ knot init --profile="high-density" --force',
        isFirst: true,
        isLast: false,
    },
    {
        number: 2,
        title: 'Calibrate Causality Chains',
        description:
            'Map the relationships between isolated claims. Use the logic-gate tool to verify the structural integrity of the graph.',
        tags: ['Verification: Active', 'Auto-fix: Off'],
        isFirst: false,
        isLast: false,
    },
    {
        number: 3,
        title: 'Execute Network Flattening',
        description:
            'Reduce computational overhead by merging redundant intelligence layers into a single authoritative document. This action is irreversible.',
        isFirst: false,
        isLast: false,
    },
    {
        number: 4,
        title: 'Validate Integrity',
        description:
            'Finalize the process with a system-wide integrity check. Generate the summary report for the Intel Dashboard.',
        isFirst: false,
        isLast: true,
    },
];

function StepItem({ step }: { step: Step }) {
    return (
        <div className={`relative ${!step.isLast ? 'pb-8' : ''}`}>
            {/* Vertical connector line */}
            {!step.isLast && (
                <div className="absolute left-5 top-10 bottom-0 w-px bg-border" />
            )}
            <div className="flex gap-4">
                <div
                    className={`z-10 size-10 rounded-full shrink-0 flex items-center justify-center font-bold text-sm ${
                        step.isFirst
                            ? 'bg-foreground text-background'
                            : 'bg-muted text-foreground'
                    }`}
                >
                    {step.number}
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-bold">{step.title}</h4>
                        <a
                            href="#"
                            className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                        >
                            VIEW SOURCE{' '}
                            <ExternalLink className="size-2.5" />
                        </a>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        {step.description}
                    </p>
                    {step.codeSnippet && (
                        <div className="bg-muted p-3 rounded-lg border font-mono text-xs text-muted-foreground">
                            {step.codeSnippet}
                        </div>
                    )}
                    {step.tags && (
                        <div className="flex flex-wrap gap-2">
                            {step.tags.map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="outline"
                                    className="text-[10px] rounded-full"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ExecutionGuide() {
    return (
        <div className="bg-card p-8 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <GitBranch className="size-5 text-primary" />
                    Step-by-Step Execution Guide
                </h3>
                <Badge variant="secondary" className="text-[10px]">
                    4 ESTIMATED MINS
                </Badge>
            </div>
            <div className="space-y-0">
                {steps.map((step) => (
                    <StepItem key={step.number} step={step} />
                ))}
            </div>
        </div>
    );
}

// --- Documentation Links ---

function DocumentationLinks() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
                href="#"
                className="group p-5 bg-muted rounded-xl border border-transparent hover:border-primary/20 transition-all"
            >
                <div className="flex items-center justify-between mb-3">
                    <BookOpen className="size-5 text-muted-foreground" />
                    <ExternalLink className="size-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                </div>
                <h4 className="text-sm font-bold mb-1">
                    Procedural Best Practices
                </h4>
                <p className="text-xs text-muted-foreground">
                    Master the cognitive workflow standards.
                </p>
            </a>
            <a
                href="#"
                className="group p-5 bg-muted rounded-xl border border-transparent hover:border-primary/20 transition-all"
            >
                <div className="flex items-center justify-between mb-3">
                    <Terminal className="size-5 text-muted-foreground" />
                    <ExternalLink className="size-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                </div>
                <h4 className="text-sm font-bold mb-1">
                    CLI Reference Manual
                </h4>
                <p className="text-xs text-muted-foreground">
                    Full list of node optimization commands.
                </p>
            </a>
        </div>
    );
}

// --- Source Verification ---

interface SourceItem {
    stepLabel: string;
    sourceType: string;
    title: string;
    meta: string;
}

const sourceItems: SourceItem[] = [
    {
        stepLabel: 'Step 1 Synthesis',
        sourceType: 'GITHUB',
        title: 'knot-core/src/init/synthesis_v4.go',
        meta: 'Updated 2 days ago by @infra-lead',
    },
    {
        stepLabel: 'Step 2 & 3 Logic',
        sourceType: 'CONFLUENCE',
        title: 'Architecture Standards: Causality Mapping',
        meta: 'Approved by Architecture Council',
    },
    {
        stepLabel: 'Step 4 Validation',
        sourceType: 'INTERNAL DOCS',
        title: 'Data Integrity Verification Protocol v3.1',
        meta: 'Secured by JWT-742 Auth',
    },
];

function SourceVerification() {
    return (
        <div className="bg-muted p-6 rounded-xl border">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
                <ShieldCheck className="size-4" />
                Source Verification
            </h3>
            <div className="space-y-4">
                {sourceItems.map((item, i) => (
                    <div key={item.stepLabel}>
                        {i > 0 && <hr className="border-border mb-4" />}
                        <div className="cursor-pointer">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                                    {item.stepLabel}
                                </span>
                                <Badge
                                    variant="secondary"
                                    className="text-[9px] text-primary"
                                >
                                    {item.sourceType}
                                </Badge>
                            </div>
                            <p className="text-[11px] font-medium leading-tight">
                                {item.title}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-1">
                                {item.meta}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- Prerequisites ---

interface Prerequisite {
    label: string;
    checked: boolean;
}

const prerequisites: Prerequisite[] = [
    { label: 'V3.4 Engine Installed', checked: true },
    { label: 'Valid API Handshake', checked: true },
    { label: '50GB Buffer Memory', checked: false },
    { label: 'Admin Escalation Token', checked: false },
];

function Prerequisites() {
    return (
        <div className="bg-muted p-6 rounded-xl">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
                <ClipboardCheck className="size-4" />
                Prerequisites
            </h3>
            <ul className="space-y-4">
                {prerequisites.map((item) => (
                    <li key={item.label} className="flex items-start gap-3">
                        {item.checked ? (
                            <div className="mt-0.5 size-4 rounded border-2 border-foreground bg-foreground flex items-center justify-center">
                                <Check className="size-2.5 text-background" />
                            </div>
                        ) : (
                            <div className="mt-0.5 size-4 rounded border-2 border-border" />
                        )}
                        <span
                            className={`text-xs ${item.checked ? '' : 'text-muted-foreground'}`}
                        >
                            {item.label}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// --- Troubleshooting ---

interface TroubleshootItem {
    title: string;
    description: string;
}

const troubleshootItems: TroubleshootItem[] = [
    {
        title: 'Timeouts at Step 2',
        description:
            'Increase the network threshold using the `--latency-ignore` flag during synthesis.',
    },
    {
        title: 'Handshake Failure',
        description:
            'Re-verify your workspace ID in the Settings → Profile panel.',
    },
];

function Troubleshooting() {
    return (
        <div className="bg-zinc-900 dark:bg-zinc-950 p-6 rounded-xl text-white">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2 uppercase tracking-wider">
                <AlertTriangle className="size-4" />
                Troubleshooting
            </h3>
            <div className="space-y-4">
                {troubleshootItems.map((item) => (
                    <div
                        key={item.title}
                        className="p-3 bg-white/5 rounded-lg"
                    >
                        <h4 className="text-[10px] font-bold mb-1">
                            {item.title}
                        </h4>
                        <p className="text-[10px] text-zinc-400">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>
            <Button
                variant="secondary"
                className="mt-6 w-full bg-zinc-700 hover:bg-zinc-600 text-white border-none text-[10px] font-bold"
            >
                <Headphones className="size-3" />
                CONTACT INFRASTRUCTURE SUPPORT
            </Button>
        </div>
    );
}

// --- Main Page ---

export function ProceduralResultsPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') ?? '';
    const navigate = useNavigate();
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);

    const { data: searchResults, isLoading } = useQuery({
        ...searchQueryOptions({
            workspaceId: selectedWorkspaceId ?? '',
            query,
            limit: 10,
        }),
        enabled: !!query && !!selectedWorkspaceId,
    });

    const results = searchResults?.items ?? [];

    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Procedural Results' },
            ]}
        >
            <div className="flex-1 overflow-y-auto relative">
                <div className="p-6 md:p-10 pb-32 max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-10">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <span className="text-xs font-medium tracking-widest uppercase">
                                Query Intent: Procedural
                            </span>
                            <span className="size-1 rounded-full bg-border" />
                            <span className="text-xs font-medium">
                                Confidence: 98.4%
                            </span>
                        </div>
                        <h2 className="text-4xl font-extrabold tracking-tight mb-4">
                            Procedural Results (Guide Intent)
                        </h2>
                        <p className="text-muted-foreground max-w-2xl leading-relaxed">
                            System-generated execution path for optimizing
                            cognitive infrastructure nodes. Follow these
                            calibrated steps for deterministic outcomes.
                        </p>
                    </div>

                    {/* Loading */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="size-6 animate-spin text-muted-foreground" />
                        </div>
                    )}

                    {/* Empty */}
                    {!isLoading && results.length === 0 && query && (
                        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                            <SearchIcon className="size-10 mb-4" />
                            <p className="text-sm font-medium">
                                No procedural guides found for &ldquo;{query}
                                &rdquo;
                            </p>
                            <p className="text-xs mt-1">
                                Try a different query.
                            </p>
                        </div>
                    )}

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left: Steps + Docs */}
                        <section className="lg:col-span-8 space-y-6">
                            <ExecutionGuide />
                            <DocumentationLinks />
                        </section>

                        {/* Right: Sidebar */}
                        <aside className="lg:col-span-4 space-y-6">
                            <SourceVerification />
                            <Prerequisites />
                            <Troubleshooting />
                        </aside>
                    </div>
                </div>
            </div>
            <StickyPromptBox />
        </AppLayout>
    );
}
