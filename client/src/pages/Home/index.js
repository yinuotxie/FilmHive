import MovieOfTheDay from "@/components/MovieOfTheDay"
import Recommendation from "@/components/Recommendation"
import LatestMovies from "@/components/LatestMovies"
import UpComing from "@/components/UpComing"
import News from "@/components/News"
import SearchBar from "@/components/SearchBar"
import { Row, Col } from 'antd'

function Home () {
  return (
    <>
      <SearchBar />
      <Row>
        <News />
      </Row>
      <Row>
        <MovieOfTheDay />
      </Row>
      <Row>
        <Recommendation />
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