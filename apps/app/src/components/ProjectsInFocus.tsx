// app/components/dashboard/ProjectsInFocus.tsx
'use client';

import { useMemo, useState } from 'react';

import {
    ArrowBigLeft,
    ArrowBigLeftIcon,
    ArrowBigRight,
    ArrowRight,
    Ellipsis,
    ExternalLink,
    Pin,
    RocketIcon,
    Share2,
} from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@workspace/ui/components/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';

// ---- Types ----
export type ProjectSummary = {
    id: string;
    name: string;
    emoji?: string; // 🧩 🎨 📊 etc
    description?: string;
    tasksPending?: number;
    tasksBlocked?: number;
    recentNotes?: number; // files/notes added/updated recently
    lastUpdatedAt: string; // ISO string
    href?: string; // deep-link to the project/cluster
    pinned?: boolean;
};

type ProjectsInFocusProps = {
    title?: string;
    subtitle?: string;
    projects?: ProjectSummary[]; // pass your data; falls back to mock
    maxVisible?: number; // default 6
    onOpen?: (id: string) => void;
    onPinToggle?: (id: string, nextPinned: boolean) => void;
    onShare?: (id: string) => void;
};

// ---- Helpers ----
function formatRelative(iso: string) {
    const diffMs = Date.now() - new Date(iso).getTime();
    const sec = Math.max(1, Math.floor(diffMs / 1000));
    if (sec < 60) return `${sec}s ago`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const d = Math.floor(hr / 24);
    if (d < 30) return `${d}d ago`;
    const mo = Math.floor(d / 30);
    return `${mo}mo ago`;
}

// ---- Mock (used if no props.projects provided) ----
const MOCK_PROJECTS: ProjectSummary[] = [
    {
        id: 'p1',
        name: 'Backend DDD',
        emoji: '🧩',
        description: 'DDD modules, outbox + modulith checks.',
        tasksPending: 5,
        tasksBlocked: 1,
        recentNotes: 2,
        lastUpdatedAt: '2025-09-06T09:00:00Z',
        href: '/clusters/backend-ddd',
        pinned: true,
    },
    {
        id: 'p2',
        name: 'UI Kit',
        emoji: '🎨',
        description: 'Chips, avatars, cards, table rows, kanban.',
        tasksPending: 3,
        tasksBlocked: 0,
        recentNotes: 3,
        lastUpdatedAt: '2025-09-02T11:20:00Z',
        href: '/clusters/ui-kit',
    },
    {
        id: 'p3',
        name: 'Product Strategy',
        emoji: '📊',
        description: 'MVP scope, pricing, roadmap alignments.',
        tasksPending: 2,
        tasksBlocked: 0,
        recentNotes: 1,
        lastUpdatedAt: '2025-09-08T08:30:00Z',
        href: '/clusters/strategy',
    },
    {
        id: 'p4',
        name: 'Frontend R&D',
        emoji: '⚡',
        description: 'Next.js RSC cache enhancement prototype.',
        tasksPending: 4,
        tasksBlocked: 0,
        recentNotes: 1,
        lastUpdatedAt: '2025-09-08T09:00:00Z',
        href: '/clusters/frontend-rd',
    },
    {
        id: 'p5',
        name: 'Branding',
        emoji: '🎯',
        description: 'Logo iterations & color system.',
        tasksPending: 1,
        tasksBlocked: 0,
        recentNotes: 1,
        lastUpdatedAt: '2025-08-28T15:00:00Z',
        href: '/clusters/branding',
    },
    {
        id: 'p6',
        name: 'Team Meetings',
        emoji: '🗓️',
        description: 'Sync notes & decisions recap.',
        tasksPending: 0,
        tasksBlocked: 0,
        recentNotes: 4,
        lastUpdatedAt: '2025-09-03T15:00:00Z',
        href: '/clusters/meetings',
    },
];

// ---- Component ----
export default function ProjectsInFocus({
    title = 'Projects in Focus',
    subtitle = 'Quick access to your active workspaces and clusters',
    projects,
    maxVisible = 6,
    onOpen,
    onPinToggle,
    onShare,
}: ProjectsInFocusProps) {
    const [local, setLocal] = useState<ProjectSummary[]>(
        projects?.slice(0, maxVisible) ?? MOCK_PROJECTS.slice(0, maxVisible),
    );

    const total = (projects ?? MOCK_PROJECTS).length;
    const moreCount = Math.max(0, total - local.length);

    const handleOpen = (id: string, href?: string) => {
        onOpen?.(id);
        if (href) window.location.href = href;
    };

    const handlePinToggle = (id: string) => {
        setLocal((prev) =>
            prev.map((p) => (p.id === id ? { ...p, pinned: !p.pinned } : p)),
        );
        const nextPinned = !local.find((p) => p.id === id)?.pinned;
        onPinToggle?.(id, nextPinned);
    };

    return (
        <section className="space-y-2">
            <div className="flex items-baseline justify-between">
                <div className="flex justify-between items-center gap-2">
                    <RocketIcon />
                    <h3 className="text-lg font-semibold">{title}</h3>
                </div>
                {moreCount > 0 && (
                    <Button variant="ghost" size="sm" className="text-xs">
                        View all ({total})
                    </Button>
                )}
            </div>

            {/* Grid — 3 columns on xl, 2 on md, 1 on mobile */}
            <div
                className="px-4
                      overflow-x-auto overflow-y-hidden
                      scroll-smooth
                      snap-x snap-mandatory
                      [&>*]:snap-start
                      flex gap-3
                      pb-2
                      /* nicer thin scrollbar in modern browsers */
                      [scrollbar-width:thin]
                      [scrollbar-color:theme(colors.muted.DEFAULT)_transparent]
                    "
            >
                {local.map((p) => (
                    <Card
                        key={p.id}
                        className="rounded-md py-3 px-3 flex-[300px] shrink-0"
                    >
                        <CardHeader className="flex flex-row items-start justify-between px-0">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl leading-none">
                                        {p.emoji ?? '📂'}
                                    </span>
                                    <span className="font-medium">
                                        {p.name}
                                    </span>
                                    {p.pinned && (
                                        <Badge
                                            variant="secondary"
                                            className="ml-1 text-[10px]"
                                        >
                                            Pinned
                                        </Badge>
                                    )}
                                </div>
                                {p.description && (
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {p.description}
                                    </p>
                                )}
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 opacity-70 hover:opacity-100"
                                    >
                                        <Ellipsis className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-40"
                                >
                                    <DropdownMenuItem
                                        onClick={() => handleOpen(p.id, p.href)}
                                    >
                                        <ExternalLink className="mr-2 h-4 w-4" />{' '}
                                        Open
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handlePinToggle(p.id)}
                                    >
                                        <Pin className="mr-2 h-4 w-4" />
                                        {p.pinned ? 'Unpin' : 'Pin'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => onShare?.(p.id)}
                                    >
                                        <Share2 className="mr-2 h-4 w-4" />{' '}
                                        Share
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>

                        <CardContent className="px-0">
                            <div className="flex flex-wrap items-center gap-2">
                                {typeof p.tasksPending === 'number' && (
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        {p.tasksPending} pending
                                    </Badge>
                                )}
                                {typeof p.tasksBlocked === 'number' &&
                                    p.tasksBlocked > 0 && (
                                        <Badge className="text-xs">
                                            {p.tasksBlocked} blocked
                                        </Badge>
                                    )}
                                {typeof p.recentNotes === 'number' && (
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        {p.recentNotes} recent notes
                                    </Badge>
                                )}
                            </div>
                        </CardContent>

                        <CardFooter className="px-0 pt-0 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                                Updated {formatRelative(p.lastUpdatedAt)}
                            </span>
                            <Button
                                size="icon"
                                className=""
                                variant="ghost"
                                onClick={() => handleOpen(p.id, p.href)}
                            >
                                <ArrowRight />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </section>
    );
}
