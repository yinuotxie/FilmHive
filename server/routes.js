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

module.exports = {
  register,
  login,
  allMovies,
  allActors,
  allDirectors,
}
