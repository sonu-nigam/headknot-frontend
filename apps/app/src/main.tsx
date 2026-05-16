import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import {
    MutationCache,
    QueryCache,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { toast } from 'sonner';
import { ThemeProvider } from './components/ThemeProvider';
import App from './App';
import '@workspace/ui/globals.css';

// Global 402 (Payment Required) handler — backend returns 402 when a workspace exceeds its
// plan's word or integration limit. We surface a single dedupe-throttled toast and let the
// caller's normal error path handle local UI (no swallowing).
let lastQuotaToastAt = 0;
function maybeToastQuotaExceeded(error: unknown) {
    const status = (error as { status?: number } | null)?.status;
    if (status !== 402) return;
    const now = Date.now();
    if (now - lastQuotaToastAt < 3000) return;
    lastQuotaToastAt = now;
    toast.error("You've hit your plan limit. Upgrade to continue.", {
        action: {
            label: 'Upgrade',
            onClick: () => {
                window.location.href = '/billing';
            },
        },
    });
}

const qc = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            staleTime: 30_000,
            experimental_prefetchInRender: true,
        },
    },
    queryCache: new QueryCache({
        onError: maybeToastQuotaExceeded,
    }),
    mutationCache: new MutationCache({
        onError: maybeToastQuotaExceeded,
    }),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <GoogleOAuthProvider
            clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}
        >
            <QueryClientProvider client={qc}>
                <BrowserRouter
                    future={{
                        v7_relativeSplatPath: true,
                        v7_startTransition: true,
                    }}
                >
                    <ThemeProvider
                        defaultTheme="dark"
                        storageKey="vite-ui-theme"
                    >
                        <App />
                    </ThemeProvider>
                </BrowserRouter>
            </QueryClientProvider>
        </GoogleOAuthProvider>
    </React.StrictMode>,
);
