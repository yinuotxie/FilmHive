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


// utils
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
      res.json(data)
    }
  })
}


// movie filter
const allMovies = async function (req, res) {

  const limit = parseInt(req.query.limit || 20)
  const offset = parseInt(req.query.offset || 0)
  const searchValue = req.query.searchValue || ''
  const genre = req.query.genre || ''
  const region = req.query.region || ''
  const runtimeMin = parseInt(req.query.runtimeMin) || 0
  const runtimeMax = parseInt(req.query.runtimeMax) || 51421
  const ratingMin = parseFloat(req.query.ratingMin) || 0
  const ratingMax = parseFloat(req.query.ratingMax) || 10
  const releaseYearMin = parseInt(req.query.releaseYearMin) || 1900
  const releaseYearMax = parseInt(req.query.releaseYearMax) || 2025
  const awarded = req.query.awarded === 'true' ? 1 : 0
  const nominated = req.query.nominated === 'true' ? 1 : 0
  const rated = req.query.rated === 'true'

  try {
    let query = `
    SELECT DISTINCT Movies.id, Movies.region, Movies.release_year, Movies.runtimeMinutes, Movies.title, Movies.imdb_rating, Movies.plot, Movies.poster, Movies.rated
    FROM Movies 
         JOIN MovieGenres ON Movies.id = MovieGenres.movie_id
         JOIN Genres ON MovieGenres.genre_id = Genres.id
  `
    if (awarded || nominated) {
      query += ` JOIN OscarAwards ON Movies.id = OscarAwards.movie_id`
    }

    query += ` WHERE imdb_rating >= ? AND imdb_rating <= ?
    AND release_year >= ? AND release_year <= ?
    AND runtimeMinutes >= ? AND runtimeMinutes <= ?`

    const params = [ratingMin, ratingMax, releaseYearMin, releaseYearMax, runtimeMin, runtimeMax]

    if (searchValue) {
      query += ` AND Movies.title LIKE ?`
      params.push(`%${searchValue}%`)
    }

    if (genre) {
      query += ` AND Genres.name = ?`
      params.push(genre)
    }

    if (region) {
      query += ` AND region = ?`
      params.push(region)
    }

    if (awarded) {
      query += ` AND is_winner >= 1`
    }

    if (nominated) {
      query += ` AND is_winner >= 0`
    }

    if (rated) {
      query += ` AND rated IS NOT NULL AND rated != 'Unrated' AND rated != 'Not rated'`
    }

    let total = 0
    if (searchValue || genre || region || runtimeMin || runtimeMax !== 51421 || ratingMin || ratingMax !== 10 || awarded || nominated || rated || releaseYearMin !== 1900 || releaseYearMax !== 2025) {
      const [temp] = await pool.query(query, params)
      total = temp.length
    } else {
      total = 108898
    }

    query += ' LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const [results] = await pool.query(query, params)

    res.status(200).json({ movies: results, total: total })
  } catch (err) {
    console.log(err)
    res.status(500).send('Error retrieving movies from database')
  }
}


// actor filter
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


// director filter
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


// search in home page
const homeSearch = async function (req, res) {

  const searchValue = req.query.searchValue || ''

  try {
    const [moviesResult] = await pool.query(`SELECT DISTINCT M.id, M.title, M.poster FROM Movies M WHERE title LIKE ?`, [`%${searchValue}%`])
    const moviesTotal = moviesResult.length

    const [moviesActInResult] = await pool.query(`SELECT DISTINCT M.id, M.title, M.poster FROM Movies M JOIN ActIn AI on M.id = AI.movie_id JOIN Direct D on M.id = D.movie_id JOIN Crews C on AI.crew_id = C.id WHERE C.name LIKE ? `, [`%${searchValue}%`])
    const moviesActInTotal = moviesActInResult.length

    const [moviesCharactersResult] = await pool.query(`SELECT DISTINCT M.id, M.title, M.poster FROM Movies M JOIN ActIn AI on M.id = AI.movie_id WHERE AI.character LIKE ?`, [`%${searchValue}%`])
    const moviesCharactersTotal = moviesCharactersResult.length

    const [actorsResult] = await pool.query(`SELECT id, name, photo_url FROM Actors WHERE Actors.name LIKE ?`, [`%${searchValue}%`])
    const actorsTotal = actorsResult.length

    const [directorsResult] = await pool.query(`SELECT id, name, photo_url FROM Directors WHERE Directors.name LIKE ?`, [`%${searchValue}%`])
    const directorsTotal = directorsResult.length

    const movies = moviesResult.map((movie) => ({
      name: movie.title,
      image: movie.poster,
      type: 'movie1',
      id: movie.id,
    }))

    const moviesActIn = moviesActInResult.map((movie) => ({
      name: movie.title,
      image: movie.poster,
      type: 'movie2',
      id: movie.id,
    }))

    const moviesCharacters = moviesCharactersResult.map((movie) => ({
      name: movie.title,
      image: movie.poster,
      type: 'movie3',
      id: movie.id,
    }))

    const actors = actorsResult.map((actor) => ({
      name: actor.name,
      image: actor.photo_url,
      type: 'actor',
      id: actor.id,
    }))

    const directors = directorsResult.map((director) => ({
      name: director.name,
      image: director.photo_url,
      type: 'director',
      id: director.id,
    }))

    const searchResults = [...movies, ...moviesActIn, ...moviesCharacters, ...actors, ...directors]

    res.status(200).json({ searchResults: searchResults, moviesTotal: moviesTotal, moviesActInTotal: moviesActInTotal, moviesCharactersTotal: moviesCharactersTotal, actorsTotal: actorsTotal, directorsTotal: directorsTotal })
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
      LIMIT 14;
    `
    const [rows] = await pool.query(query, [user_email])
    res.status(200).json({ movies: rows })
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}


// selected movie's genres
const selectedGenres = async function (req, res) {

  const movie_id = req.query.movie_id

  try {
    let query = `
      SELECT g.name
      FROM Genres g JOIN MovieGenres mg ON g.id = mg.genre_id
      WHERE mg.movie_id = ?
    `
    const results = await pool.query(query, [movie_id])

    const genres = results[0].map(genre => genre.name).join(' / ')

    res.status(200).json({ genres })

  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Server error' })
  }
}


// selected movie's genres
const selectedAwards = async function (req, res) {

  const movie_id = req.query.movie_id

  try {
    let query = `
      SELECT *
      FROM OscarAwards
      WHERE movie_id = ?
    `
    const results = await pool.query(query, [movie_id])
    // console.log(results[0])
    res.json(results[0])

  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Server error' })
  }
}


// selected movie's actors
const selectedActors = async function (req, res) {

  const movie_id = req.query.movie_id

  try {
    let query = `
      SELECT ActIn.character, Crews.id, Crews.name, Crews.photo_url
      FROM ActIn JOIN Crews ON ActIn.crew_id = Crews.id
      WHERE ActIn.movie_id = ?;
    `
    const results = await pool.query(query, [movie_id])
    res.json(results[0])

  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Server error' })
  }
}


// selected movie's actors
const selectedDirectors = async function (req, res) {

  const movie_id = req.query.movie_id

  try {
    let query = `
      SELECT Crews.id, Crews.name, Crews.photo_url
      FROM Direct JOIN Crews ON Direct.crew_id = Crews.id
      WHERE Direct.movie_id = ?;
    `
    const results = await pool.query(query, [movie_id])
    console.log('results[0]')

    console.log(results[0])

    res.json(results[0])

  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Server error' })
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
  recommendations,
  selectedGenres,
  selectedAwards,
  selectedActors,
  selectedDirectors
}
