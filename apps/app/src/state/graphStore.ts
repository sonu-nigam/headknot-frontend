import { create } from 'zustand';

interface GraphState {
    selectedNodeId: string | null;
    selectedNodeType: 'entity' | 'event' | null;
    highlightedPath: string[] | null;
    pathFinderOpen: boolean;
    temporalFilterOpen: boolean;
    entityTypeFilters: Set<string>;

    selectNode: (id: string, type: 'entity' | 'event') => void;
    clearSelection: () => void;
    setHighlightedPath: (path: string[] | null) => void;
    togglePathFinder: () => void;
    toggleTemporalFilter: () => void;
    toggleEntityTypeFilter: (type: string) => void;
    qaPanelOpen: boolean;
    toggleQAPanel: () => void;
}

export const useGraphStore = create<GraphState>((set) => ({
    selectedNodeId: null,
    selectedNodeType: null,
    highlightedPath: null,
    pathFinderOpen: false,
    temporalFilterOpen: false,
    entityTypeFilters: new Set<string>(),
    qaPanelOpen: false,

    selectNode: (id, type) =>
        set({ selectedNodeId: id, selectedNodeType: type }),
    clearSelection: () =>
        set({ selectedNodeId: null, selectedNodeType: null }),
    setHighlightedPath: (path) => set({ highlightedPath: path }),
    togglePathFinder: () =>
        set((s) => ({ pathFinderOpen: !s.pathFinderOpen })),
    toggleTemporalFilter: () =>
        set((s) => ({ temporalFilterOpen: !s.temporalFilterOpen })),
    toggleEntityTypeFilter: (type) =>
        set((s) => {
            const next = new Set(s.entityTypeFilters);
            if (next.has(type)) next.delete(type);
            else next.add(type);
            return { entityTypeFilters: next };
        }),
    toggleQAPanel: () =>
        set((s) => ({ qaPanelOpen: !s.qaPanelOpen })),
}));
