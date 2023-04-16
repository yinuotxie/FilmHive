import MovieOfTheDay from "@/components/MovieOfTheDay"
import Recommendation from "@/components/Recommendation"
import NewFive from "@/components/NewFive"
import LatestMovies from "@/components/LatestMovies"
import UpComing from "@/components/UpComing"
import News from "@/components/News"
import SearchBar from "@/components/SearchBar"
import { Row, Col } from 'antd'

const movies = [
  {
    id: 1,
    title: "Raiders of the Lost Ark",
    posterUrl:
      "https://cdn.shopify.com/s/files/1/0057/3728/3618/products/609df06d7c2b5fb3125f16a7e4e34152_592ed277-d9d9-4400-af4b-f793370e5f54_500x749.jpg?v=1573616163",
  },
  {
    id: 2,
    title: 'Once Upon a Time in Hollywood',
    posterUrl: 'https://cdn.shopify.com/s/files/1/0057/3728/3618/products/onceuponatimehollywood.flo.ar_500x749.jpg?v=1597169428',
  },
  {
    id: 3,
    title: 'Back to the Future',
    posterUrl: 'https://cdn.shopify.com/s/files/1/0057/3728/3618/products/0b2b67a1de6a06d1ce65e4ccc64047e3_a9f7318e-c5c4-4d2a-aed2-890bbfad883c_500x749.jpg?v=1573590273',
  },
  {
    id: 4,
    title: 'Pulp Fiction',
    posterUrl: 'https://cdn.shopify.com/s/files/1/0057/3728/3618/products/pulpfiction.2436_500x749.jpg?v=1620048742',
  },
  {
    id: 5,
    title: 'Star Wars: Episode V - The Empire Strikes Back',
    posterUrl: 'https://cdn.shopify.com/s/files/1/0057/3728/3618/products/6cd691e19fffbe57b353cb120deaeb8f_8489d7bf-24ba-4848-9d0f-11f20cb35025_500x749.jpg?v=1573613877',
  },
]

function Home () {
  return (
    <>
      <SearchBar />
      <Row>
        <News />
      </Row>
      <Row>
        <Col flex={2}>
          <div style={{ paddingRight: 16 }}>
            <MovieOfTheDay />
          </div>
        </Col>
        <Col flex={3}>
          <Recommendation movies={movies} />
          <NewFive movies={movies} />
        </Col>
      </Row>
      <Row>
        <LatestMovies />
      </Row>
      <Row>
        <UpComing />
      </Row>
    </>
  )
}

export default Home