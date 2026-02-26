import { PlusIcon } from 'lucide-react';
import { SidebarMenuAction } from '@workspace/ui/components/sidebar';
import { Spinner } from '@workspace/ui/components/spinner';
import { useNavigate } from 'react-router-dom';
import { convertMemoryIdToSlug } from '@/lib/memoryUtils';
import { useCreateMemory } from '@/hooks/memory/useCreateMemory';

export function AddMemory({
    clusterId,
    workspaceId,
}: {
    clusterId: string;
    workspaceId: string;
}) {
    const navigate = useNavigate();
    const { mutateAsync, isPending } = useCreateMemory({
        clusterId,
        workspaceId,
    });

    const handleCreateMemory = async (
        e: React.MouseEvent<HTMLButtonElement>,
    ) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const data = await mutateAsync();
            navigate(`/${convertMemoryIdToSlug(data.id)}`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <SidebarMenuAction
            showOnHover
            className="right-8"
            onClick={handleCreateMemory}
        >
            {isPending ? <Spinner /> : <PlusIcon />}
        </SidebarMenuAction>
    );
}
