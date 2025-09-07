import { FormEvent, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@workspace/ui/components/button';

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
            <form onSubmit={onSubmit} className="w-full max-w-sm rounded-lg border bg-white p-6 space-y-4">
                <h1 className="text-xl font-semibold">Sign in</h1>
                {err && <div className="text-red-600 text-sm">{err}</div>}
                <input name="email" type="email" placeholder="you@example.com" className="w-full border rounded px-3 py-2" required />
                <input name="password" type="password" placeholder="••••••••" className="w-full border rounded px-3 py-2" required />
                <Button type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</Button>
            </form>
        </div>
    );
}
