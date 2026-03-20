/**
 * Module-level store for the ContextPanel open state and title.
 * Any feature can call contextPanelStore.open('Title') to push content
 * into the right-side ContextPanel, and portal it into #context-panel-slot.
 */
type State = { isOpen: boolean; title: string };
type Subscriber = () => void;

let state: State = { isOpen: false, title: '' };
const subscribers = new Set<Subscriber>();

export const contextPanelStore = {
    getState: (): State => state,

    open: (title: string) => {
        const next = { isOpen: true, title };
        if (state.isOpen && state.title === title) return;
        state = next;
        subscribers.forEach((fn) => fn());
    },

    close: () => {
        if (!state.isOpen) return;
        state = { ...state, isOpen: false };
        subscribers.forEach((fn) => fn());
    },

    subscribe: (fn: Subscriber): (() => void) => {
        subscribers.add(fn);
        return () => subscribers.delete(fn);
    },
};
