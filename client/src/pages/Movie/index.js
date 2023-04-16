import MovieFilter from "@/components/MovieFilter"
import MovieList from "@/components/MovieList"

function Movie () {
  return (
    <div style={{ justifyContent: 'center' }}>
      <MovieFilter />
      <MovieList />
    </div>
  )
}

export default Movie