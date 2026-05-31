import { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Terms } from './pages/Terms';
import { Support } from './pages/Support';

// On navigation, jump to the top for new pages, or to the targeted section when
// the URL carries a hash (e.g. /#faq from another page).
function ScrollManager() {
    const { pathname, hash } = useLocation();
    useEffect(() => {
        if (hash) {
            const el = document.getElementById(hash.slice(1));
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
                return;
            }
        }
        window.scrollTo(0, 0);
    }, [pathname, hash]);
    return null;
}

export default function App() {
    return (
        <>
            <ScrollManager />
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/support" element={<Support />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}
