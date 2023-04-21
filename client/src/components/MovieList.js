import React, { useEffect, useState } from 'react'
import { Card, Pagination, Modal, Typography } from 'antd'
import axios from 'axios'

const config = require('../config.json')

const { Meta } = Card

const MovieList = ({ filters }) => {

  const [movies, setMovies] = useState([])
  const [totalMovies, setTotalMovies] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [moviesPerPage, setMoviesPerPage] = useState(20)
  const [visible, setVisible] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)

  useEffect(() => {
    const offset = (currentPage - 1) * moviesPerPage

    const params = {
      limit: moviesPerPage,
      offset: offset
    }

    if (filters.genre) {
      params.genre = filters.genre
    }

    if (filters.region) {
      params.region = filters.region
    }

    if (filters.runtime) {
      params.runtime = filters.runtime
    }

    if (filters.rating) {
      params.rating = filters.rating
    }

    if (filters.releaseYear) {
      params.releaseYear = filters.releaseYear
    }

    if (filters.awarded) {
      params.awarded = filters.awarded
    }

    if (filters.rated) {
      params.rated = filters.rated
    }

    axios.get(`http://${config.server_host}:${config.server_port}/allmovies`, { params })
      .then((response) => {
        console.log(response.data.total)
        setMovies(response.data.movies)
        setTotalMovies(response.data.total)
      }).catch((error) => {
        console.log(error)
      })
  }, [currentPage, moviesPerPage, filters])

  useEffect(() => {
    setCurrentPage(1)
  }, [moviesPerPage, filters])

  const handleMoviesPerPageChange = (currentPage, size) => {
    setCurrentPage(1)
    setMoviesPerPage(size)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const showModal = (movie) => {
    setSelectedMovie(movie)
    setVisible(true)
  }

  const handleCancel = () => {
    setVisible(false)
    setSelectedMovie(null)
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          marginBottom: 10,
          border: '2px solid #ccc',
          borderRadius: 5,
          padding: 10,
          backgroundImage: `url(${"https://wallpapercave.com/wp/wp4009237.jpg"})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
        }}>
        {movies.map((movie) => (
          <Card
            key={movie.id}
            hoverable
            style={{ width: 300, margin: '10px' }}
            cover={<img alt="movie poster" src={movie.poster ? movie.poster : 'https://media.istockphoto.com/id/1193046540/vector/photo-coming-soon-image-icon-vector-illustration-isolated-on-white-background-no-website.jpg?s=612x612&w=0&k=20&c=4wx1UzigP0g9vJv9D_DmOxdAT_DtX5peZdoS4hi2Fqg='} />}
            onClick={() => showModal(movie)}
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
      {selectedMovie && (
        <Modal
          visible={visible}
          onCancel={handleCancel}
          footer={null}
          width={1500}
        >
          <Typography.Title level={2}>{selectedMovie.title}</Typography.Title>
          <div style={{ display: 'flex', alignItems: 'center', padding: '20px', margin: '20px' }}>
            <img
              alt="movie poster"
              src={selectedMovie.poster ? selectedMovie.poster : 'https://media.istockphoto.com/id/1193046540/vector/photo-coming-soon-image-icon-vector-illustration-isolated-on-white-background-no-website.jpg?s=612x612&w=0&k=20&c=4wx1UzigP0g9vJv9D_DmOxdAT_DtX5peZdoS4hi2Fqg='}
              style={{ maxWidth: '100%' }}
            />
            <div style={{ marginLeft: '100px' }}>
              <p>
                {/* todo */}
                <strong>Genre: </strong> TODO!!!!!!!!
                <br />
                <br />
                <strong>region: </strong> {selectedMovie.region}
                <br />
                <br />
                <strong>Runtime: </strong> {selectedMovie.runtimeMinutes} min
                <br />
                <br />
                <strong>Release Year: </strong> {selectedMovie.release_year}
                <br />
                <br />
                <strong>IMDB Rating: </strong> {selectedMovie.imdb_rating} / 10.0
                <br />
                <br />
                <strong>Oscar Info: </strong> TODO!!!!!!!!
                <br />
                <br />
                <strong>Rated: </strong> {selectedMovie.rated ? selectedMovie.rated : '/'}
              </p>
            </div>
          </div>

          <p>
            <strong>Overview:</strong>
            <br />
            {selectedMovie.plot ? selectedMovie.plot : 'No overview available'}
          </p>
        </Modal>
      )}
    </>
  )
}


export default MovieList
