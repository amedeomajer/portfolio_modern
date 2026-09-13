'use client';

import { FormEvent, useEffect, useState } from 'react';
import { AdminPanel } from '@/components/gallery/AdminPanel';
import { GalleryItem } from '@/types/gallery';

export default function AdminPhotographyPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const loadItems = async () => {
    const response = await fetch('/api/gallery');
    if (!response.ok) throw new Error('Failed to load gallery');
    const data = await response.json();
    setItems(data);
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const authRes = await fetch('/api/auth');
        const authData = await authRes.json();
        const isAuthed = Boolean(authData.authenticated);
        setAuthenticated(isAuthed);
        if (isAuthed) await loadItems();
      } catch (error) {
        console.error('Failed to bootstrap admin', error);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        setAuthError('Wrong password');
        return;
      }
      setAuthenticated(true);
      setPassword('');
      await loadItems();
    } catch {
      setAuthError('Login failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    setAuthenticated(false);
    setItems([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-zinc-950">
        Loading Admin…
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm space-y-4 bg-zinc-900 border border-zinc-800 rounded-xl p-6"
        >
          <div>
            <h1 className="text-2xl font-bold text-white">Gallery Admin</h1>
            <p className="text-sm text-zinc-500 mt-1">Enter password to manage gallery</p>
          </div>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-white"
          />
          {authError && <p className="text-sm text-red-400">{authError}</p>}
          <button
            type="submit"
            disabled={authLoading || !password}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
          >
            {authLoading ? 'Checking…' : 'Log in'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Gallery Management</h1>
          <p className="text-zinc-500">Upload, reorder, and remove photography.</p>
        </header>
        <AdminPanel initialItems={items} onLogout={handleLogout} />
      </div>
    </div>
  );
}
