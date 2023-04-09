import React, { useState } from "react"
import { Input, Checkbox, Select, Button } from "antd"

const { Option } = Select

const SearchBar = () => {
  const [searchType, setSearchType] = useState("")
  const [searchValue, setSearchValue] = useState("")
  const [genre, setGenre] = useState("")
  const [year, setYear] = useState("")
  const [award, setAward] = useState("")
  const [country, setCountry] = useState("")
  const [runtime, setRuntime] = useState("")
  const [rating, setRating] = useState("")
  const [releaseYear, setReleaseYear] = useState("")
  const [job, setJob] = useState("")
  const [birthYear, setBirthYear] = useState("")

  const handleSearchTypeChange = (checkedValues) => {
    setSearchType(checkedValues)
  }

  const handleSearchValueChange = (e) => {
    setSearchValue(e.target.value)
  }

  const handleGenreChange = (value) => {
    setGenre(value)
  }

  const handleYearChange = (value) => {
    setYear(value)
  }

  const handleAwardChange = (value) => {
    setAward(value)
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

  const handleJobChange = (value) => {
    setJob(value)
  }

  const handleBirthYearChange = (value) => {
    setBirthYear(value)
  }

  const handleConfirmClick = () => {
    console.log({
      searchType,
      searchValue,
      genre,
      year,
      award,
      country,
      runtime,
      rating,
      releaseYear,
      job,
      birthYear,
    })
  }

  return (
    <div
      style={{
        marginBottom: 10,
        border: '2px solid #ccc',
        borderRadius: 5,
        padding: 10,
        backgroundImage: `url(${"https://wallpapercave.com/wp/wp4009237.jpg"})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
      }}>
      <div style={{ marginBottom: 10 }}>
        <Input
          placeholder="Search for movies, actors, and directors"
          value={searchValue}
          onChange={handleSearchValueChange}
          style={{ width: 700, marginRight: 10 }}
        />
      </div>
      <div style={{ marginBottom: 10 }}>
        <Checkbox
          checked={searchType === "movie"}
          onChange={() => handleSearchTypeChange("movie")}
        >
          Movie
        </Checkbox>
        <Checkbox
          checked={searchType === "actor"}
          onChange={() => handleSearchTypeChange("actor")}
        >
          Actor
        </Checkbox>
        <Checkbox
          checked={searchType === "director"}
          onChange={() => handleSearchTypeChange("director")}
        >
          Director
        </Checkbox>
      </div>
      <div style={{ marginBottom: 10 }}>
        {
          searchType === 'movie' && (
            <>
              <Select
                placeholder="Genre"
                onChange={handleGenreChange}
                style={{ marginRight: 10 }}
              >
                <Option value="action">Action</Option>
                <Option value="comedy">Comedy</Option>
                <Option value="drama">Drama</Option>
                <Option value="horror">Horror</Option>
                <Option value="thriller">Thriller</Option>
              </Select>
              <Select
                placeholder="Year"
                onChange={handleYearChange}
                style={{ marginRight: 10 }}
              >
                <Option value="2019">2019</Option>
                <Option value="2020">2020</Option>
                <Option value="2021">2021</Option>
              </Select>
              <Select
                placeholder="Award"
                onChange={handleAwardChange}
                style={{ marginRight: 10 }}
              >
                <Option value="oscar">Oscar</Option>
                <Option value="golden-globe">Golden Globe</Option>
                <Option value="bafta">BAFTA</Option>
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
              <Select
                placeholder="Runtime"
                onChange={handleRuntimeChange}
                style={{ marginRight: 10 }}
              >
                <Option value="90">90 min</Option>
                <Option value="120">120 min</Option>
                <Option value="150">150 min</Option>
                <Option value="180">180 min</Option>
              </Select>
              <Select
                placeholder="Rating"
                onChange={handleRatingChange}
                style={{ marginRight: 10 }}
              >
                <Option value="1">1 star</Option>
                <Option value="2">2 stars</Option>
                <Option value="3">3 stars</Option>
                <Option value="4">4 stars</Option>
                <Option value="5">5 stars</Option>
              </Select>
              <Select
                placeholder="Release Year"
                onChange={handleReleaseYearChange}
                style={{ marginRight: 10 }}
              >
                <Option value="2010">2010</Option>
                <Option value="2015">2015</Option>
                <Option value="2020">2020</Option>
                <Option value="2021">2021</Option>
              </Select>
            </>
          )
        }
        {
          (searchType === "actor" || searchType === "director") && (
            <>
              <Select
                placeholder="Award"
                onChange={handleAwardChange}
                style={{ marginRight: 10 }}
              >
                <Option value="oscar">Oscar</Option>
                <Option value="emmy">Emmy</Option>
                <Option value="tony">Tony</Option>
              </Select>
              <Select
                placeholder="Job"
                onChange={handleJobChange}
                style={{ marginRight: 10 }}
              >
                <Option value="director">Director</Option>
                <Option value="writer">Writer</Option>
                <Option value="actor">Actor</Option>
                <Option value="cinematographer">Cinematographer</Option>
              </Select>
              <Select
                placeholder="Rating"
                onChange={handleRatingChange}
                style={{ marginRight: 10 }}
              >
                <Option value="1">1 star</Option>
                <Option value="2">2 stars</Option>
                <Option value="3">3 stars</Option>
                <Option value="4">4 stars</Option>
                <Option value="5">5 stars</Option>
              </Select>
              <Select
                placeholder="Birth Year"
                onChange={handleBirthYearChange}
                style={{ marginRight: 10 }}
              >
                <Option value="1980">1980</Option>
                <Option value="1990">1990</Option>
                <Option value="2000">2000</Option>
                <Option value="2010">2010</Option>
              </Select>
            </>
          )
        }
      </div>
      <Button type="primary" onClick={handleConfirmClick}>
        Search
      </Button>
    </div >
  )
}


export default SearchBar
