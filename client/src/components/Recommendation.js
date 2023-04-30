import { Row, Col, Card, Typography, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useStore } from "@/store"

const config = require('../config.json')

const Reccomendation = () => {

  const { loginStore } = useStore()

  const [movies, setMovies] = useState([])

  useEffect(() => {

    const user_email = loginStore.token.email

    axios.get(`http://${config.server_host}:${config.server_port}/recommendations`, { user_email })
      .then((response) => {
        setMovies(response.data.movies)
      }).catch((error) => {
        console.log(error)
      })
  }, [])

  return (
    <div style={{
      width: 2000,
      marginBottom: 10,
      border: '2px solid #ccc',
      borderRadius: 5,
      padding: 10,
      backgroundImage: `url(${"https://wallpapercave.com/wp/wp4009237.jpg"})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    }}>

      <Typography.Title level={2}>Recommended just for you!</Typography.Title>
      <Typography.Title level={4}>We selected 10 movies base on your preferences, and their ratings are all higher than the average ratings in each genre. Enjoy!</Typography.Title>
      <br />
      {movies.length === 0 ? (
        <Spin tip="Just give me one sec!" size="large" />
      ) : (
        <>
          <Row gutter={12} style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
            {movies.map((movie) => (
              <Col span={3} key={movie.title} style={{ marginLeft: `20px` }}>
                <Card
                  hoverable
                  cover={<img alt={movie.title} src={movie.poster ? movie.poster : 'https://media.istockphoto.com/id/1193046540/vector/photo-coming-soon-image-icon-vector-illustration-isolated-on-white-background-no-website.jpg?s=612x612&w=0&k=20&c=4wx1UzigP0g9vJv9D_DmOxdAT_DtX5peZdoS4hi2Fqg='} />}
                >
                  <Card.Meta title={movie.title} />
                  <br />
                  <p>Rating:{movie.imdb_rating}</p>
                  <p>{movie.plot ? movie.plot.substring(0, 500) : 'No overview available'}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </div >
  )
}

// todo: hyperlink

export default Reccomendation
