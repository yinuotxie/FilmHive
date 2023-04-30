import React, { useState } from "react"
import { Input, Button, Modal, Card, Row, Col, Typography, Alert } from "antd"
import axios from 'axios'

const config = require('../config.json')

const { Meta } = Card

const SearchBar = () => {

  const [movies, setMovies] = useState([])
  const [moviesActIn, setMoviesActIn] = useState([])
  const [moviesCharacters, setMoviesCharacters] = useState([])
  const [actors, setActors] = useState([])
  const [directors, setDirectors] = useState([])
  const [moviesTotal, setMoviesTotal] = useState(0)
  const [moviesActInTotal, setMoviesActInTotal] = useState(0)
  const [moviesCharactersTotal, setMoviesCharactersToal] = useState(0)
  const [actorsTotal, setActorsTotal] = useState(0)
  const [directorsTotal, setDirectorsTotal] = useState(0)
  const [searchValue, setSearchValue] = useState("")
  const [modalVisible, setModalVisible] = useState(false)
  const [showReminder, setShowReminder] = useState(false)

  const handleSearchValueChange = (e) => {
    setSearchValue(e.target.value)
  }

  const handleConfirmClick = () => {

    setShowReminder(true)

    const params = {
      searchValue: searchValue
    }

    axios.get(`http://${config.server_host}:${config.server_port}/homesearch`, { params })
      .then(async (response) => {
        console.log(response.data)
        const movies1 = []
        const movies2 = []
        const movies3 = []
        const actors = []
        const directors = []
        response.data.searchResults.forEach(result => {
          if (result.type === 'movie1') {
            movies1.push(result)
          } else if (result.type === 'actor') {
            actors.push(result)
          } else if (result.type === 'director') {
            directors.push(result)
          } else if (result.type === 'movie2') {
            movies2.push(result)
          } else if (result.type === 'movie3') {
            movies3.push(result)
          }
        })

        console.log(response)
        setMovies(movies1)
        setMoviesActIn(movies2)
        setMoviesCharacters(movies3)
        setActors(actors)
        setDirectors(directors)
        setMoviesTotal(response.data.moviesTotal)
        setMoviesActInTotal(response.data.moviesActInTotal)
        setMoviesCharactersToal(response.data.moviesCharactersTotal)
        setActorsTotal(response.data.actorsTotal)
        setDirectorsTotal(response.data.directorsTotal)
        setModalVisible(true)
        setShowReminder(false)

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
      {showReminder && (
        <>
          <br />
          <br />
          <Alert
            message="Searching!"
            description="Data on its way, please wait..."
            type="success"
          />
        </>
      )
      }
      <Modal
        visible={modalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1600}
      >
        <Typography.Title level={2}>Search Results</Typography.Title>
        <br />
        <div style={{ overflowX: 'scroll', height: '850px', paddingRight: 20 }}>
          <Typography.Title level={3}>Movies:</Typography.Title>
          <Typography.Title level={5}>Found <strong>{moviesTotal}</strong> movies with <strong>{searchValue}</strong> in their titles.</Typography.Title>
          <br />
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
          <Typography.Title level={3}>Actors:</Typography.Title>
          <Typography.Title level={5}>Found <strong>{actorsTotal}</strong> actors.</Typography.Title>
          <br />
          <Row gutter={[16, 16]}>
            {actors.map((result) => (
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
          <Typography.Title level={3}>Directors:</Typography.Title>
          <Typography.Title level={5}>Found <strong>{directorsTotal}</strong> directors.</Typography.Title>
          <br />
          <Row gutter={[16, 16]}>
            {directors.map((result) => (
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
          <Typography.Title level={3}>Movies with crews:</Typography.Title>
          <Typography.Title level={5}>Found <strong>{moviesActInTotal}</strong> movies with <strong>{searchValue}</strong> as their crews.</Typography.Title>
          <br />
          <Row gutter={[16, 16]}>
            {moviesActIn.map((result) => (
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
          <Typography.Title level={3}>Movies with characters:</Typography.Title>
          <Typography.Title level={5}>Found <strong>{moviesCharactersTotal}</strong> movies with <strong>{searchValue}</strong> as their characters.</Typography.Title>
          <br />
          <Row gutter={[16, 16]}>
            {moviesCharacters.map((result) => (
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
