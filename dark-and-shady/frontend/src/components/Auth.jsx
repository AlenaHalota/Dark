import { useState } from 'react';
import { supabase } from '../services/supabaseClient';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const signIn = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    setMessage(error ? error.message : 'Signed in successfully.');
  };

  const signUp = async () => {
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);
    setMessage(error ? error.message : 'Check your email for confirmation.');
  };

  return (
    <section className="auth-card max-w-md mx-auto p-6 bg-stone-900 border border-stone-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-rose-300 mb-4">Sign in to the Vault</h2>
      <form onSubmit={signIn} className="space-y-4">
        <label className="block">
          <span className="text-stone-300 text-sm">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-1 w-full rounded border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100"
          />
        </label>

        <label className="block">
          <span className="text-stone-300 text-sm">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="mt-1 w-full rounded border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100"
          />
        </label>

        <div className="flex flex-col gap-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded bg-rose-600 hover:bg-rose-500 disabled:opacity-50"
          >
            {loading ? 'Working…' : 'Sign in'}
          </button>
          <button
            type="button"
            onClick={signUp}
            disabled={loading}
            className="px-4 py-2 rounded border border-stone-700 text-stone-100 hover:bg-stone-800 disabled:opacity-50"
          >
            {loading ? 'Working…' : 'Sign up'}
          </button>
        </div>
      </form>

      {message && <p className="mt-4 text-sm text-stone-300">{message}</p>}
    </section>
  );
    return (
      <div className="min-h-screen bg-stone-950 text-rose-600 flex items-center justify-center font-serif">
        Loading the Crypt...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-stone-950 text-gray-100 p-8 font-sans">
      {!session ? (
        <Auth />
      ) : (
        <div className="max-w-xl mx-auto text-center space-y-4">
          <h1 className="text-3xl font-serif text-rose-600">Welcome to the Cult</h1>
          <p className="text-stone-400">
            Logged in as: <span className="text-rose-400 font-mono">{session.user.email}</span>
          </p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="px-4 py-2 bg-stone-900 hover:bg-rose-900/60 border border-rose-950 text-stone-300 rounded transition"
          >
            Log Out
          </button>
        </div>
      )}
    </main>
  );
