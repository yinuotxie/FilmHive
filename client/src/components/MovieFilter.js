import React, { useState } from "react"
import { Checkbox, Slider, Select, Button } from "antd"

const { Option } = Select

const MovieFilter = () => {

  const [genre, setGenre] = useState("")
  const [country, setCountry] = useState("")
  const [runtime, setRuntime] = useState(120)
  const [rating, setRating] = useState(8)
  const [releaseYear, setReleaseYear] = useState(2022)
  const [awarded, setAwarded] = useState(false)
  const [rated, setRated] = useState(false)

  const handleGenreChange = (value) => {
    setGenre(value)
  }

  const handleCountryChange = (value) => {
    setCountry(value)
  }

  const handleRuntimeChange = (value) => {
    setRuntime(value)
  }

  const handleRatingChange = (value) => {
    setRating(value)
  }

  const handleReleaseYearChange = (value) => {
    setReleaseYear(value)
  }

  const handleAwardedChange = (value) => {
    setAwarded(value)
  }

  const handleRatedChange = (value) => {
    setRated(value)
  }

  const handleConfirmClick = () => {
    console.log({
      genre,
      country,
      runtime,
      rating,
      releaseYear,
      awarded,
      rated
    })
  }

  return (
    <div
      style={{
        width: 1250,
        marginBottom: 10,
        border: '2px solid #ccc',
        borderRadius: 5,
        padding: 10,
        backgroundImage: `url(${"https://wallpapercave.com/wp/wp4009237.jpg"})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 30 }}>
        <Select
          placeholder="Genre"
          onChange={handleGenreChange}
          style={{ width: 150, marginRight: 10 }}
        >
          <Option value="biography">Biography</Option>
          <Option value="film-noir">Film-Noir</Option>
          <Option value="adult">Adult</Option>
          <Option value="horror">Horror</Option>
          <Option value="mystery">Mystery</Option>
          <Option value="history">History</Option>
          <Option value="music">Music</Option>
          <Option value="documentary">Documentary</Option>
          <Option value="war">War</Option>
          <Option value="short">Short</Option>
          <Option value="crime">Crime</Option>
          <Option value="adventure">Adventure</Option>
          <Option value="family">Family</Option>
          <Option value="drama">Drama</Option>
          <Option value="romance">Romance</Option>
          <Option value="western">Western</Option>
          <Option value="action">Action</Option>
          <Option value="sci-fi">Sci-Fi</Option>
          <Option value="fantasy">Fantasy</Option>
          <Option value="talk-show">Talk-Show</Option>
          <Option value="news">News</Option>
          <Option value="game-show">Game-Show</Option>
          <Option value="comedy">Comedy</Option>
          <Option value="sport">Sport</Option>
          <Option value="animation">Animation</Option>
          <Option value="musical">Musical</Option>
          <Option value="thriller">Thriller</Option>
          <Option value="reality-tv">Reality-TV</Option>
        </Select>
        <Select
          placeholder="Country"
          onChange={handleCountryChange}
          style={{ marginRight: 10 }}
        >
          <Option value="usa">USA</Option>
          <Option value="uk">UK</Option>
          <Option value="france">France</Option>
          <Option value="germany">Germany</Option>
          <Option value="japan">Japan</Option>
        </Select>
        <Checkbox
          checked={awarded === true}
          onChange={() => handleAwardedChange(awarded === true ? "" : true)}
        >
          Oscar Awarded
        </Checkbox>
        <Checkbox
          checked={rated === true}
          onChange={() => handleRatedChange(rated === true ? "" : true)}
        >
          Rated
        </Checkbox>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div>
          <label>Runtime: {runtime} min</label>
          <Slider
            min={45}
            max={1000}
            step={1}
            defaultValue={120}
            onChange={handleRuntimeChange}
            style={{ width: 500 }}
          />
        </div>
        <div>
          <label>Rating: {rating}</label>
          <Slider
            min={0}
            max={10.0}
            step={0.1}
            defaultValue={8}
            onChange={handleRatingChange}
            style={{ width: 500 }}
          />
        </div>
        <div>
          <label>Release Year: {releaseYear}</label>
          <Slider
            min={1903}
            max={2025}
            step={1}
            defaultValue={2022}
            onChange={handleReleaseYearChange}
            style={{ width: 500 }}
          />
        </div>
      </div>
      <Button type="primary" onClick={handleConfirmClick}>
        Search
      </Button>
    </div >
  )
}

export default MovieFilter
