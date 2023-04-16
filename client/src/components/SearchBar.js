import React, { useState } from "react"
import { Input, Button } from "antd"

const SearchBar = () => {

  const [searchValue, setSearchValue] = useState("")

  const handleSearchValueChange = (e) => {
    setSearchValue(e.target.value)
  }


  const handleConfirmClick = () => {
    console.log({
      searchValue,
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
      <Input
        placeholder="Search everything!"
        value={searchValue}
        onChange={handleSearchValueChange}
        style={{ width: 700, marginRight: 10 }}
      />
      <Button type="primary" onClick={handleConfirmClick}>
        Search
      </Button>
    </div >
  )
}


export default SearchBar
