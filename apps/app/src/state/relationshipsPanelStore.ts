import { create } from 'zustand';

interface RelationshipsPanelState {
    /** Which view is active: memory-level or block-level */
    view: 'memory' | 'block' | null;
    /** Block ID when viewing block-level relationships */
    activeBlockId: string | null;
    /** Memory ID for the current memory */
    memoryId: string | null;

    openMemoryView: (memoryId: string) => void;
    openBlockView: (memoryId: string, blockId: string) => void;
    close: () => void;
}

export const useRelationshipsPanelStore = create<RelationshipsPanelState>(
    (set) => ({
        view: null,
        activeBlockId: null,
        memoryId: null,

        openMemoryView: (memoryId) =>
            set({ view: 'memory', memoryId, activeBlockId: null }),

        openBlockView: (memoryId, blockId) =>
            set({ view: 'block', memoryId, activeBlockId: blockId }),

        close: () => set({ view: null, activeBlockId: null }),
    }),
);
