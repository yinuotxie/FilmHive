import React, { useEffect, useState } from 'react'
import { Card, Pagination } from 'antd'
import axios from 'axios'

const config = require('../config.json')

const { Meta } = Card

const ActorList = () => {

  const [actors, setActors] = useState([])
  const [totalActors, setTotalActors] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [actorsPerPage, setActorsPerPage] = useState(20)

  useEffect(() => {
    const offset = (currentPage - 1) * actorsPerPage
    axios.get(`http://${config.server_host}:${config.server_port}/allactors?limit=${actorsPerPage}&offset=${offset}`)
      .then((response) => {
        console.log(response.data.total)
        setActors(response.data.actors)
        setTotalActors(response.data.total)
      }).catch((error) => {
        console.log(error)
      })
  }, [currentPage, actorsPerPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [actorsPerPage])

  const handleActorsPerPageChange = (currentPage, size) => {
    setCurrentPage(1)
    setActorsPerPage(size)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
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
        {actors.map((actor) => (
          <Card
            key={actor.id}
            hoverable
            style={{ width: 300, margin: '10px' }}
            cover={<img alt="actor poster" src={actor.photo_url ? actor.photo_url : 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png'} />}
          >
            <Meta title={actor.name} />
            <br />
            <p>
              <strong>Birth date:</strong> {actor.birth_date ? actor.birth_date.match(/^\d{4}-\d{2}-\d{2}/)[0] : "we don't know"}
            </p>
            <p>
              <strong>He/She also worked in/as:</strong> {actor.profession.replace(/,actor|,actress|actor,|actress,/g, '').split(',').map((item) => item.trim()).join(' | ')}
            </p>
          </Card>
        ))}
      </div>
      <Pagination
        current={currentPage}
        pageSize={actorsPerPage}
        pageSizeOptions={[20, 50, 100]}
        total={totalActors}
        onChange={handlePageChange}
        onShowSizeChange={handleActorsPerPageChange}
        style={{ marginTop: '20px', textAlign: 'center' }}
      />
    </>
  )
}

export default ActorList
