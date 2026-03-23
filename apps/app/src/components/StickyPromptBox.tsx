import { useNavigate, useLocation } from 'react-router-dom';
import { useSidebar } from '@workspace/ui/components/sidebar';
import PromptBox from './PromptBox';

export function StickyPromptBox({
    onSubmit,
    placeholder = 'Ask a follow-up question...',
}: {
    onSubmit?: (query: string) => void;
    placeholder?: string;
}) {
    const navigate = useNavigate();
    const location = useLocation();
    const { state, isMobile } = useSidebar();

    const handleSubmit = (query: string) => {
        if (onSubmit) {
            onSubmit(query);
        } else {
            navigate(`${location.pathname}?q=${encodeURIComponent(query)}`);
        }
    };

    const sidebarOffset = isMobile
        ? '0px'
        : state === 'collapsed'
          ? 'var(--sidebar-width-icon)'
          : 'var(--sidebar-width)';

    return (
        <div
            className="fixed bottom-0 right-0 z-30 pointer-events-none"
            style={{ left: sidebarOffset }}
        >
            <div className="h-6 bg-gradient-to-t from-background to-transparent" />
            <div className="bg-background pb-4 px-4 pointer-events-auto">
                <div className="max-w-3xl mx-auto">
                    <PromptBox
                        placeholder={placeholder}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
}
