import React, { useEffect, useState } from 'react'
import { Card, Pagination } from 'antd'
import axios from 'axios'

const config = require('../config.json')

const { Meta } = Card

const MovieList = () => {

  const [movies, setMovies] = useState([])
  const [totalMovies, setTotalMovies] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [moviesPerPage, setMoviesPerPage] = useState(20)

  useEffect(() => {
    const offset = (currentPage - 1) * moviesPerPage
    axios.get(`http://${config.server_host}:${config.server_port}/allmovies?limit=${moviesPerPage}&offset=${offset}`)
      .then((response) => {
        console.log(response.data.total)
        setMovies(response.data.movies)
        setTotalMovies(response.data.total)
      }).catch((error) => {
        console.log(error)
      })
  }, [currentPage, moviesPerPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [moviesPerPage])

  const handleMoviesPerPageChange = (currentPage, size) => {
    setCurrentPage(1)
    setMoviesPerPage(size)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {movies.map((movie) => (
          <Card
            key={movie.id}
            hoverable
            style={{ width: 300, margin: '10px' }}
            cover={<img alt="movie poster" src={movie.poster ? movie.poster : 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png'} />}
          >
            <Meta title={movie.title} />
            <br />
            <p>
              <strong>IMDB Rating:</strong> {movie.imdb_rating}
            </p>
            <p>
              {movie.plot ? movie.plot.substring(0, 500) : 'No overview available'}
            </p>
          </Card>
        ))}
      </div>
      <Pagination
        current={currentPage}
        pageSize={moviesPerPage}
        pageSizeOptions={[10, 20, 50]}
        total={totalMovies}
        onChange={handlePageChange}
        onShowSizeChange={handleMoviesPerPageChange}
        style={{ marginTop: '20px', textAlign: 'center' }}
      />
    </>
  )
}

export default MovieList
