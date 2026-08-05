import React, { useState } from 'react'
import Catalog from './pages/Catalog'
import Form from './pages/Form'
import Home from './pages/Home'
import MovieView from './pages/MovieView'

export default function App() {
  const [page, setPage] = useState('home')
  const [selectedMovie, setSelectedMovie] = useState(null)

  function openHome() {
    setSelectedMovie(null)
    setPage('home')
  }

  function openCatalog() {
    setSelectedMovie(null)
    setPage('catalog')
  }

  function openForm() {
    setSelectedMovie(null)
    setPage('form')
  }

  function openMovie(movie) {
    setSelectedMovie(movie)
    setPage('detail')
  }

  return (
    <div className="app">
      <main>
        {page === 'home' && <Home onOpenCatalog={openCatalog} />}
        {page === 'catalog' && <Catalog onSelectMovie={openMovie} />}
        {page === 'form' && <Form />}
        {page === 'detail' && selectedMovie && (
          <MovieView movie={selectedMovie} onBack={openCatalog} />
        )}
      </main>
    </div>
  )
}
