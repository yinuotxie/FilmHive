import { Card } from 'antd'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const config = require('../config.json')
const MovieOfTheDay = () => {

  const [movie, setMovie] = useState('')

  useEffect(() => {
    axios.get(`http://${config.server_host}:${config.server_port}/movieoftheday`)
      .then((response) => {
        setMovie(response.data)
      }).catch((error) => {
        console.log(error)
      })
  }, [])

  return (
    <div style={{ marginBottom: 10 }}>
      <Card
        title="Movie of the day!"
        cover={<img alt={movie.title} src={movie.poster ? movie.poster : 'https://media.istockphoto.com/id/1193046540/vector/photo-coming-soon-image-icon-vector-illustration-isolated-on-white-background-no-website.jpg?s=612x612&w=0&k=20&c=4wx1UzigP0g9vJv9D_DmOxdAT_DtX5peZdoS4hi2Fqg='} />}
        style={{ width: 400 }}
      >
        <Card.Meta title={movie.title} />
        <br />
        <p>Rating:{movie.imdb_rating}</p>
        <p>{movie.plot}</p>
      </Card>
    </div>
  )
}

export default MovieOfTheDay
