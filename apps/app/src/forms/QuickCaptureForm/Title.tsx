import { useMutation } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Input } from '@workspace/ui/components/input';
import { useDebounceFn } from 'ahooks';

export function Title({
    initialValue,
    memoryId,
}: {
    initialValue: string;
    memoryId: string;
}) {
    const capture = useMutation({
        mutationFn: async ({ title }: { title: string }) => {
            const { error, data } = await api.PATCH('/memory/{id}/title', {
                params: {
                    path: {
                        id: memoryId || '',
                    },
                },
                body: {
                    title: title || '',
                },
            });
            if (error) throw error;
            return data;
        },
    });

    const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        await capture.mutateAsync({
            title: e.target.value,
        });
    };

    const onChangeDebounced = useDebounceFn(onChange, { wait: 500 });

    return (
        <Input
            id="title"
            autoFocus
            placeholder="New Memory"
            defaultValue={initialValue}
            onChange={onChangeDebounced.run}
            className="text-5xl sm:text-5xl md:text-5xl px-4 h-14 border-none shadow-none font-bold ring-0 focus:ring-0 focus-visible:ring-0"
        />
    );
}
