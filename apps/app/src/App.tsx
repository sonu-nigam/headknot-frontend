import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Signup from './pages/Signup';
import MemoryPage from './pages/Memory/MemoryPage';
import NotFoundPage from './pages/NotFoundPage';
import MemoryListPage from './pages/Memory/MemoryListPage';

export default function App() {
    const loc = useLocation();
    return (
        <Routes location={loc}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/memory"
                element={
                    <ProtectedRoute>
                        <MemoryListPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/:memorySlug"
                element={
                    <ProtectedRoute>
                        <MemoryPage />
                    </ProtectedRoute>
                }
            />
            <Route path="/not-found" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
