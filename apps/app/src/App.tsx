import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
    const loc = useLocation();
    return (
        <Routes location={loc}>
            <Route path="/login" element={<Login />} />
            <Route
                path="/"
                element={
                    // <ProtectedRoute>
                    <Dashboard />
                    // </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
