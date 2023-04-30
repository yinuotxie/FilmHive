import React, { useState } from 'react'
import CrewFilter from './CrewFilter'
import DirectorList from './DirectorList'

const DirectorPage = () => {
  const [selectedFilters, setSelectedFilters] = useState({})


  const handleFiltersChange = (filters) => {
    setSelectedFilters(filters)
  }

  return (
    <>
      <CrewFilter onFiltersChange={handleFiltersChange} />
      <DirectorList filters={selectedFilters} />
    </>
  )
}

export default DirectorPage
