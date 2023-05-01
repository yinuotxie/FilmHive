import React, { useEffect, useState } from 'react'
import { Card, Pagination, Modal, Typography, Spin } from 'antd'
import axios from 'axios'

const config = require('../config.json')

const { Meta } = Card

const ActorList = ({ filters }) => {

  const [actors, setActors] = useState([])
  const [totalActors, setTotalActors] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [actorsPerPage, setActorsPerPage] = useState(30)
  const [visible, setVisible] = useState(false)

  const [selectedActor, setSelectedActor] = useState(null)
  const [selectedAwards, setSelectedAwards] = useState('')
  const [selectedFamousFor, setSelectedFamousFor] = useState('')
  const [selectedActIn, setSelectedActIn] = useState('')
  const [selectedDuo, setSelectedDuo] = useState('')
  const [selectedCo, setSelectedCo] = useState('')

  useEffect(() => {

    const offset = (currentPage - 1) * actorsPerPage

    const params = {
      limit: actorsPerPage,
      offset: offset
    }

    if (filters.searchValue) {
      params.searchValue = filters.searchValue
    }

    if (filters.ratingMin) {
      params.ratingMin = filters.ratingMin
    }

    if (filters.ratingMax) {
      params.ratingMax = filters.ratingMax
    }

    if (filters.birthYearMin) {
      params.birthYearMin = filters.birthYearMin
    }

    if (filters.birthYearMax) {
      params.birthYearMax = filters.birthYearMax
    }

    if (filters.awarded) {
      params.awarded = filters.awarded
    }

    if (filters.nominated) {
      params.nominated = filters.nominated
    }

    axios.get(`http://${config.server_host}:${config.server_port}/allactors`, { params })
      .then((response) => {
        setActors(response.data.actors)
        setTotalActors(response.data.total)
      }).catch((error) => {
        console.log(error)
      })
  }, [currentPage, actorsPerPage, filters])

  useEffect(() => {
    setCurrentPage(1)
  }, [actorsPerPage, filters])

  useEffect(() => {
    setTotalActors(-1)
    setActors([])
  }, [filters])

  useEffect(() => {

    if (selectedActor) {
      const params = {
        crew_id: selectedActor.id
      }

      axios.get(`http://${config.server_host}:${config.server_port}/selectedcrewawards`, { params })
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

      axios.get(`http://${config.server_host}:${config.server_port}/selectedcrewfamous`, { params })
        .then((response) => {
          setSelectedFamousFor(response.data)
        }).catch((error) => {
          console.log(error)
        })

      axios.get(`http://${config.server_host}:${config.server_port}/selectedactin`, { params })
        .then((response) => {
          setSelectedActIn(response.data)
        }).catch((error) => {
          console.log(error)
        })

      axios.get(`http://${config.server_host}:${config.server_port}/selectedduo`, { params })
        .then((response) => {
          setSelectedDuo(response.data)
        }).catch((error) => {
          console.log(error)
        })

      axios.get(`http://${config.server_host}:${config.server_port}/selectedco`, { params })
        .then((response) => {
          setSelectedCo(response.data)
        }).catch((error) => {
          console.log(error)
        })
    }
  }, [selectedActor])

  const handleActorsPerPageChange = (currentPage, size) => {
    setCurrentPage(1)
    setActorsPerPage(size)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const showModal = (movie) => {
    setSelectedActor(movie)
    setVisible(true)
  }

  const handleCancel = () => {
    setVisible(false)
    setSelectedActor(null)
  }

  return (
    <>
      {totalActors < 0 ? (
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
            <Typography.Title level={4}>{totalActors} actor(s) found.</Typography.Title>
          </div>
          {totalActors > 0 &&
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
                {actors.map((actor) => (
                  <Card
                    key={actor.id}
                    hoverable
                    style={{ width: 300, margin: '10px' }}
                    cover={<img alt="actor poster" src={actor.photo_url ? actor.photo_url : 'https://media.istockphoto.com/id/1193046540/vector/photo-coming-soon-image-icon-vector-illustration-isolated-on-white-background-no-website.jpg?s=612x612&w=0&k=20&c=4wx1UzigP0g9vJv9D_DmOxdAT_DtX5peZdoS4hi2Fqg='} width={300} height={390} />}
                    onClick={() => showModal(actor)}
                  >
                    <Meta title={actor.name} />
                    <br />
                    <p>
                      <strong>Birth date:</strong> {actor.birth_date ? actor.birth_date.match(/^\d{4}-\d{2}-\d{2}/)[0] : "we don't know"}
                    </p>
                    <p>
                      <strong>He/She also worked in/as:</strong> {actor.profession.replace(/,actor|,actress|actor,|actress,/g, '').split(',').map((item) => item.trim()).join(' / ')}
                    </p>
                  </Card>
                ))}
              </div>
              <Pagination
                current={currentPage}
                pageSize={actorsPerPage}
                pageSizeOptions={[30, 60, 90]}
                total={totalActors}
                onChange={handlePageChange}
                onShowSizeChange={handleActorsPerPageChange}
                style={{ marginTop: '20px', textAlign: 'center' }}
              />
            </>
          }
          {selectedActor && (
            <Modal
              visible={visible}
              onCancel={handleCancel}
              footer={null}
              width={1500}
            >
              <Typography.Title level={2}>{selectedActor.name}</Typography.Title>
              <div style={{ display: 'flex', alignItems: 'center', padding: '20px', margin: '20px' }}>
                <img
                  alt="actor photo"
                  src={selectedActor.photo_url ? selectedActor.photo_url : 'https://media.istockphoto.com/id/1193046540/vector/photo-coming-soon-image-icon-vector-illustration-isolated-on-white-background-no-website.jpg?s=612x612&w=0&k=20&c=4wx1UzigP0g9vJv9D_DmOxdAT_DtX5peZdoS4hi2Fqg='}
                  width={300} height={390}
                />
                <div style={{ marginLeft: '100px' }}>
                  <p>
                    <Typography.Title level={5} style={{ display: "inline-block" }}>Name:</Typography.Title> {selectedActor.name}
                    <br />
                    <br />
                    <Typography.Title level={5} style={{ display: "inline-block" }}>Birth Date:</Typography.Title> {selectedActor.birth_date ? selectedActor.birth_date.match(/^\d{4}-\d{2}-\d{2}/)[0] : "It's a mystery!"}
                    <br />
                    <br />
                    <Typography.Title level={5} style={{ display: "inline-block" }}>Death Year:</Typography.Title> {selectedActor.death_year ? selectedActor.death_year : "Alive"}
                    <br />
                    <br />
                    <Typography.Title level={5} style={{ display: "inline-block" }}>Profession(s):</Typography.Title> {selectedActor.profession.split(',').map((item) => item.trim()).join(' / ')}
                    <br />
                    <br />
                    <Typography.Title level={5} style={{ display: "inline-block" }}>Average Rating of Movies Portrayed:</Typography.Title> {parseFloat(selectedActor.avg_rating).toFixed(2)} / 10.00
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
              <br />
              {selectedFamousFor && (<>
                <Typography.Title level={4}>He/She is famous for:</Typography.Title>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {selectedFamousFor.map((movie) => (
                    <Card
                      key={movie.movie_id}
                      hoverable
                      style={{ width: 300, margin: '10px' }}
                      cover={<img alt={movie.title} src={movie.poster ? movie.poster : 'https://media.istockphoto.com/id/1193046540/vector/photo-coming-soon-image-icon-vector-illustration-isolated-on-white-background-no-website.jpg?s=612x612&w=0&k=20&c=4wx1UzigP0g9vJv9D_DmOxdAT_DtX5peZdoS4hi2Fqg='} width={300} height={390} />}
                    >
                      <Meta title={movie.title} />
                      <br />
                    </Card>
                  ))}
                </div>
                <br />
              </>
              )}
              {selectedActIn && (<>
                <Typography.Title level={4}>He/She once acted in:</Typography.Title>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {selectedActIn.map((movie) => (
                    <Card
                      key={movie.movie_id}
                      hoverable
                      style={{ width: 300, margin: '10px' }}
                      cover={<img alt={movie.title} src={movie.poster ? movie.poster : 'https://media.istockphoto.com/id/1193046540/vector/photo-coming-soon-image-icon-vector-illustration-isolated-on-white-background-no-website.jpg?s=612x612&w=0&k=20&c=4wx1UzigP0g9vJv9D_DmOxdAT_DtX5peZdoS4hi2Fqg='} width={300} height={390} />}
                    >
                      <Meta title={movie.title} />
                      <br />
                      <Typography.Title level={5} style={{ display: "inline-block" }}>As:</Typography.Title> {movie.character}
                      <br />
                    </Card>
                  ))}
                </div>
                <br />
              </>
              )}
              {selectedDuo && (<>
                <Typography.Title level={4}>He/She's golden partners:</Typography.Title>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {selectedDuo.map((crew) => (
                    <Card
                      key={crew.crew_id}
                      hoverable
                      style={{ width: 300, margin: '10px' }}
                      cover={<img alt={crew.name} src={crew.photo_url ? crew.photo_url : 'https://media.istockphoto.com/id/1193046540/vector/photo-coming-soon-image-icon-vector-illustration-isolated-on-white-background-no-website.jpg?s=612x612&w=0&k=20&c=4wx1UzigP0g9vJv9D_DmOxdAT_DtX5peZdoS4hi2Fqg='} width={300} height={390} />}
                    >
                      <Meta title={crew.name} />
                      <br />
                      <p><strong>{crew.name} has worked with {selectedActor.name} in {crew.co_time} movies!</strong></p>
                      {((parseInt(crew.nomination) !== 0) || (parseInt(crew.winning) !== 0)) && (
                        <p>
                          <strong>He/she himself/herself was nominated for an Oscar {crew.nomination} times and had won {crew.winning} of them!</strong>
                        </p>
                      )}
                      <br />
                    </Card>
                  ))}
                </div>
                <br />
              </>
              )}
              {selectedCo && (<>
                <Typography.Title level={4}>His/Her most famous co-workers:</Typography.Title>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {selectedCo.map((crew) => (
                    <Card
                      key={crew.crew_id}
                      hoverable
                      style={{ width: 300, margin: '10px' }}
                      cover={<img alt={crew.name} src={crew.photo_url ? crew.photo_url : 'https://media.istockphoto.com/id/1193046540/vector/photo-coming-soon-image-icon-vector-illustration-isolated-on-white-background-no-website.jpg?s=612x612&w=0&k=20&c=4wx1UzigP0g9vJv9D_DmOxdAT_DtX5peZdoS4hi2Fqg='} width={300} height={390} />}
                    >
                      <Meta title={crew.name} />
                      <br />
                      <p><strong>{crew.name} has worked with {selectedActor.name} in {crew.co_time} movies!</strong></p>
                      {((parseInt(crew.nomination) !== 0) || (parseInt(crew.winning) !== 0)) && (
                        <p>
                          <strong>He/she himself/herself was nominated for an Oscar {crew.nomination} times and had won {crew.winning} of them!</strong>
                        </p>
                      )}
                      <br />
                    </Card>
                  ))}
                </div>
                <br />
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

export default ActorList
