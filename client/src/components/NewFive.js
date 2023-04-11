import { Row, Col, Card, Typography } from 'antd'

const NewFive = ({ movies }) => {
  return (
    <div style={{
      marginBottom: 10,
      border: '2px solid #ccc',
      borderRadius: 5,
      padding: 10,
      width: '1320px',
      backgroundImage: `url(${"https://wallpapercave.com/wp/wp4009237.jpg"})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    }}>
      <Typography.Title level={2}>Latest movies</Typography.Title>
      <Row gutter={12} style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
        {movies.map((movie) => (
          <Col span={4} key={movie.id} style={{ marginLeft: `20px` }}>
            <Card
              hoverable
              cover={<img alt={movie.title} src={movie.posterUrl} />}
            >
              <Card.Meta title={movie.title} />
            </Card>
          </Col>
        ))}
      </Row>
    </div >
  )
}

// todo: hyperlink

export default NewFive
