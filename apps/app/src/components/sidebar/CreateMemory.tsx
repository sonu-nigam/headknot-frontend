import { PlusIcon } from 'lucide-react';
import { useSidebar } from '@workspace/ui/components/sidebar';
import { useNavigate } from 'react-router-dom';
import { convertMemoryIdToSlug } from '@/lib/memoryUtils';
import { useCreateMemory } from '@/hooks/memory/useCreateMemory';
import { Button } from '@workspace/ui/components/button';

export function CreateMemory({
    clusterId,
    workspaceId,
}: {
    clusterId: string;
    workspaceId: string;
}) {
    const navigate = useNavigate();
    const { isMobile, state } = useSidebar();
    const isExpandedView = isMobile || state === 'expanded';
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
        <Button
            className="mx-2"
            size={isExpandedView ? 'default' : 'icon'}
            onClick={handleCreateMemory}
        >
            <PlusIcon />
            {isExpandedView && (
                <>
                    New Memory
                    <span className="ml-auto">⌘K</span>
                </>
            )}
        </Button>
    );
}
