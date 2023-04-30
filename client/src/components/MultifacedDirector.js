import { Row, Col, Card, Typography, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const config = require('../config.json')

const MultifacedDirector = () => {

  const [directors, setDirectors] = useState([])

  useEffect(() => {
    axios.get(`http://${config.server_host}:${config.server_port}/multifaceddirector`)
      .then((response) => {
        setDirectors(response.data.directors)
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
      <Typography.Title level={2}>Top 10 Multifaced Directors</Typography.Title>
      {directors.length === 0 ? (
        <Spin tip="Data on its way!" size="large" />
      ) : (
        <>
          <Row gutter={12} style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
            {directors.map((director) => (
              <Col span={4} key={director.name} style={{ marginLeft: `20px` }}>
                <Card
                  hoverable
                  cover={<img alt={director.name} src={director.photo_url ? director.photo_url : 'https://media.istockphoto.com/id/1193046540/vector/photo-coming-soon-image-icon-vector-illustration-isolated-on-white-background-no-website.jpg?s=612x612&w=0&k=20&c=4wx1UzigP0g9vJv9D_DmOxdAT_DtX5peZdoS4hi2Fqg='} />}
                >
                  <Card.Meta title={director.name} />
                  <p>
                    It's amazing that he/she has directed <strong>{director.num_genres}</strong> different kinds of movies, with an average rating of <strong>{director.avg_rating.toFixed(2)}</strong>!!
                  </p>
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

export default MultifacedDirector
