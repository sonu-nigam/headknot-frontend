import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
    captureMemoryFormVisible: boolean;
    /**
     * The selected workspace id in the sidenav.
     * Persisted to local storage so the selection survives reloads.
     */
    selectedWorkspaceId: string | null;
};

type Actions = {
    displayCaptureMemoryForm: () => void;
    hideCaptureMemoryForm: () => void;
    toggleCaptureMemoryForm: () => void;

    /**
     * Set the currently selected workspace id (or null to clear selection).
     */
    setSelectedWorkspaceId: (id: string | null) => void;

    /**
     * Convenience helper to clear the currently selected workspace.
     */
    clearSelectedWorkspaceId: () => void;
};

/**
 * Application-wide store.
 *
 * - Keeps `captureMemoryFormVisible` in memory only.
 * - Persists `selectedWorkspaceId` using zustand's `persist` middleware.
 *
 * Note: we only persist the `selectedWorkspaceId` slice via `partialize` to avoid
 * accidentally persisting other UI state.
 */
export const useAppStore = create<State & Actions>()(
    persist(
        (set) => ({
            // UI state (not persisted)
            captureMemoryFormVisible: false,

            // Persisted state
            selectedWorkspaceId: null,

            // Actions for capture memory form
            displayCaptureMemoryForm: () =>
                set({ captureMemoryFormVisible: true }),
            hideCaptureMemoryForm: () =>
                set({ captureMemoryFormVisible: false }),
            toggleCaptureMemoryForm: () =>
                set((state) => ({
                    captureMemoryFormVisible: !state.captureMemoryFormVisible,
                })),

            // Actions for selected workspace
            setSelectedWorkspaceId: (id: string | null) =>
                set({ selectedWorkspaceId: id }),
            clearSelectedWorkspaceId: () => set({ selectedWorkspaceId: null }),
        }),
        {
            name: 'app-store', // key in localStorage
            /**
             * Persist only the selectedWorkspaceId field.
             * This avoids persisting ephemeral UI flags like modals.
             */
            partialize: (state) => ({
                selectedWorkspaceId: state.selectedWorkspaceId,
            }),
        },
    ),
);
