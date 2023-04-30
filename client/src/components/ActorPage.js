import React, { useState } from 'react'
import CrewFilter from './CrewFilter'
import ActorList from './ActorList'

const ActorPage = () => {
  const [selectedFilters, setSelectedFilters] = useState({})

  const handleFiltersChange = (filters) => {
    setSelectedFilters(filters)
  }

  return (
    <>
      <CrewFilter onFiltersChange={handleFiltersChange} />
      <ActorList filters={selectedFilters} />
    </>
  )
}

export default ActorPage
