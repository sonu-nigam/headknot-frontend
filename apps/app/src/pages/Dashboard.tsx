import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Button } from '@workspace/ui/components/button';

type Memory = { id: string; title: string; updatedAt: string };

export default function Dashboard() {
    const qc = useQueryClient();

    const { data: memories, isLoading } = useQuery({
        queryKey: ['memories'],
        queryFn: () => api<Memory[]>('/bff/memories'),
    });

    const createMemory = useMutation({
        mutationFn: async (title: string) =>
        api<Memory>('/bff/memories', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ title }),
        }),
        onMutate: async (title) => {
            await qc.cancelQueries({ queryKey: ['memories'] });
            const prev = qc.getQueryData<Memory[]>(['memories']) || [];
            const temp: Memory = { id: 'temp-' + Date.now(), title, updatedAt: new Date().toISOString() };
        qc.setQueryData<Memory[]>(['memories'], [temp, ...prev]);
        return { prev };
        },
        onError: (_e, _v, ctx) => ctx?.prev && qc.setQueryData(['memories'], ctx.prev),
        onSettled: () => qc.invalidateQueries({ queryKey: ['memories'] }),
    });

    if (isLoading) return <div className="p-6">Loading…</div>;

    return (
        <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Memories</h1>
            <Button onClick={() => createMemory.mutate('New memory')}>+ New</Button>
        </div>

        <ul className="space-y-2">
            {memories?.map(m => (
            <li key={m.id} className="rounded border bg-white p-3">
                <div className="font-medium">{m.title}</div>
                <div className="text-xs text-gray-500">Updated {new Date(m.updatedAt).toLocaleString()}</div>
            </li>
            ))}
            {!memories?.length && <div className="text-gray-500">No memories yet.</div>}
        </ul>
        </div>
    );
}
