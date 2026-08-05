import React, { useState } from 'react'

const apiBase = import.meta.env.VITE_API_BASE_URL || ''

export default function Form() {
  const [title, setTitle] = useState('')
  const [subGenre, setSubGenre] = useState('')
  const [releaseYear, setReleaseYear] = useState('')
  const [director, setDirector] = useState('')
  const [rating, setRating] = useState('')
  const [review, setReview] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setError('')
    setSaving(true)

    const payload = {
      title: title.trim(),
      subGenre: subGenre.trim(),
      releaseYear: releaseYear ? Number(releaseYear) : undefined,
      director: director.trim(),
      rating: rating ? Number(rating) : undefined,
      review: review.trim(),
    }

    try {
      const response = await fetch(`${apiBase}/movies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Unable to save movie')
      }

      setMessage('Movie saved successfully.')
      setTitle('')
      setSubGenre('')
      setReleaseYear('')
      setDirector('')
      setRating('')
      setReview('')
    } catch (err) {
      setError(err.message || 'Unable to save movie')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="form-page">
      <div className="page-header">
        <h2>Add Movie</h2>
        <p>Enter movie details to add a new horror entry to the catalog.</p>
      </div>
      <form className="movie-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Movie title" required />
          </label>
          <label>
            Sub-genre
            <input value={subGenre} onChange={(e) => setSubGenre(e.target.value)} placeholder="e.g. Slasher" />
          </label>
        </div>
        <div className="form-row">
          <label>
            Release Year
            <input value={releaseYear} onChange={(e) => setReleaseYear(e.target.value)} placeholder="2024" />
          </label>
          <label>
            Director
            <input value={director} onChange={(e) => setDirector(e.target.value)} placeholder="Director name" />
          </label>
        </div>
        <div className="form-row">
          <label>
            Rating
            <input value={rating} onChange={(e) => setRating(e.target.value)} placeholder="7.5" />
          </label>
        </div>
        <label className="form-fullwidth">
          Review
          <textarea value={review} onChange={(e) => setReview(e.target.value)} placeholder="Personal review or notes" />
        </label>
        <div className="form-actions">
          <button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save Movie'}
          </button>
        </div>
        {message && <div className="form-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
      </form>
    </section>
  )
}
