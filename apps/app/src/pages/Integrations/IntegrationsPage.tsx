import AppLayout from '@/components/AppLayout';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@workspace/ui/components/card';
import {
    HardDrive,
    MessageSquare,
    FileText,
    Code,
    CheckCircle,
    BookOpen,
    Filter,
    Brain,
} from 'lucide-react';

type IntegrationStatus = 'connected' | 'syncing' | 'idle';

interface Integration {
    name: string;
    description: string;
    icon: React.ReactNode;
    status: IntegrationStatus;
}

const integrations: Integration[] = [
    {
        name: 'Google Drive',
        description: 'Indexing 4,203 items',
        icon: <HardDrive className="size-7" />,
        status: 'connected',
    },
    {
        name: 'Slack',
        description: 'Indexing 12,850 messages',
        icon: <MessageSquare className="size-7" />,
        status: 'connected',
    },
    {
        name: 'Notion',
        description: 'Connect to import pages',
        icon: <FileText className="size-7" />,
        status: 'idle',
    },
    {
        name: 'GitHub',
        description: 'Indexing 154 repositories',
        icon: <Code className="size-7" />,
        status: 'syncing',
    },
    {
        name: 'Jira',
        description: 'Connect to track issues',
        icon: <CheckCircle className="size-7" />,
        status: 'idle',
    },
    {
        name: 'Confluence',
        description: 'Indexing 890 documents',
        icon: <BookOpen className="size-7" />,
        status: 'connected',
    },
];

function StatusBadge({ status }: { status: IntegrationStatus }) {
    if (status === 'connected') {
        return (
            <Badge
                variant="outline"
                className="border-primary/30 bg-primary/10 text-primary gap-1.5"
            >
                <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                CONNECTED
            </Badge>
        );
    }
    if (status === 'syncing') {
        return (
            <Badge
                variant="outline"
                className="border-primary/30 bg-primary/10 text-primary gap-1.5"
            >
                <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                SYNCING
            </Badge>
        );
    }
    return (
        <Badge variant="secondary" className="text-muted-foreground">
            IDLE
        </Badge>
    );
}

function IntegrationCard({ integration }: { integration: Integration }) {
    const isConnected =
        integration.status === 'connected' ||
        integration.status === 'syncing';

    return (
        <Card className="group h-[240px] justify-between hover:border-primary/30 transition-all">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="size-12 rounded-xl bg-muted flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                        {integration.icon}
                    </div>
                    <StatusBadge status={integration.status} />
                </div>
            </CardHeader>
            <CardContent className="space-y-1">
                <CardTitle className="text-xl">{integration.name}</CardTitle>
                <CardDescription>{integration.description}</CardDescription>
            </CardContent>
            <CardFooter className="border-t pt-4">
                {isConnected ? (
                    <Button variant="outline" className="w-full">
                        Disconnect
                    </Button>
                ) : (
                    <Button className="w-full">
                        Connect {integration.name}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}

export function IntegrationsPage() {
    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Integrations' },
            ]}
        >
            <div className="p-8 md:p-12 flex-1 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-10 flex items-end justify-between">
                        <div>
                            <h1 className="text-5xl font-black tracking-tighter leading-tight">
                                Sources.
                            </h1>
                            <p className="text-muted-foreground text-lg mt-2 max-w-xl">
                                Centralize your organizational intelligence.
                                Connect the tools your team uses every day to
                                build a unified knowledge base.
                            </p>
                        </div>
                        <Button variant="secondary" className="gap-2">
                            <Filter className="size-4" />
                            Filter
                        </Button>
                    </div>

                    {/* Integration Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {integrations.map((integration) => (
                            <IntegrationCard
                                key={integration.name}
                                integration={integration}
                            />
                        ))}
                    </div>

                    {/* Featured Section */}
                    <div className="mt-12 grid grid-cols-12 gap-8">
                        {/* Knowledge Extraction */}
                        <div className="col-span-12 lg:col-span-8 bg-muted p-8 rounded-xl relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-2xl font-black">
                                    Real-time Knowledge Extraction
                                </h2>
                                <p className="text-muted-foreground mt-2 max-w-md">
                                    Our AI automatically labels, categorizes,
                                    and links content across all connected
                                    sources.
                                </p>
                                <div className="mt-6 flex gap-4">
                                    <div className="bg-card p-4 rounded-xl shadow-sm border">
                                        <span className="text-xs font-bold text-primary block mb-1">
                                            ACCURACY
                                        </span>
                                        <span className="text-2xl font-black">
                                            99.4%
                                        </span>
                                    </div>
                                    <div className="bg-card p-4 rounded-xl shadow-sm border">
                                        <span className="text-xs font-bold text-primary block mb-1">
                                            LATENCY
                                        </span>
                                        <span className="text-2xl font-black">
                                            &lt;200ms
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 h-full w-1/3 opacity-20 bg-gradient-to-l from-primary to-transparent pointer-events-none" />
                            <Brain className="absolute -bottom-6 -right-6 size-40 text-primary/5" />
                        </div>

                        {/* Request Source */}
                        <div className="col-span-12 lg:col-span-4 bg-primary text-primary-foreground p-8 rounded-xl flex flex-col justify-between">
                            <div>
                                <h2 className="text-xl font-bold">
                                    Request Source
                                </h2>
                                <p className="text-primary-foreground/80 text-sm mt-2">
                                    Can't find what you're looking for? Suggest
                                    a new integration for our roadmap.
                                </p>
                            </div>
                            <Button
                                variant="secondary"
                                className="mt-6 w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold"
                            >
                                Submit Request
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
