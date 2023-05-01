import { Typography, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const config = require('../config.json')

const OscarMovies = () => {

  const [movies, setMovies] = useState([])

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Num Oscars',
      dataIndex: 'num_oscars',
      key: 'num_oscars',
    },
    {
      title: 'IMDB Rating',
      dataIndex: 'imdb_rating',
      key: 'imdb_rating',
    },
    {
      title: 'Release Year',
      dataIndex: 'release_year',
      key: 'release_year',
    }
  ]

  useEffect(() => {
    axios.get(`http://${config.server_host}:${config.server_port}/oscarmovies`)
      .then((response) => {
        setMovies(response.data.genres)
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
      <Typography.Title level={3}>Most Oscar Winning Movies</Typography.Title>
      <Table bordered columns={columns} dataSource={movies} pagination={false} />
    </div>
  )
}

export default OscarMovies
