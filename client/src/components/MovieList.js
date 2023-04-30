import React, { useEffect, useState } from 'react'
import { Card, Pagination, Modal, Typography, Spin, Avatar, List, Tag } from 'antd'
import { LikeTwoTone, DislikeTwoTone } from '@ant-design/icons'
import axios from 'axios'

const config = require('../config.json')

const { Meta } = Card

const MovieList = ({ filters }) => {

  const [movies, setMovies] = useState([])
  const [totalMovies, setTotalMovies] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [moviesPerPage, setMoviesPerPage] = useState(30)
  const [visible, setVisible] = useState(false)

  const [selectedMovie, setSelectedMovie] = useState(null)
  const [selectedGenres, setSelectedGenres] = useState('')
  const [selectedAwards, setSelectedAwards] = useState('')

  const [selectedActors, setSelectedActors] = useState('')
  const [selectedDirectors, setSelectedDirectors] = useState('')
  const [selectedComments, setSelectedComments] = useState('')

  useEffect(() => {
    const offset = (currentPage - 1) * moviesPerPage

    const params = {
      limit: moviesPerPage,
      offset: offset
    }

    if (filters.searchValue) {
      params.searchValue = filters.searchValue
    }

    if (filters.genre) {
      params.genre = filters.genre
    }

    if (filters.region) {
      params.region = filters.region
    }

    if (filters.runtimeMin) {
      params.runtimeMin = filters.runtimeMin
    }

    if (filters.runtimeMax) {
      params.runtimeMax = filters.runtimeMax
    }

    if (filters.ratingMin) {
      params.ratingMin = filters.ratingMin
    }

    if (filters.ratingMax) {
      params.ratingMax = filters.ratingMax
    }

    if (filters.releaseYearMin) {
      params.releaseYearMin = filters.releaseYearMin
    }

    if (filters.releaseYearMax) {
      params.releaseYearMax = filters.releaseYearMax
    }

    if (filters.awarded) {
      params.awarded = filters.awarded
    }

    if (filters.nominated) {
      params.nominated = filters.nominated
    }

    if (filters.rated) {
      params.rated = filters.rated
    }

    axios.get(`http://${config.server_host}:${config.server_port}/allmovies`, { params })
      .then((response) => {
        setMovies(response.data.movies)
        setTotalMovies(response.data.total)
      }).catch((error) => {
        console.log(error)
      })
  }, [currentPage, moviesPerPage, filters])

  useEffect(() => {
    setCurrentPage(1)
  }, [moviesPerPage, filters])

  useEffect(() => {
    setTotalMovies(-1)
    setMovies([])
  }, [filters])

  useEffect(() => {

    if (selectedMovie) {
      const params = {
        movie_id: selectedMovie.id
      }

      axios.get(`http://${config.server_host}:${config.server_port}/selectedgenres`, { params })
        .then((response) => {
          setSelectedGenres(response.data.genres)
        }).catch((error) => {
          console.log(error)
        })

      axios.get(`http://${config.server_host}:${config.server_port}/selectedawards`, { params })
        .then((response) => {
          if (response.data.length > 0) {
            setSelectedAwards(response.data)
          }
          else {
            setSelectedAwards('')
          }
        }).catch((error) => {
          console.log(error)
        })

      axios.get(`http://${config.server_host}:${config.server_port}/selectedactors`, { params })
        .then((response) => {
          setSelectedActors(response.data)
        }).catch((error) => {
          console.log(error)
        })

      axios.get(`http://${config.server_host}:${config.server_port}/selecteddirectors`, { params })
        .then((response) => {
          setSelectedDirectors(response.data)
        }).catch((error) => {
          console.log(error)
        })

      axios.get(`http://${config.server_host}:${config.server_port}/selectedcomments`, { params })
        .then((response) => {
          setSelectedComments(response.data)
        }).catch((error) => {
          console.log(error)
        })
    }
  }, [selectedMovie])

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
      {totalMovies < 0 ? (
        <Spin tip="Data on its way!" size="large" />
      ) : (
        <>
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
            <Typography.Title level={4}>{totalMovies} movie(s) found.</Typography.Title>
          </div>
          {totalMovies > 0 &&
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
                    cover={<img alt="movie poster" src={movie.poster ? movie.poster : 'https://media.istockphoto.com/id/1193046540/vector/photo-coming-soon-image-icon-vector-illustration-isolated-on-white-background-no-website.jpg?s=612x612&w=0&k=20&c=4wx1UzigP0g9vJv9D_DmOxdAT_DtX5peZdoS4hi2Fqg='} width={300} height={390} />}
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
                pageSizeOptions={[30, 60, 90]}
                total={totalMovies}
                onChange={handlePageChange}
                onShowSizeChange={handleMoviesPerPageChange}
                style={{ marginTop: '20px', textAlign: 'center' }}
              />
            </>
          }
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
                  width={300} height={390}
                />
                <div style={{ marginLeft: '100px' }}>
                  <p>
                    <Typography.Title level={5} style={{ display: "inline-block" }}>Genres:</Typography.Title> {selectedGenres}
                    <br />
                    <br />
                    <Typography.Title level={5} style={{ display: "inline-block" }}>Region:</Typography.Title> {selectedMovie.region}
                    <br />
                    <br />
                    <Typography.Title level={5} style={{ display: "inline-block" }}>Runtime:</Typography.Title> {selectedMovie.runtimeMinutes} min
                    <br />
                    <br />
                    <Typography.Title level={5} style={{ display: "inline-block" }}>Release Year:</Typography.Title> {selectedMovie.release_year}
                    <br />
                    <br />
                    <Typography.Title level={5} style={{ display: "inline-block" }}>IMDB Rating:</Typography.Title> {selectedMovie.imdb_rating} / 10.0
                    <br />
                    <br />
                    <Typography.Title level={5} style={{ display: "inline-block" }}>Rated:</Typography.Title> {selectedMovie.rated ? selectedMovie.rated : '/'}
                    <br />
                    <br />
                    {selectedAwards && <>
                      <Typography.Title level={5} style={{ display: "inline-block" }}>Oscar Award Information:</Typography.Title>
                      <br />
                      <br />
                      {selectedAwards && selectedAwards.sort((a, b) => b.is_winner - a.is_winner).map((award) => (
                        <div key={award.id}>
                          <Typography.Text>{award.year} - BEST {award.category}</Typography.Text>
                          <Typography.Text type={award.is_winner ? "success" : "secondary"}> ({award.is_winner ? "Winner" : "Nominee"})</Typography.Text>
                        </div>
                      ))}
                    </>
                    }
                  </p>
                </div>
              </div>
              <p>
                <Typography.Title level={4}>Overview:</Typography.Title>
                {selectedMovie.plot ? selectedMovie.plot : 'No overview available'}
              </p>
              <br />
              {selectedDirectors && (<>
                <Typography.Title level={4}>Director{selectedDirectors.length > 1 ? 's' : ''}:</Typography.Title>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {selectedDirectors.map((director) => (
                    <Card
                      key={director.id}
                      hoverable
                      style={{ width: 300, margin: '10px' }}
                      cover={<img alt={director.name} src={director.photo_url ? director.photo_url : 'https://media.istockphoto.com/id/1193046540/vector/photo-coming-soon-image-icon-vector-illustration-isolated-on-white-background-no-website.jpg?s=612x612&w=0&k=20&c=4wx1UzigP0g9vJv9D_DmOxdAT_DtX5peZdoS4hi2Fqg='} width={300} height={390} />}
                    >
                      <Meta title={director.name} />
                      <br />
                    </Card>
                  ))}
                </div>
                <br />
              </>
              )}
              {selectedActors && (<>
                <Typography.Title level={4}>Actors and actresses:</Typography.Title>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {selectedActors.map((actor) => (
                    <Card
                      key={actor.id}
                      hoverable
                      style={{ width: 300, margin: '10px' }}
                      cover={<img alt={actor.name} src={actor.photo_url ? actor.photo_url : 'https://media.istockphoto.com/id/1193046540/vector/photo-coming-soon-image-icon-vector-illustration-isolated-on-white-background-no-website.jpg?s=612x612&w=0&k=20&c=4wx1UzigP0g9vJv9D_DmOxdAT_DtX5peZdoS4hi2Fqg='} width={300} height={390} />}
                    >
                      <Meta title={actor.name} />
                      <br />
                      <p>
                        <strong>Play the role of:</strong> {actor.character}
                      </p>
                    </Card>
                  ))}
                </div>
                <br />
              </>
              )}
              {selectedComments && (<>
                <Typography.Title level={4}>{selectedComments.length} Comments:</Typography.Title>
                <List
                  itemLayout="horizontal"
                  dataSource={selectedComments}
                  renderItem={(item, index) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />}
                        title={
                          <span>
                            {item.name}
                            {item.top_critic === 1 && <Tag style={{ marginLeft: '5px' }} color="blue">Top Critic</Tag>}
                          </span>
                        }
                        description={
                          <span>
                            {item.publisher_name && <span> From {item.publisher_name}</span>}
                            {item.create_time && <span> posted on {item.create_time.match(/^\d{4}-\d{2}-\d{2}/)[0]}</span>}
                          </span>
                        }
                      />
                      <Typography.Text>{item.type === 'Fresh' ? <LikeTwoTone twoToneColor="#00FF00" /> : <DislikeTwoTone twoToneColor="#808080" />}</Typography.Text>
                      <Typography.Text type={item.type === 'Fresh' ? "success" : "secondary"}> {item.type} </Typography.Text>
                      <br />
                      {item.content}
                    </List.Item>
                  )}
                />
              </>
              )}
            </Modal>
          )}
        </>
      )
      }
    </>
  )
}


export default MovieList
