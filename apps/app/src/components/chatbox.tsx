import { Textarea } from '@workspace/ui/components/textarea';
import { cn } from '@workspace/ui/lib/utils';

export function Chatbox({ className }: { className?: string }) {
    return (
        <div className={cn('w-full flex flex-col', className)}>
            <Textarea placeholder="What are you looking for today?" />
        </div>
    );
}
