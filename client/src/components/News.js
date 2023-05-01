import React, { useState, useEffect } from 'react'
import { Card, Typography } from 'antd'
import axios from 'axios'

const { Meta } = Card

const News = () => {
  const [news, setNews] = useState([])

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('https://newsapi.org/v2/everything?q=movies&sortBy=publishedAt&pageSize=6&apiKey=18f4fa7f2f7149c381bd96287990c8aa')
        setNews(response.data.articles)
      } catch (error) {
        console.error(error)
      }
    }
    fetchNews()
  }, [])

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
      <Typography.Title level={3}>Latest news</Typography.Title>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {news.map((item) => (
          <Card
            key={item.url}
            hoverable
            style={{ width: 250, margin: '16px' }}
            cover={<img alt={item.title} src={item.urlToImage} />}
          >
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              <Meta
                title={
                  <>
                    {item.title}
                    <br />
                    <span style={{ fontSize: 12, fontWeight: 'normal' }}>{item.author}</span>
                    <br />
                    <span style={{ fontSize: 12, fontWeight: 'normal' }}>{item.publishedAt.substring(0, 19).replace('T', ' ')}</span>
                  </>
                }
                description={item.description} />
            </a>
          </Card>

        ))}
      </div>
    </div>
  )
}

export default News
