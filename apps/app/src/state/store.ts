import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DismissedBanner = {
    state: string;
    /** Unix epoch millis after which the banner is shown again. */
    until: number;
};

type State = {
    captureMemoryFormVisible: boolean;
    /**
     * The selected workspace id in the sidenav.
     * Persisted to local storage so the selection survives reloads.
     */
    selectedWorkspaceId: string | null;
    dismissedBillingBanner: DismissedBanner | null;
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

    dismissBillingBanner: (state: string, ttlMs?: number) => void;
    clearDismissedBillingBanner: () => void;
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
const DEFAULT_DISMISS_TTL_MS = 24 * 60 * 60 * 1000;

export const useAppStore = create<State & Actions>()((set) => ({
    // UI state (not persisted)
    captureMemoryFormVisible: false,

    // Persisted state
    selectedWorkspaceId: null,
    dismissedBillingBanner: null,

    // Actions for capture memory form
    displayCaptureMemoryForm: () => set({ captureMemoryFormVisible: true }),
    hideCaptureMemoryForm: () => set({ captureMemoryFormVisible: false }),
    toggleCaptureMemoryForm: () =>
        set((state) => ({
            captureMemoryFormVisible: !state.captureMemoryFormVisible,
        })),

    // Actions for selected workspace
    setSelectedWorkspaceId: (id: string | null) =>
        set({ selectedWorkspaceId: id }),
    clearSelectedWorkspaceId: () => set({ selectedWorkspaceId: null }),

    dismissBillingBanner: (state, ttlMs = DEFAULT_DISMISS_TTL_MS) =>
        set({
            dismissedBillingBanner: {
                state,
                until: Date.now() + ttlMs,
            },
        }),
    clearDismissedBillingBanner: () => set({ dismissedBillingBanner: null }),
}));
