import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import Auth from '../components/Auth';

export default function Home({ onOpenCatalog }) {
  const [session, setSession] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setShowAuth(false); // Hide login form when logged in
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleVaultClick = () => {
    if (session) {
      onOpenCatalog(); // Logged in -> go to catalog
    } else {
      setShowAuth(true); // Not logged in -> reveal login form
    }
  };

  return (
    <section className="landing-page">
      <div className="landing-banner">
        <div className="banner-line">=====================================================</div>
        <div className="banner-text">
          <div>ARE YOU SCARED?</div>
          <div>You should be.</div>
        </div>
        <div className="banner-line">=====================================================</div>
      </div>

      <div className="landing-copy">
        <h1>Welcome, horror fans.</h1>
        <p>Sink into the shadows and explore the darkest, most chilling horror movies in the collection.</p>
        <blockquote className="catalog-quote">
          “Monsters are real, and ghosts are real too. They live inside us, and sometimes, they win.”
          <span>— Stephen King</span>
        </blockquote>

        <div className="landing-actions mt-6">
          {!showAuth ? (
            <button type="button" onClick={handleVaultClick}>
              {session ? 'Descend into the Vault' : 'Descend into the Vault (Login Required)'}
            </button>
          ) : (
            <div className="mt-4">
              <Auth />
              <button
                onClick={() => setShowAuth(false)}
                className="mt-2 text-xs text-stone-500 hover:text-stone-300 underline"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
/*
export default function Home({ onOpenCatalog }) {
  return (
    <section className="landing-page">
      <div className="landing-banner">
        <div className="banner-line">=====================================================</div>
        <div className="banner-text">
          <div>ARE YOU SCARED?</div>
          <div>You should be.</div>
        </div>
        <div className="banner-line">=====================================================</div>
      </div>

      <div className="landing-copy">
        <h1>Welcome, horror fans.</h1>
        <p>Sink into the shadows and explore the darkest, most chilling horror movies in the collection.</p>
        <blockquote className="catalog-quote">
          “Monsters are real, and ghosts are real too. They live inside us, and sometimes, they win.”
          <span>— Stephen King</span>
        </blockquote>
        <div className="landing-actions">
          <button type="button" onClick={onOpenCatalog}>
            Descend into the Vault
          </button>
        </div>
      </div>
    </section>
  )
}
*/