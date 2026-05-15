import { Loader2, Hash } from 'lucide-react';
import {
    Card,
    CardContent,
} from '@workspace/ui/components/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@workspace/ui/components/table';
import { $api } from '@workspace/api-client';
import { useAppStore } from '@/state/store';
import { formatNumber } from '@/lib/format';
import type { Schemas } from '@/types/api';

interface SlackChannelsTabProps {
    integrationId: string;
}

const WORD_METRIC = 'word_count_monthly';

export function SlackChannelsTab({ integrationId }: SlackChannelsTabProps) {
    const { selectedWorkspaceId } = useAppStore();
    const { data: channels, isLoading } = $api.useQuery(
        "get",
        "/integrations/slack/{integrationId}/channels",
        { params: { path: { integrationId } } },
    );
    const { data: limits } = $api.useQuery(
        'get',
        '/billing/workspace/{workspaceId}/limits',
        { params: { path: { workspaceId: selectedWorkspaceId ?? '' } } },
        { enabled: !!selectedWorkspaceId },
    );
    const wordLimit = limits?.find(
        (l: Schemas['LimitCheckResponse']) => l.metric === WORD_METRIC,
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!channels || channels.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground text-sm">
                No channels found
            </div>
        );
    }

    return (
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Channel</TableHead>
                            <TableHead>Members</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Words</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(channels as Record<string, any>[]).map((channel) => (
                            <TableRow key={channel.id ?? channel.name}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Hash className="size-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">
                                            {channel.name ?? 'Unknown'}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {channel.num_members ?? channel.numMembers ?? '--'}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {channel.is_private ?? channel.isPrivate
                                        ? 'Private'
                                        : 'Public'}
                                </TableCell>
                                <TableCell className="text-right text-sm text-muted-foreground">
                                    {channel.wordCount != null
                                        ? formatNumber(channel.wordCount)
                                        : '—'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            {wordLimit && (
                <div className="px-4 py-3 border-t text-xs text-muted-foreground">
                    Total this month: {formatNumber(wordLimit.current ?? 0)} words
                </div>
            )}
        </Card>
    );
}
