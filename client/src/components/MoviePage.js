import React, { useState } from 'react'
import MovieFilter from './MovieFilter'
import MovieList from './MovieList'

const MoviePage = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    genre: '',
    region: '',
    runtime: 0,
    rating: 0,
    releaseYear: 0,
    awarded: false,
    rated: false
  })

  const handleFiltersChange = (filters) => {
    setSelectedFilters(filters)
  }

  return (
    <>
      <MovieFilter onFiltersChange={handleFiltersChange} />
      <MovieList filters={selectedFilters} />
    </>
  )
}

export default MoviePage
