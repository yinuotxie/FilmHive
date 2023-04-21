const mysql = require('mysql')
const mysql_r = require('mysql2/promise')
const config = require('./config.json')

// database connection
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

// create connection
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
})

connection.connect((err) => err && console.log(err))

// TODO: what is this for?
const checkUserExists = async function (email) {
  const [rows] = await pool.query('SELECT email FROM Users WHERE email = ?', [email])
  return rows.length > 0
}

// Route: GET /register
// Description: Register a new user
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

// Route: GET /login
// Description: Login a user
const login = async function (req, res) {

  const email = req.query.email
  const password = req.query.password
  // TODO: check if user exists and password is correct
  // TODO: return username if correct, 401 if not
  connection.query(`
    SELECT username
    FROM Users
    WHERE email = '${email}' AND password = '${password}
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

// wide range director
const wideRangeDirector = async function (req, res) {

  connection.query(`
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
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err)
      res.status(401).json({ message: 'Wide Range Director Not Found.' })
    } else {
      console.log(data)
      res.json(data)
    }
  })
}

// crew info
const crewInfo = async function (req, res) {

  const crew_id = req.params.crew_id

  connection.query(`
    SELECT *
    FROM Crews
    WHERE id='${crew_id}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err)
      res.status(401).json({ message: 'Crew Not Found.' })
    } else {
      console.log(data)
      res.json(data)
    }
  })
}

// crew award
const crewAward = async function (req, res) {

  const crew_id = req.params.crew_id

  connection.query(`
    SELECT O.year, O.category, O.crew_id, O.movie_id, O.is_winner, M.title
    FROM OscarAwards O
    JOIN Movies M on O.movie_id = M.id
    WHERE crew_id='${crew_id}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err)
      res.status(401).json({ message: 'Award Not Found.' })
    } else {
      console.log(data)
      res.json(data)
    }
  })
}

// crew famous
const crewFamous = async function (req, res) {

  const crew_id = req.params.crew_id

  connection.query(`
    SELECT F.crew_id, F.movie_id, M.title, M.poster
    FROM FamousFor F
    JOIN Movies M on F.movie_id = M.id
    WHERE crew_id='${crew_id}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err)
      res.status(401).json({ message: 'Famous For Not Found.' })
    } else {
      console.log(data)
      res.json(data)
    }
  })
}

// crew act in
const crewActIn = async function (req, res) {

  const crew_id = req.params.crew_id

  connection.query(`
    (SELECT A.crew_id, A.movie_id, M.release_year, M.title, A.\`character\`, M.poster
    FROM ActIn A
    JOIN Movies M on A.movie_id = M.id
    WHERE crew_id='${crew_id}')
    UNION
    (SELECT D.crew_id, D.movie_id, M.release_year, M.title, 'Director', M.poster
    FROM Direct D
    JOIN Movies M on D.movie_id = M.id
    WHERE crew_id='${crew_id}')
    ORDER BY release_year
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err)
      res.status(401).json({ message: 'Act In Not Found.' })
    } else {
      console.log(data)
      res.json(data)
    }
  })
}

// crew rating
const crewRating = async function (req, res) {

  const crew_id = req.params.crew_id

  connection.query(`
    WITH AllMovie AS (
        (SELECT A.movie_id, M.imdb_rating
        FROM ActIn A
        JOIN Movies M on A.movie_id = M.id
        WHERE crew_id='${crew_id}')
        UNION
        (SELECT D.movie_id, M.imdb_rating
        FROM Direct D
        JOIN Movies M on D.movie_id = M.id
        WHERE crew_id='${crew_id}')
    )
    SELECT AVG(imdb_rating) AS Avg_Rating
    FROM AllMovie
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err)
      res.status(401).json({ message: 'Average Rating Not Found.' })
    } else {
      console.log(data)
      res.json(data)
    }
  })
}


// crew duo
const crewDuo = async function (req, res) {

  const crew_id = req.params.crew_id

  connection.query(`
    WITH CoStar AS (
        (SELECT AI.crew_id
        FROM ActIn A
        JOIN Movies M on A.movie_id = M.id
        JOIN ActIn AI on M.id = AI.movie_id
        WHERE A.crew_id='${crew_id}'
        AND A.crew_id <> AI.crew_id)
        UNION ALL
        (SELECT DI.crew_id
        FROM Direct D
        JOIN Movies M on D.movie_id = M.id
        JOIN Direct DI on M.id = DI.movie_id
        WHERE D.crew_id='${crew_id}'
        AND D.crew_id <> DI.crew_id)
    ),
    CoTime AS(
        SELECT crew_id, COUNT(*) AS co_time
        FROM CoStar
        GROUP BY crew_id
    ),
    Ordering AS (
        SELECT c.crew_id, c.co_time,
        SUM(CASE is_winner WHEN 1 THEN 1 ELSE 0 END) AS winning,
        SUM(CASE is_winner WHEN 0 THEN 1 ELSE 0 END) AS nomination
        FROM CoTime c
        LEFT JOIN OscarAwards o
        ON c.crew_id=o.crew_id
        GROUP BY c.crew_id
        ORDER BY co_time DESC, winning DESC, nomination DESC
    )
    SELECT Ordering.crew_id, Crews.name, Crews.photo_url, co_time, winning, nomination
    FROM Ordering
    JOIN Crews ON Ordering.crew_id = Crews.id
    LIMIT 3
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err)
      res.status(401).json({ message: 'Golden Duo Not Found.' })
    } else {
      console.log(data)
      res.json(data)
    }
  })
}

// crew famous co worker
const crewFamousCoworker = async function (req, res) {

  const crew_id = req.params.crew_id

  connection.query(`
    WITH CoStar AS (
        (SELECT AI.crew_id
        FROM ActIn A
        JOIN Movies M on A.movie_id = M.id
        JOIN ActIn AI on M.id = AI.movie_id
        WHERE A.crew_id='${crew_id}'
        AND A.crew_id <> AI.crew_id)
        UNION ALL
        (SELECT DI.crew_id
        FROM Direct D
        JOIN Movies M on D.movie_id = M.id
        JOIN Direct DI on M.id = DI.movie_id
        WHERE D.crew_id='${crew_id}'
        AND D.crew_id <> DI.crew_id)
    ),
    CoTime AS(
        SELECT crew_id, COUNT(*) AS co_time
        FROM CoStar
        GROUP BY crew_id
    ),
    Ordering AS (
        SELECT c.crew_id, c.co_time,
        SUM(CASE is_winner WHEN 1 THEN 1 ELSE 0 END) AS winning,
        SUM(CASE is_winner WHEN 0 THEN 1 ELSE 0 END) AS nomination
        FROM CoTime c
        LEFT JOIN OscarAwards o
        ON c.crew_id=o.crew_id
        GROUP BY c.crew_id
        ORDER BY winning DESC, nomination DESC
    )
    SELECT Ordering.crew_id, Crews.name, Crews.photo_url, co_time, winning, nomination
    FROM Ordering
    JOIN Crews ON Ordering.crew_id = Crews.id
    LIMIT 3
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err)
      res.status(401).json({ message: 'Famous Coworker Not Found.' })
    } else {
      console.log(data)
      res.json(data)
    }
  })
}

module.exports = {
  register,
  login,
}
