import { Loader2, FileText, FileSpreadsheet, Presentation, Image, File } from 'lucide-react';
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

interface GoogleDriveFilesTabProps {
    integrationId: string;
}

function getFileIcon(mimeType?: string) {
    if (!mimeType) return <File className="size-4 text-muted-foreground" />;
    if (mimeType.includes('spreadsheet'))
        return <FileSpreadsheet className="size-4 text-emerald-500" />;
    if (mimeType.includes('presentation'))
        return <Presentation className="size-4 text-amber-500" />;
    if (mimeType.includes('image'))
        return <Image className="size-4 text-blue-500" />;
    if (mimeType.includes('document') || mimeType.includes('text') || mimeType.includes('pdf'))
        return <FileText className="size-4 text-blue-400" />;
    return <File className="size-4 text-muted-foreground" />;
}

export function GoogleDriveFilesTab({ integrationId }: GoogleDriveFilesTabProps) {
    const { data: files, isLoading } = $api.useQuery(
        "get",
        "/integrations/google-drive/{integrationId}/files",
        { params: { path: { integrationId } } },
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!files || files.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground text-sm">
                No files found
            </div>
        );
    }

    return (
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Modified</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(files as Record<string, any>[]).map((file) => (
                            <TableRow key={file.id ?? file.name}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {getFileIcon(file.mimeType)}
                                        <span className="text-sm font-medium truncate max-w-xs">
                                            {file.name ?? 'Untitled'}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {formatMimeType(file.mimeType)}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {file.modifiedTime
                                        ? new Date(file.modifiedTime).toLocaleDateString()
                                        : '--'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

function formatMimeType(mimeType?: string): string {
    if (!mimeType) return '--';
    if (mimeType.includes('document')) return 'Document';
    if (mimeType.includes('spreadsheet')) return 'Spreadsheet';
    if (mimeType.includes('presentation')) return 'Presentation';
    if (mimeType.includes('pdf')) return 'PDF';
    if (mimeType.includes('image')) return 'Image';
    if (mimeType.includes('folder')) return 'Folder';
    if (mimeType.includes('text')) return 'Text';
    return 'File';
}
