import MovieOfTheDay from "@/components/MovieOfTheDay"
import Recommendation from "@/components/Recommendation"
import LatestMovies from "@/components/LatestMovies"
import UpComing from "@/components/UpComing"
import News from "@/components/News"
import SearchBar from "@/components/SearchBar"
import { Row } from 'antd'

function Home () {
  return (
    <>
      <SearchBar />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 4fr' }}>
        <MovieOfTheDay style={{ gridColumn: '1 / 2' }} />
        <Recommendation style={{ gridColumn: '2 / 3' }} />
      </div>
      <Row>
        <News />
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