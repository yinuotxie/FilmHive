import React, { useState } from 'react'
import MovieFilter from './MovieFilter'
import MovieList from './MovieList'

const MoviePage = () => {
  const [selectedFilters, setSelectedFilters] = useState({})

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
