import React, { useEffect, useState } from 'react'
import { Card, Pagination, Modal, Typography, Spin } from 'antd'
import axios from 'axios'

const config = require('../config.json')

const { Meta } = Card

const DirectorList = ({ filters }) => {

  const [directors, setDirectors] = useState([])
  const [totalDirectors, setTotalDirectors] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [directorsPerPage, setDirectorsPerPage] = useState(30)
  const [visible, setVisible] = useState(false)

  const [selectedDirector, setSelectedDirector] = useState(null)
  const [selectedAwards, setSelectedAwards] = useState('')
  const [selectedFamousFor, setSelectedFamousFor] = useState('')
  const [selectedDirect, setSelectedDirect] = useState('')
  const [selectedDuo, setSelectedDuo] = useState('')
  const [selectedCo, setSelectedCo] = useState('')

  useEffect(() => {

    const offset = (currentPage - 1) * directorsPerPage

    const params = {
      limit: directorsPerPage,
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

    axios.get(`http://${config.server_host}:${config.server_port}/alldirectors`, { params })
      .then((response) => {
        setDirectors(response.data.directors)
        setTotalDirectors(response.data.total)
      }).catch((error) => {
        console.log(error)
      })
  }, [currentPage, directorsPerPage, filters])

  useEffect(() => {
    setCurrentPage(1)
  }, [directorsPerPage, filters])

  useEffect(() => {
    setTotalDirectors(-1)
    setDirectors([])
  }, [filters])

  useEffect(() => {

    if (selectedDirector) {
      const params = {
        crew_id: selectedDirector.id
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

      axios.get(`http://${config.server_host}:${config.server_port}/selecteddirect`, { params })
        .then((response) => {
          setSelectedDirect(response.data)
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
  }, [selectedDirector])

  const handleDirectorsPerPageChange = (currentPage, size) => {
    setCurrentPage(1)
    setDirectorsPerPage(size)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const showModal = (movie) => {
    setSelectedDirector(movie)
    setVisible(true)
  }

  const handleCancel = () => {
    setVisible(false)
    setSelectedDirector(null)
  }

  return (
    <>
      {totalDirectors < 0 ? (
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
            <Typography.Title level={4}>{totalDirectors} director(s) found.</Typography.Title>
          </div>
          {totalDirectors > 0 &&
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
                {directors.map((director) => (
                  <Card
                    key={director.id}
                    hoverable
                    style={{ width: 300, margin: '10px' }}
                    cover={<img alt="director poster" src={director.photo_url ? director.photo_url : 'https://media.istockphoto.com/id/1193046540/vector/photo-coming-soon-image-icon-vector-illustration-isolated-on-white-background-no-website.jpg?s=612x612&w=0&k=20&c=4wx1UzigP0g9vJv9D_DmOxdAT_DtX5peZdoS4hi2Fqg='} width={300} height={390} />}
                    onClick={() => showModal(director)}
                  >
                    <Meta title={director.name} />
                    <br />
                    <p>
                      <strong>Birth date:</strong> {director.birth_date ? director.birth_date.match(/^\d{4}-\d{2}-\d{2}/)[0] : "we don't know"}
                    </p>
                    <p>
                      <strong>He/She also worked in/as:</strong> {director.profession.replace(/,director|director,/g, '').split(',').map((item) => item.trim()).join(' / ')}
                    </p>
                  </Card>
                ))}
              </div>
              <Pagination
                current={currentPage}
                pageSize={directorsPerPage}
                pageSizeOptions={[30, 60, 90]}
                total={totalDirectors}
                onChange={handlePageChange}
                onShowSizeChange={handleDirectorsPerPageChange}
                style={{ marginTop: '20px', textAlign: 'center' }}
              />
            </>
          }
          {selectedDirector && (
            <Modal
              visible={visible}
              onCancel={handleCancel}
              footer={null}
              width={1500}
            >
              <Typography.Title level={2}>{selectedDirector.name}</Typography.Title>
              <div style={{ display: 'flex', alignItems: 'center', padding: '20px', margin: '20px' }}>
                <img
                  alt="director photo"
                  src={selectedDirector.photo_url ? selectedDirector.photo_url : 'https://media.istockphoto.com/id/1193046540/vector/photo-coming-soon-image-icon-vector-illustration-isolated-on-white-background-no-website.jpg?s=612x612&w=0&k=20&c=4wx1UzigP0g9vJv9D_DmOxdAT_DtX5peZdoS4hi2Fqg='}
                  width={300} height={390}
                />
                <div style={{ marginLeft: '100px' }}>
                  <p>
                    <Typography.Title level={5} style={{ display: "inline-block" }}>Name:</Typography.Title> {selectedDirector.name}
                    <br />
                    <br />
                    <Typography.Title level={5} style={{ display: "inline-block" }}>Birth Date:</Typography.Title> {selectedDirector.birth_date ? selectedDirector.birth_date.match(/^\d{4}-\d{2}-\d{2}/)[0] : "It's a mystery!"}
                    <br />
                    <br />
                    <Typography.Title level={5} style={{ display: "inline-block" }}>Death Year:</Typography.Title> {selectedDirector.death_year ? selectedDirector.death_year : "Alive"}
                    <br />
                    <br />
                    <Typography.Title level={5} style={{ display: "inline-block" }}>Profession(s):</Typography.Title> {selectedDirector.profession.split(',').map((item) => item.trim()).join(' / ')}
                    <br />
                    <br />
                    <Typography.Title level={5} style={{ display: "inline-block" }}>Average Rating of Movies Directed:</Typography.Title> {parseFloat(selectedDirector.avg_rating).toFixed(2)} / 10.00
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
              {selectedDirect && (<>
                <Typography.Title level={4}>He/She once directed:</Typography.Title>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {selectedDirect.map((movie) => (
                    <Card
                      key={movie.movie_id}
                      hoverable
                      style={{ width: 300, margin: '10px' }}
                      cover={<img alt={movie.title} src={movie.poster ? movie.poster : 'https://media.istockphoto.com/id/1193046540/vector/photo-coming-soon-image-icon-vector-illustration-isolated-on-white-background-no-website.jpg?s=612x612&w=0&k=20&c=4wx1UzigP0g9vJv9D_DmOxdAT_DtX5peZdoS4hi2Fqg='} width={300} height={390} />}
                    >
                      <Meta title={movie.title} />
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
                      <p><strong>{crew.name} has worked with {selectedDirector.name} in {crew.co_time} movies!</strong></p>
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
                      <p><strong>{crew.name} has worked with {selectedDirector.name} in {crew.co_time} movies!</strong></p>
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

export default DirectorList