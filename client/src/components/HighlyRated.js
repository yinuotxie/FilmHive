import { Typography, List } from 'antd'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const config = require('../config.json')

const HighlyRated = () => {

  const [genres, setGenres] = useState([])

  useEffect(() => {
    axios.get(`http://${config.server_host}:${config.server_port}/highlyratedmovies`)
      .then((response) => {
        setGenres(response.data.genres)
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
      <Typography.Title level={3}>Top 3 Highly Rated Movies in Each Genre</Typography.Title>
      <List
        itemLayout="horizontal"
        dataSource={genres}
        grid={{ column: 6 }}
        renderItem={genre => (
          <List.Item>
            <List.Item.Meta
              title={genre.name}
              description={
                <>
                  <div>{genre.top1 && <div>1. {genre.top1}</div>}</div>
                  <div>{genre.top2 && <div>2. {genre.top2}</div>}</div>
                  <div>{genre.top3 && <div>3. {genre.top3}</div>}</div>

                </>
              }
            />
          </List.Item>
        )}
      />
    </div>
  )
}

export default HighlyRated
