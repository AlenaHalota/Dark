import React, { useEffect, useState } from 'react'

const apiBase = import.meta.env.VITE_API_BASE_URL || ''

export default function Catalog({ onSelectMovie }) {
  const [movies, setMovies] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadMovies()
  }, [])

  async function loadMovies() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${apiBase}/movies`)
      if (!response.ok) {
        throw new Error('Failed to load movies')
      }
      const data = await response.json()
      setMovies(data.movies || [])
    } catch (err) {
      setError(err.message || 'Unable to load movies')
    } finally {
      setLoading(false)
    }
  }

  async function handleSearch(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const searchQuery = query.trim()
      const url = `${apiBase}/search?q=${encodeURIComponent(searchQuery)}`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Search request failed')
      }
      const data = await response.json()
      setMovies(data.movies || [])
    } catch (err) {
      setError(err.message || 'Unable to search movies')
    } finally {
      setLoading(false)
    }
  }

  function renderMovieCard(movie) {
    return (
      <article
        key={movie.id}
        className="movie-card"
        role="button"
        tabIndex={0}
        onClick={() => onSelectMovie?.(movie)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            onSelectMovie?.(movie)
          }
        }}
      >
        <header>
          <h3>{movie.title}</h3>
          <span className="movie-rating">{movie.rating?.toFixed(1) || '—'}</span>
        </header>
        <p className="movie-meta">
          {movie.subGenre} · {movie.releaseYear} · Directed by {movie.director}
        </p>
        <p className="movie-review">{movie.review}</p>
        {movie.cast && movie.cast.length > 0 && (
          <p className="movie-cast">Cast: {movie.cast.join(', ')}</p>
        )}
      </article>
    )
  }

  return (
    <section className="catalog-page">
      <section className="catalog-intro hero-archive">
        <p>Ever wonder why we willingly pay to be terrified?</p>
        <p>Science calls it <strong>recreational fear</strong> — a psychological sweet spot where adrenaline spikes, hearts race, and our brains secretly thrive. Horror isn't just entertainment; it’s an <span className="hero-highlight">evolutionary simulation</span>. A safe space to confront monsters, practice survival, and experience the intoxicating euphoria of stepping back into the light.</p>
        <p><strong>Welcome to <span className="hero-title">Dark Reel</span>.</strong> Step inside, find your flavor of fear, and feed your morbid curiosity.</p>
      </section>
      <form className="catalog-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button type="submit">Search</button>
        <button type="button" onClick={loadMovies} disabled={loading}>
          Reset
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <p>Loading movies…</p>
      ) : movies.length === 0 ? (
        <p>No movies found.</p>
      ) : (
        <div className="movie-grid">{movies.map(renderMovieCard)}</div>
      )}
    </section>
  )
}
