import React from 'react'

export default function MovieView({ movie, onBack }) {
  if (!movie) {
    return null
  }

  return (
    <section className="movie-view">
      <div className="page-header">
        <div>
          <h2>{movie.title}</h2>
          <p>{movie.subGenre} · {movie.releaseYear} · Directed by {movie.director}</p>
        </div>
        <button type="button" onClick={onBack}>Back to catalog</button>
      </div>
      <div className="movie-detail-card">
        <div className="detail-row">
          <span className="detail-label">Rating</span>
          <span>{movie.rating?.toFixed(1) || '—'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Review</span>
          <span>{movie.review}</span>
        </div>
        {movie.cast && movie.cast.length > 0 && (
          <div className="detail-row">
            <span className="detail-label">Cast</span>
            <span>{movie.cast.join(', ')}</span>
          </div>
        )}
      </div>
    </section>
  )
}
