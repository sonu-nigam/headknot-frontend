import { useEffect, useRef, useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { $api } from '@workspace/api-client';
import { useQueryClient } from '@tanstack/react-query';
import { invalidateByPath } from '@/lib/queryKeys';

interface GoogleDrivePickerDialogProps {
    integrationId: string;
    onClose: () => void;
}

export function GoogleDrivePickerDialog({
    integrationId,
    onClose,
}: GoogleDrivePickerDialogProps) {
    const queryClient = useQueryClient();
    const pickerOpenedRef = useRef(false);
    const [syncedCount, setSyncedCount] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { data: tokenData, isLoading: tokenLoading } = $api.useQuery(
        "get",
        "/integrations/google-drive/{integrationId}/token",
        { params: { path: { integrationId } } },
    );

    const syncMutation = $api.useMutation(
        "post",
        "/integrations/google-drive/{integrationId}/sync/files",
        {
            onSuccess: () => {
                invalidateByPath(queryClient, "get", "/integrations");
            },
        },
    );

    // Open Google Picker once token is available
    useEffect(() => {
        if (!tokenData || pickerOpenedRef.current) return;

        const accessToken =
            (tokenData as Record<string, string>).accessToken ??
            (tokenData as Record<string, string>).access_token;
        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

        if (!accessToken || !apiKey) {
            setError('Missing access token or API key for Google Picker');
            return;
        }

        pickerOpenedRef.current = true;

        const gapi = (window as any).gapi;
        if (!gapi) {
            setError('Google API not loaded. Please refresh and try again.');
            return;
        }

        gapi.load('picker', () => {
            const google = (window as any).google;

            const docsView = new google.picker.DocsView()
                .setIncludeFolders(true)
                .setSelectFolderEnabled(true)
                .setMimeTypes(
                    'text/plain,' +
                    'text/csv,' +
                    'text/markdown,' +
                    'text/html,' +
                    'text/xml,' +
                    'application/pdf,' +
                    'application/rtf,' +
                    'application/vnd.google-apps.document,' +
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document,' +
                    'application/msword,' +
                    'application/json'
                );

            // App ID is the numeric Google Cloud project ID (from the OAuth client ID)
            const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';
            const appId = clientId.split('-')[0];

            const picker = new google.picker.PickerBuilder()
                .addView(docsView)
                .setOAuthToken(accessToken)
                .setDeveloperKey(apiKey)
                .setAppId(appId)
                .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
                .enableFeature(google.picker.Feature.SUPPORT_DRIVES)
                .setCallback((data: any) => {
                    if (data.action === google.picker.Action.PICKED) {
                        const fileIds = data.docs.map((doc: any) => doc.id);
                        setSyncedCount(fileIds.length);
                        syncMutation.mutate({
                            params: { path: { integrationId } },
                            body: { fileIds },
                        });
                    } else if (data.action === google.picker.Action.CANCEL) {
                        onClose();
                    }
                })
                .build();

            picker.setVisible(true);
        });
    }, [tokenData, integrationId, onClose, syncMutation]);

    // Sync complete
    if (syncMutation.isSuccess && syncedCount !== null) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-card border rounded-xl shadow-xl max-w-sm w-full mx-4 p-8 flex flex-col items-center gap-4">
                    <CheckCircle2 className="size-10 text-emerald-500" />
                    <p className="text-sm text-muted-foreground text-center">
                        {syncedCount} item{syncedCount !== 1 ? 's' : ''} synced successfully
                    </p>
                    <Button onClick={onClose} className="w-full">
                        Done
                    </Button>
                </div>
            </div>
        );
    }

    // Error
    if (error || syncMutation.isError) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-card border rounded-xl shadow-xl max-w-sm w-full mx-4 p-8 flex flex-col items-center gap-4">
                    <p className="text-sm text-destructive text-center">
                        {error ?? 'Failed to sync files. Please try again.'}
                    </p>
                    <Button variant="outline" onClick={onClose} className="w-full">
                        Close
                    </Button>
                </div>
            </div>
        );
    }

    // Loading / Picker open
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-card border rounded-xl shadow-xl max-w-sm w-full mx-4 p-8 flex flex-col items-center gap-4">
                <Loader2 className="size-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground text-center">
                    {tokenLoading
                        ? 'Preparing file picker...'
                        : syncMutation.isPending
                          ? `Syncing ${syncedCount ?? 0} item${(syncedCount ?? 0) !== 1 ? 's' : ''}...`
                          : 'Opening Google Drive picker...'}
                </p>
            </div>
        </div>
    );
}
