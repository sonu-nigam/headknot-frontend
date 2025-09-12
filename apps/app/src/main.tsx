import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/theme-provider';
import App from './App';
import '@workspace/ui/globals.css';

const qc = new QueryClient({
    defaultOptions: {
        queries: { refetchOnWindowFocus: true, staleTime: 30_000 },
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={qc}>
            <BrowserRouter>
                <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                    <App />
                </ThemeProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>,
);
