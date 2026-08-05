import React from 'react'

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
