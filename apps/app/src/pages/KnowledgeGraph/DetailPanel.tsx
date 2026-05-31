import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import { Button } from '@workspace/ui/components/button';
import { X, Loader2, AlertCircle, RotateCcw } from 'lucide-react';

/** Gap (px) between the anchored node and the floating card. */
const ANCHOR_GAP = 16;
/** Keep the card at least this far (px) from the canvas edges. */
const VIEWPORT_MARGIN = 8;

interface DetailPanelProps {
    /** Header content for the loaded state (e.g. an <h2>). Loading/error headers are handled here. */
    title: ReactNode;
    onClose: () => void;
    loading?: boolean;
    error?: boolean;
    onRetry?: () => void;
    children: ReactNode;
}

/**
 * Shared shell for the knowledge-graph detail panels (entity / relationship) — a
 * floating card the graph pins beside the selected node/edge (see {@link FloatingDetail}).
 *
 * Owns the cross-cutting UX so both panels stay consistent: a pinned header whose
 * close button never scrolls away, Escape-to-close, open/close motion, and the
 * loading / error presentation.
 */
export function DetailPanel({
    title,
    onClose,
    loading = false,
    error = false,
    onRetry,
    children,
}: DetailPanelProps) {
    // Once true, the panel plays its exit animation and calls onClose when it ends.
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setClosing(true);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    return (
        <div
            className={`flex max-h-[70vh] w-80 flex-col overflow-hidden rounded-xl border bg-card shadow-xl duration-150 ${
                closing
                    ? 'animate-out zoom-out-95 fade-out'
                    : 'animate-in zoom-in-95 fade-in'
            }`}
            onAnimationEnd={(e) => {
                // Ignore animations bubbling up from children (collapsibles, spinners).
                if (e.target === e.currentTarget && closing) onClose();
            }}
        >
            {/* Header — shrink-0 so it stays pinned while only the body scrolls */}
            <div className="flex shrink-0 items-center justify-between gap-2 border-b p-4">
                <div className="min-w-0 flex-1">
                    {loading ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="size-4 animate-spin" />
                            <span className="text-sm">Loading...</span>
                        </div>
                    ) : error ? (
                        <span className="text-sm text-muted-foreground">
                            Couldn&apos;t load
                        </span>
                    ) : (
                        title
                    )}
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0"
                    onClick={() => setClosing(true)}
                >
                    <X className="size-4" />
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center gap-3 px-4 py-12 text-center">
                    <AlertCircle className="size-6 text-destructive" />
                    <p className="text-xs text-muted-foreground">
                        Something went wrong loading this panel.
                    </p>
                    {onRetry && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-xs"
                            onClick={onRetry}
                        >
                            <RotateCcw className="size-3" />
                            Retry
                        </Button>
                    )}
                </div>
            ) : (
                <div className="flex-1 space-y-4 overflow-y-auto p-4">{children}</div>
            )}
        </div>
    );
}

/**
 * Positions its child beside a graph node/edge. `anchor` is the node's screen
 * position within the graph canvas (the nearest positioned ancestor). The card
 * sits to the right of the node, flips left when it would overflow, and is
 * clamped inside the canvas. When `anchor` is null it parks in the top-right.
 */
export function FloatingDetail({
    anchor,
    visible = true,
    children,
}: {
    anchor: { x: number; y: number } | null;
    /** When false the card stays mounted (so it can fetch) but hidden. */
    visible?: boolean;
    children: ReactNode;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;

        const reposition = () => {
            const parent = el.offsetParent as HTMLElement | null;
            const cw = parent?.clientWidth ?? window.innerWidth;
            const ch = parent?.clientHeight ?? window.innerHeight;
            const pw = el.offsetWidth;
            const ph = el.offsetHeight;

            if (!anchor) {
                // No node position yet — park the card in the top-right corner.
                setPos({
                    left: Math.max(VIEWPORT_MARGIN, cw - pw - VIEWPORT_MARGIN),
                    top: VIEWPORT_MARGIN,
                });
                return;
            }

            // Prefer the card to the right of the node; flip left on overflow.
            let left = anchor.x + ANCHOR_GAP;
            if (left + pw > cw - VIEWPORT_MARGIN) {
                left = anchor.x - ANCHOR_GAP - pw;
            }
            left = Math.max(
                VIEWPORT_MARGIN,
                Math.min(left, cw - pw - VIEWPORT_MARGIN),
            );

            // Vertically centre on the node, clamped inside the canvas.
            let top = anchor.y - ph / 2;
            top = Math.max(
                VIEWPORT_MARGIN,
                Math.min(top, ch - ph - VIEWPORT_MARGIN),
            );

            setPos({ left, top });
        };

        reposition();
        // Reposition when the card's own size changes (data loads, sections expand).
        const ro = new ResizeObserver(reposition);
        ro.observe(el);
        return () => ro.disconnect();
    }, [anchor]);

    return (
        <div
            ref={ref}
            className="absolute z-30"
            style={{
                left: pos?.left ?? 0,
                top: pos?.top ?? 0,
                visibility: pos && visible ? 'visible' : 'hidden',
            }}
        >
            {children}
        </div>
    );
}
