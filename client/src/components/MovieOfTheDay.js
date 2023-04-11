import { Card, Image } from "antd"

const MovieOfTheDay = ({ title, posterUrl, summary }) => {
  return (
    <div style={{ marginBottom: 10 }}>
      <Card
        //   title={"Movie of the Day"}
        //   cover={<Image src={posterUrl} alt={title} />}
        //   style={{ width: 400 }}
        // >
        //   <p>{title}</p>
        //   <p>{summary}</p>
        title={"Movie of the Day"}
        cover={<Image src={"https://www.themoviedb.org/t/p/w500/rPdtLWNsZmAtoZl9PK7S2wE3qiS.jpg"} alt={"The Godfather"} />}
        style={{ width: 400 }}
      >
        <p>{"The Godfather"}</p>
        <p>{"The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son."}</p>
      </Card>
    </div>
  )
}

export default MovieOfTheDay
