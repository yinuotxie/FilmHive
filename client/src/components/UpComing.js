import React, { useState, useEffect } from 'react'
import { Card, Typography } from 'antd'
import axios from 'axios'

const { Meta } = Card

const UpComing = () => {
  const [upComings, setupComing] = useState([])

  useEffect(() => {
    const fetchUpComings = async () => {
      try {
        const response = await axios.get('https://api.themoviedb.org/3/movie/upcoming', {
          params: {
            api_key: '30375875d5535c02966349450fa8d221',
          },
        })
        setupComing(response.data.results)
      } catch (error) {
        console.error(error)
      }
    }

    fetchUpComings()
  }, [])

  const filteredUpComings = upComings.filter((item) => {
    const releaseDate = new Date(item.release_date)
    const today = new Date()
    return releaseDate >= today
  })

  return (
    <div style={{
      width: '100%',
      marginBottom: 10,
      border: '2px solid #ccc',
      borderRadius: 5,
      padding: 10,
      backgroundImage: `url(${"https://wallpapercave.com/wp/wp4009237.jpg"})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    }}>
      <Typography.Title level={3}>Up coming movies</Typography.Title>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {filteredUpComings.slice(0, 14).map((item) => (
          <Card
            key={item.id}
            hoverable
            style={{ width: '100%', maxWidth: 240, margin: '16px' }}
            cover={<img alt={item.title} src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} />}
          >
            <Meta
              title={
                <>
                  {item.title}
                  <br />
                  <span style={{ fontSize: 12, fontWeight: 'normal' }}>Release Date: {item.release_date}</span>
                </>
              }
              description={item.overview}
            />
          </Card>

        ))}
      </div>
    </div>
  )
}

export default UpComing
