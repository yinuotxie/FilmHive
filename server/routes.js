const mysql = require('mysql')
const mysql_r = require('mysql2/promise')
const config = require('./config.json')

const pool = mysql_r.createPool({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
})

connection.connect((err) => err && console.log(err))

const checkUserExists = async function (email) {
  const [rows] = await pool.query('SELECT email FROM Users WHERE email = ?', [email])
  return rows.length > 0
}

// routes
// register
const register = async function (req, res) {

  const email = req.query.email
  const username = req.query.username
  const password = req.query.password
  const favoriteGenres = req.query.favoriteGenres

  try {
    const userExists = await checkUserExists(email)
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    await pool.query('INSERT INTO Users (email, username, password) VALUES (?, ?, ?)', [email, username, password])

    const genreIds = await Promise.all(favoriteGenres.map(async (genreName) => {
      const [rows] = await pool.query('SELECT id FROM Genres WHERE name = ?', [genreName])
      return rows[0].id
    }))

    await Promise.all(genreIds.map(async (genreId) => {
      await pool.query('INSERT INTO UserPreference (email, genre_id) VALUES (?, ?)', [email, genreId])
    }))

    res.sendStatus(201)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

// login
const login = async function (req, res) {

  const email = req.query.email

  connection.query(`
    SELECT *
    FROM Users
    WHERE email = '${email}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err)
      res.status(401).json({ message: 'Invalid email or password' })
    } else {
      console.log(data)
      res.json(data)
    }
  })
}

// all movies
const allMovies = async function (req, res) {

  const limit = parseInt(req.query.limit || 20)
  const offset = parseInt(req.query.offset || 0)
  // const genre = req.query.genre || ''
  const country = req.query.country || ''
  const runtime = parseInt(req.query.runtime || 0)
  const rating = parseFloat(req.query.rating || 0)
  const releaseYear = parseInt(req.query.releaseYear || 0)
  // const awarded = req.query.awarded === 'true'
  const rated = req.query.rated === 'true'

  try {
    // total numbers of target movies
    let query_total = 'SELECT COUNT(*) as total FROM Movies'
    let queryParams_total = []

    // target movies
    let query_movies = 'SELECT * FROM Movies'
    let queryParams_movies = []

    if (country || runtime || rating || releaseYear || rated) {

      query_total = 'SELECT COUNT(*) as total FROM Movies WHERE '
      query_movies = 'SELECT * FROM Movies WHERE '
      let conditions = []

      // if (genre) {
      //   conditions.push(`genre LIKE ?`)
      //   queryParams_total.push(`%${genre}%`)
      //   queryParams_movies.push(`%${genre}%`)
      // }
      if (country) {
        conditions.push(`country LIKE ?`)
        queryParams_total.push(`%${country}%`)
        queryParams_movies.push(`%${country}%`)
      }
      if (runtime) {
        conditions.push(`runtimeMinutes <= ?`)
        queryParams_total.push(runtime)
        queryParams_movies.push(runtime)
      }
      if (rating) {
        conditions.push(`imdb_rating >= ?`)
        queryParams_total.push(rating)
        queryParams_movies.push(rating)
      }
      if (releaseYear) {
        conditions.push(`release_year >= ?`)
        queryParams_total.push(releaseYear)
        queryParams_movies.push(releaseYear)
      }
      // if (awarded) {
      //   conditions.push(`awards IS NOT NULL`)
      // }
      if (rated) {
        conditions.push(`rated IS NOT NULL AND rated != 'Unrated' AND rated != 'Not rated'`)
      }
      query_total += conditions.join(' AND ')
      query_movies += conditions.join(' AND ')
    }

    query_movies += ' LIMIT ? OFFSET ?'
    queryParams_movies.push(limit, offset)

    const [results] = await pool.query(query_total, queryParams_total)
    const total = results[0].total

    const [rows] = await pool.query(query_movies, queryParams_movies)
    res.status(200).json({ movies: rows, total: total })
  } catch (err) {
    console.log(err)
    res.status(500).send('Error retrieving movies from database')
  }
}

// all actors
const allActors = async function (req, res) {

  const limit = parseInt(req.query.limit || 20)
  const offset = parseInt(req.query.offset || 0)

  try {
    const [results] = await pool.query(`SELECT COUNT(*) as total FROM Crews WHERE profession LIKE '%actor%' OR profession LIKE '%actress%'`)
    const total = results[0].total
    const [rows] = await pool.query(`SELECT * FROM Crews WHERE profession LIKE '%actor%' OR profession LIKE '%actress%' LIMIT ? OFFSET ?`, [limit, offset])
    res.status(200).json({ actors: rows, total: total })
  } catch (err) {
    console.log(err)
    res.status(500).send('Error retrieving actors from database')
  }
}

// all directors
const allDirectors = async function (req, res) {

  const limit = parseInt(req.query.limit || 20)
  const offset = parseInt(req.query.offset || 0)

  try {
    const [results] = await pool.query(`SELECT COUNT(*) as total FROM Crews WHERE profession LIKE '%director%'`)
    const total = results[0].total
    const [rows] = await pool.query(`SELECT * FROM Crews WHERE profession LIKE '%director%' LIMIT ? OFFSET ?`, [limit, offset])
    res.status(200).json({ directors: rows, total: total })
  } catch (err) {
    console.log(err)
    res.status(500).send('Error retrieving actors from database')
  }
}

// home page search
const homeSearch = async function (req, res) {
  const searchValue = req.query.searchValue || ''

  try {
    const [moviesResult] = await pool.query(`SELECT COUNT(*) as total FROM Movies WHERE title LIKE ?`, [`%${searchValue}%`])
    const moviesTotal = moviesResult[0].total
    const [moviesRows] = await pool.query(`SELECT * FROM Movies WHERE title LIKE ?`, [`%${searchValue}%`])

    const [crewsResult] = await pool.query(`SELECT COUNT(*) as total FROM Crews WHERE name LIKE ?`, [`%${searchValue}%`])
    const crewsTotal = crewsResult[0].total
    const [crewsRows] = await pool.query(`SELECT * FROM Crews WHERE name LIKE ?`, [`%${searchValue}%`])

    const movies = moviesRows.map((movie) => ({
      name: movie.title,
      image: movie.poster,
      type: 'movie',
      id: movie.id,
    }))
    const crews = crewsRows.map((crew) => ({
      name: crew.name,
      image: crew.photo_url,
      type: 'crew',
      id: crew.id,
    }))
    const searchResults = [...movies, ...crews]

    res.status(200).json({ searchResults: searchResults, total: moviesTotal + crewsTotal })
  } catch (err) {
    console.log(err)
    res.status(500).send('Error retrieving data from database')
  }
}

// multifaced directors
const multifacedDirector = async function (req, res) {
  try {
    let query = `
      SELECT c.id, c.name, c.photo_url, COUNT(DISTINCT g.id) as num_genres,
             AVG(m.imdb_rating) as avg_rating
      FROM Crews c
           JOIN Direct d ON d.crew_id = c.id
           JOIN Movies m ON m.id = d.movie_id
           JOIN MovieGenres mg ON mg.movie_id = m.id
           JOIN Genres g ON g.id = mg.genre_id
      WHERE c.id IN (
                SELECT DISTINCT d.crew_id
                FROM Direct d
                JOIN Movies m ON m.id = d.movie_id
                JOIN MovieGenres mg ON mg.movie_id = m.id
                GROUP BY d.crew_id
                HAVING COUNT(DISTINCT mg.genre_id) > 1
            )
      GROUP BY c.id
      HAVING AVG(m.imdb_rating) > 8
      ORDER BY num_genres DESC, avg_rating DESC
      LIMIT 10; 
    `
    const [rows] = await pool.query(query)
    res.status(200).json({ directors: rows })
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

// movir of the day
const movieOfTheDay = async function (req, res) {
  try {
    let query = `
      SELECT id, title, imdb_rating, plot, poster
      FROM Movies
      ORDER BY RAND()
      LIMIT 1
    `
    const [rows] = await pool.query(query)
    res.status(200).json(rows[0])
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

// recommendations

const recommendations = async function (req, res) {

  const user_email = req.query.email || "yzphilly@outlook.com"

  try {
    let query = `
      WITH MOVIE_PREF AS (
          SELECT id, genre_id, title, imdb_rating, plot, poster
          FROM Movies M JOIN MovieGenres MG on M.id = MG.movie_id
          WHERE EXISTS (
              SELECT genre_id
              FROM UserPreference JOIN Genres G on UserPreference.genre_id = G.id
              WHERE email = '${user_email}' AND genre_id = MG.genre_id
          )
      ),
      AVG_GENRE_RATING AS (
          SELECT genre_id, AVG(imdb_rating) AS avg_rating
          FROM Movies M JOIN MovieGenres MG on M.id = MG.movie_id
          GROUP BY genre_id
      )
      SELECT DISTINCT id, title, imdb_rating, plot, poster
      FROM MOVIE_PREF MP
           JOIN AVG_GENRE_RATING AGR on MP.genre_id = AGR.genre_id
      WHERE imdb_rating > AGR.avg_rating
      ORDER BY RAND()
      LIMIT 10;
    `
    const [rows] = await pool.query(query, [user_email])
    res.status(200).json({ movies: rows })
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

module.exports = {
  register,
  login,
  allMovies,
  allActors,
  allDirectors,
  homeSearch,
  multifacedDirector,
  movieOfTheDay,
  recommendations
}
