import { useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

export function CheckoutCancelPage() {
    const firedRef = useRef(false);

    useEffect(() => {
        if (firedRef.current) return;
        firedRef.current = true;
        toast.info('No changes made');
    }, []);

    return <Navigate to="/billing" replace />;
}
