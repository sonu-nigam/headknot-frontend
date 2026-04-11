import { $api } from '@workspace/api-client';
import { Button } from '@workspace/ui/components/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogTrigger,
} from '@workspace/ui/components/dialog';
import { Input } from '@workspace/ui/components/input';
import { useSidebar } from '@workspace/ui/components/sidebar';
import { SearchIcon } from 'lucide-react';
import { useState } from 'react';

export function SearchApp({}) {
    const [query, setQuery] = useState<string>('');
    const { isMobile, state } = useSidebar();
    const isExpandedView = isMobile || state === 'expanded';

    const searchReason = $api.useMutation("post", "/reason", {
        onSuccess: (data) => {
            console.log(data);
        },
        onError: (error) => {
            console.error(error);
        },
    });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className="mx-2"
                    size={isExpandedView ? 'sm' : 'icon-sm'}
                    variant="ghost"
                >
                    <SearchIcon />
                    {isExpandedView && (
                        <>
                            Search
                            <span className="ml-auto">⌘K</span>
                        </>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm" showCloseButton={false}>
                <Input
                    id="name-1"
                    name="name"
                    defaultValue="Pedro Duarte"
                    onChange={(event) => setQuery(event.target.value)}
                />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        onClick={() => searchReason.mutateAsync({ body: { message: query } })}
                    >
                        Search
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
