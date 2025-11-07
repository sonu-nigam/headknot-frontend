import { Separator } from '@workspace/ui/components/separator';
import { HistoryIcon, PinIcon, WandSparklesIcon } from 'lucide-react';
import { Fragment } from 'react/jsx-runtime';
import { Chatbox } from '@/components/chatbox';
import { CompactMemoryCard } from '@/components/MemoryCard';
import ProjectsInFocus from '@/components/ProjectsInFocus';
import AppLayout from '@/components/AppLayout';
import { AppHeader } from '@/components/app-header';

export default function Dashboard() {
    return (
        <AppLayout
            breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Dashboard' }]}
        >
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0 h-full overflow-auto">
                <div className="max-w-3xl mx-auto h-full min-h-2/3 w-full">
                    <Chatbox className="mt-20" />
                    <DailySuggestion />
                </div>
                {/*<div className="">
                    <ProjectsInFocus />
                </div>*/}
                <div className="flex gap-4 w-full">
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
                </div>
                {/*<div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />*/}
            </div>
        </AppLayout>
    );
}

const DailySuggestion = () => {
    return (
        <div className="rounded-xl space-y-3 mt-4">
            <h3 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                🤖 AI Highlights
            </h3>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 bg-gray-100 rounded-md py-2 px-4">
                    <WandSparklesIcon size={16} />
                    <div>
                        <p className="text-sm text-gray-800">
                            You might want to revisit{' '}
                            <span className="font-medium">
                                Rogue Task Philosophy
                            </span>
                        </p>
                    </div>
                    <div className="text-xs text-gray-500 ml-auto">
                        Last updated 2 days ago
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 rounded-md py-2 px-4">
                    <WandSparklesIcon size={16} />
                    <div>
                        <p className="text-sm text-gray-800">
                            <span className="font-medium">
                                Cluster: Backend DDD
                            </span>{' '}
                            has 3 new updates
                        </p>
                        {/*<span className="text-xs text-gray-500">
                        </span>*/}
                    </div>
                    <div className="text-xs text-gray-500 ml-auto">
                        1 task blocked
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 rounded-md py-2 px-4">
                    <WandSparklesIcon size={16} />
                    <div>
                        <p className="text-sm text-gray-800">
                            Summarize last 7 days of{' '}
                            <span className="font-medium">
                                Product Strategy
                            </span>
                        </p>
                    </div>
                    <div className="text-xs text-gray-500 ml-auto">
                        AI-generated recap
                    </div>
                </div>
            </div>
        </div>
    );
};

const data = [
    {
        id: 'm1',
        type: 'note',
        title: 'Ideas for Capture Tool',
        content:
            'Explore quick capture with text, voice, and screenshot support. Auto-tag memories by context.',
        cluster: 'Product Design',
        createdAt: '2025-09-01T10:30:00Z',
        updatedAt: '2025-09-02T09:45:00Z',
        owner: 'You',
        status: null,
        pinned: true,
    },
    {
        id: 'm2',
        type: 'task',
        title: 'Set up Redis & MinIO in compose.yml',
        content: 'Wire optional profiles for attachments and cache.',
        cluster: 'Backend Infra',
        createdAt: '2025-09-05T08:15:00Z',
        updatedAt: '2025-09-05T08:15:00Z',
        owner: 'You',
        status: 'in-progress',
        pinned: false,
    },
    {
        id: 'm3',
        type: 'file',
        title: 'Headknot Logo Draft v2',
        content: 'logo_draft_v2.png',
        cluster: 'Branding',
        createdAt: '2025-08-28T15:00:00Z',
        updatedAt: '2025-08-28T15:00:00Z',
        owner: 'Designer',
        status: null,
        pinned: false,
    },
    {
        id: 'm4',
        type: 'note',
        title: 'Rogue Task Philosophy',
        content:
            'Should rogue tasks stay in capture phase, or do they add unnecessary chaos?',
        cluster: 'Product Strategy',
        createdAt: '2025-08-30T12:00:00Z',
        updatedAt: '2025-09-01T09:20:00Z',
        owner: 'You',
        status: null,
        pinned: false,
    },
    {
        id: 'm5',
        type: 'task',
        title: 'Implement Outbox Event Publisher',
        content:
            'Fix missing @Primary annotation and ensure testcontainers setup.',
        cluster: 'Backend DDD',
        createdAt: '2025-09-04T18:10:00Z',
        updatedAt: '2025-09-06T09:00:00Z',
        owner: 'You',
        status: 'blocked',
        pinned: false,
    },
    {
        id: 'm6',
        type: 'conversation',
        title: 'Team Sync: MVP Scope',
        content:
            'Discussion about cutting clusters feature for MVP in favor of simpler workspaces.',
        cluster: 'Team Meetings',
        createdAt: '2025-09-03T14:30:00Z',
        updatedAt: '2025-09-03T15:00:00Z',
        owner: 'PM',
        status: null,
        pinned: true,
    },
    {
        id: 'm7',
        type: 'link',
        title: 'Inspiration: Notion AI vs NotebookLM',
        content: 'https://www.notion.so/ai-comparison',
        cluster: 'Competitive Research',
        createdAt: '2025-08-25T09:45:00Z',
        updatedAt: '2025-08-25T09:45:00Z',
        owner: 'You',
        status: null,
        pinned: false,
    },
    {
        id: 'm8',
        type: 'note',
        title: 'UI Kit Checklist',
        content:
            'Chips, avatars, cards, table rows, kanban board, timeline list, memory detail view…',
        cluster: 'UI Kit',
        createdAt: '2025-09-02T11:20:00Z',
        updatedAt: '2025-09-02T11:20:00Z',
        owner: 'You',
        status: null,
        pinned: false,
    },
    {
        id: 'm9',
        type: 'task',
        title: 'Research Next.js RSC Cache Enhancement',
        content:
            'Prototype library to revalidate only dependent components when cache tag changes.',
        cluster: 'Frontend R&D',
        createdAt: '2025-09-07T19:30:00Z',
        updatedAt: '2025-09-08T09:00:00Z',
        owner: 'You',
        status: 'todo',
        pinned: false,
    },
    {
        id: 'm10',
        type: 'file',
        title: 'Headknot Roadmap.pdf',
        content: 'roadmap_q4_2025.pdf',
        cluster: 'Strategy',
        createdAt: '2025-09-01T07:30:00Z',
        updatedAt: '2025-09-01T07:30:00Z',
        owner: 'You',
        status: null,
        pinned: true,
    },
];
