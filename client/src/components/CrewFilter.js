import React, { useState } from "react"
import { Checkbox, Select, Button } from "antd"

const { Option } = Select

const CrewFilter = () => {

  const [rating, setRating] = useState("")
  const [birthYear, setBirthYear] = useState("")
  const [awarded, setAwarded] = useState(false)

  const handleAwardedChange = (value) => {
    setAwarded(value)
  }

  const handleRatingChange = (value) => {
    setRating(value)
  }

  const handleBirthYearChange = (value) => {
    setBirthYear(value)
  }

  const handleConfirmClick = () => {
    console.log({
      awarded,
      rating,
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
      <Checkbox
        checked={awarded === true}
        onChange={() => handleAwardedChange(awarded === true ? "" : true)}
      >
        Oscar Awarded
      </Checkbox>
      <Button type="primary" onClick={handleConfirmClick}>
        Search
      </Button>
    </div>
  )
}

export default CrewFilter
