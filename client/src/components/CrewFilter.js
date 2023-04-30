import React, { useState } from "react"
import { Checkbox, Button, Slider, Input } from "antd"

const CrewFilter = ({ onFiltersChange }) => {

  const [searchValue, setSearchValue] = useState("")
  const [ratingMin, setRatingMin] = useState(0)
  const [ratingMax, setRatingMax] = useState(10)
  const [birthYearMin, setBirthYearMin] = useState(1830)
  const [birthYearMax, setBirthYearMax] = useState(2020)
  const [awarded, setAwarded] = useState(false)
  const [nominated, setNominated] = useState(false)

  const handleSearchValueChange = (e) => {
    setSearchValue(e.target.value)
  }

  const handleAwardedChange = (value) => {
    setAwarded(value)
    setNominated(false)
  }

  const handleNominatedChange = (value) => {
    setNominated(value)
    setAwarded(false)
  }

  const handleRatingChange = (value) => {
    setRatingMin(value[0])
    setRatingMax(value[1])
  }

  const handleBirthYearChange = (value) => {
    setBirthYearMin(value[0])
    setBirthYearMax(value[1])
  }

  const handleConfirmClick = () => {
    const updatedFilters = {
      searchValue: searchValue,
      ratingMin: ratingMin,
      ratingMax: ratingMax,
      birthYearMin: birthYearMin,
      birthYearMax: birthYearMax,
      awarded: awarded,
      nominated: nominated,
    }

    onFiltersChange(updatedFilters)
  }

  return (
    <div
      style={{
        width: '100%',
        marginBottom: 10,
        border: '2px solid #ccc',
        borderRadius: 5,
        padding: 10,
        backgroundImage: `url(${"https://wallpapercave.com/wp/wp4009237.jpg"})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
      <Input
        placeholder="Input a name!"
        value={searchValue}
        onChange={handleSearchValueChange}
        style={{ width: '30%', marginRight: 10, marginBottom: 10 }}
      />
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
        <label><strong>Rating between</strong>: {ratingMin} ~ {ratingMax}</label>
        <Slider
          range
          min={0}
          max={10.0}
          step={0.1}
          defaultValue={[ratingMin, ratingMax]}
          onChange={handleRatingChange}
          style={{ width: 400, marginLeft: 10 }}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
        <label><strong>Birth year between</strong>: {birthYearMin} ~ {birthYearMax}</label>
        <Slider
          range
          min={1830}
          max={2020}
          step={1}
          defaultValue={[birthYearMin, birthYearMax]}
          onChange={handleBirthYearChange}
          style={{ width: 400, marginLeft: 10 }}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
        <Checkbox
          style={{ marginRight: 20 }}
          checked={awarded === true}
          onChange={() => handleAwardedChange(awarded === true ? "" : true)}
        >
          <strong>Oscar Awarded</strong>
        </Checkbox>
        <Checkbox
          checked={nominated === true}
          onChange={() => handleNominatedChange(nominated === true ? "" : true)}
        >
          <strong>Oscar Nominated</strong>
        </Checkbox>
      </div>
      <Button type="primary" onClick={handleConfirmClick} style={{ width: '15%' }}>
        Search
      </Button>
    </div>
  )
}

export default CrewFilter
