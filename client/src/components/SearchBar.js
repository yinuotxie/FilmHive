import React, { useState } from "react"
import { Input, Button, Modal, Card, Row, Col, Typography } from "antd"
import axios from 'axios'

const config = require('../config.json')

const { Meta } = Card

const SearchBar = () => {

  const [movies, setMovies] = useState([])
  const [crews, setCrews] = useState([])
  const [searchValue, setSearchValue] = useState("")
  const [modalVisible, setModalVisible] = useState(false)
  // const [searchResults, setSearchResults] = useState([])

  const handleSearchValueChange = (e) => {
    setSearchValue(e.target.value)
  }

  const handleConfirmClick = () => {

    const params = {
      searchValue: searchValue
    }

    axios.get(`http://${config.server_host}:${config.server_port}/homesearch`, { params })
      .then(async (response) => {
        console.log(response.data)
        // setSearchResults(response.data.searchResults)
        const movies = []
        const crews = []
        response.data.searchResults.forEach(result => {
          if (result.type === 'movie') {
            movies.push(result)
          } else if (result.type === 'crew') {
            crews.push(result)
          }
        })
        setMovies(movies)
        setCrews(crews)
        setModalVisible(true)
      }).catch((error) => {
        console.log(error)
      })
  }


  const handleCancel = () => {
    setModalVisible(false)
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
      <Modal
        visible={modalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1600}
      >
        <Typography.Title level={2}>Search Results</Typography.Title>
        <div style={{ overflowX: 'scroll', height: '850px', paddingRight: 20 }}>
          <Typography.Title level={3}>Movies</Typography.Title>
          <Row gutter={[16, 16]}>
            {movies.map((result) => (
              <Col span={4} key={result.id}>
                <Card
                  style={{ marginBottom: 10 }}
                  hoverable
                  cover={
                    <img
                      alt="url"
                      src={
                        result.image
                          ? result.image
                          : 'https://media.istockphoto.com/id/1193046540/vector/photo-coming-soon-image-icon-vector-illustration-isolated-on-white-background-no-website.jpg?s=612x612&w=0&k=20&c=4wx1UzigP0g9vJv9D_DmOxdAT_DtX5peZdoS4hi2Fqg='
                      }
                      style={{ maxWidth: '100%' }}
                    />
                  }
                >
                  <Meta title={result.name} />
                </Card>
              </Col>
            ))}
          </Row>
          <br />
          <br />
          <Typography.Title level={3}>People</Typography.Title>
          <Row gutter={[16, 16]}>
            {crews.map((result) => (
              <Col span={4} key={result.id}>
                <Card
                  style={{ marginBottom: 10 }}
                  hoverable
                  cover={
                    <img
                      alt="url"
                      src={
                        result.image
                          ? result.image
                          : 'https://media.istockphoto.com/id/1193046540/vector/photo-coming-soon-image-icon-vector-illustration-isolated-on-white-background-no-website.jpg?s=612x612&w=0&k=20&c=4wx1UzigP0g9vJv9D_DmOxdAT_DtX5peZdoS4hi2Fqg='
                      }
                      style={{ maxWidth: '100%' }}
                    />
                  }
                >
                  <Meta title={result.name} />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Modal>

    </div >
  )
}

export default SearchBar
