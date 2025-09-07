import { FormEvent, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@workspace/ui/components/button';
import { LoginForm } from '@/forms/login-form';

export default function Login() {
    const [sp] = useSearchParams();
    const next = sp.get('next') || '/';
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErr('');
        setLoading(true);
        const fd = new FormData(e.currentTarget);
        const body = JSON.stringify({ email: fd.get('email'), password: fd.get('password') });
        const r = await fetch('/bff/auth/login', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            credentials: 'include',
            body
        });
        setLoading(false);
        if (r.ok) window.location.href = next;
        else setErr('Login failed');
    }

    return (
        <div className="min-h-screen grid place-items-center">
            <LoginForm className="w-full max-w-sm" />
        </div>
    );
}
