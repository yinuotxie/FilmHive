import MultifacedDirector from "@/components/MultifacedDirector"
import HighlyRated from "@/components/HighlyRated"
import OscarMovies from "@/components/OscarMovies"
import { Row } from 'antd'

function FunFacts () {
  return (
    <>
      <Row>
        <OscarMovies />
      </Row>
      <Row>
        <HighlyRated />
      </Row>
      <Row>
        <MultifacedDirector />
      </Row>
    </>
  )
}

export default FunFacts