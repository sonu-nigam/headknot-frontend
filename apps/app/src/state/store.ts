import { create } from 'zustand';

type State = {
    captureMemoryFormVisible: boolean;
};

type Actions = {
    displayCaptureMemoryForm: () => void;
    hideCaptureMemoryForm: () => void;
    toggleCaptureMemoryForm: () => void;
};

export const useAppStore = create<State & Actions>((set) => ({
    captureMemoryFormVisible: false,
    displayCaptureMemoryForm: () => set({ captureMemoryFormVisible: true }),
    hideCaptureMemoryForm: () => set({ captureMemoryFormVisible: false }),
    toggleCaptureMemoryForm: () =>
        set((state) => ({
            captureMemoryFormVisible: !state.captureMemoryFormVisible,
        })),
}));
