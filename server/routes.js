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

const checkUserExists = async function (email) {
  const [rows] = await pool.query('SELECT email FROM Users WHERE email = ?', [email])
  return rows.length > 0
}

// Route: GET /login
// Description: Returns user information Route Parameter(s): None
// Query Parameter(s): email (string)* Route Handler: login
// Return Type: JSON Object
// Return Parameters: [ { email (string), username (string), password (string) }]
const login = async function (req, res) {

  const email = req.query.email
  const password = req.query.password
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

// Route: GET /register
// Description: Upload user information to database
// Route Parameter(s): None
// Query Parameter(s): email (string)*, username (string)*, password (string)*, favoriteGenres (list of strings)*
// Route Handler: register
// Return Type: /
// Return Parameters: /
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


// Route: GET /homesearch
// Description: This route is used to search for movies, actors, or directors containing the search input text.
// Route Parameters(s): None
// Query Parameter(s): input_text (string)*: the search term
//                     limit (int): the number of results to return
//                     offset (int): the number of results to skip
// Route Handler: homeSearch 
// Return Type: JSON Objects 
// Return Parameters:
// 1. movies (list of objects): a list of movie objects containing the search input text in their title, character, actor or director name. 
// Each movie object contains the following properties:
//    a. movie_id (string): the unique identifier of the movie
//    b. movie_title (string): the title of the movie
//    c. movie_poster (string): the URL of the poster image of the movie
// 2. actors (list of objects): a list of actor objects containing the search input text in their name. 
// Each actor object contains the following properties:
//    a. actor_id (string): the unique identifier of the actor
//    b. actor_name (string): the name of the actor
//    c. actor_photo (string): the URL of the photo of the actor
// 3. directors (list of objects): a list of director objects containing the search input text in their name. 
// Each director object contains the following properties:
//    a. director_id (string): the unique identifier of the director
//    b. director_name (string): the name of the directo
//    c. director_photo (string): the URL of the photo of the director
const homesearch = async function (req, res) {
  const input_text = req.query.input_text
  const limit = parseInt(req.query.limit || 20)
  const offset = parseInt(req.query.offset || 0)

  try {
    let actor_query = `
      SELECT id, name, photo_url
      FROM Actors
      WHERE Actors.name LIKE '${input_text}%'
      LIMIT ${limit} OFFSET ${offset}
    `

    let director_query = `
      SELECT id, name, photo_url
      FROM Directors
      WHERE Directors.name LIKE '${input_text}%'
      LIMIT ${limit} OFFSET ${offset}
    `

    // movie_query is a bit complicated because we need to search for the input text in the movie title, 
    // character name,  and actor/director name
    let movie_query = `
      SELECT DISTINCT M.id, M.title, M.poster
      FROM Movies M
          JOIN ActIn AI on M.id = AI.movie_id
          JOIN Direct D on M.id = D.movie_id
          JOIN Crews C on AI.crew_id = C.id
      WHERE title LIKE '${input_text}%' OR C.name LIKE '${input_text}%' OR AI.\`character\` LIKE '${input_text}%'
      LIMIT ${limit} OFFSET ${offset}
    `

    const [actor_rows] = await pool.query(actor_query, [input_text, limit, offset])
    const [director_rows] = await pool.query(director_query, [input_text, limit, offset])
    const [movie_rows] = await pool.query(movie_query, [input_text, limit, offset])

    res.status(200).json({ movies: movie_rows, actors: actor_rows, directors: director_rows })
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

// Route: GET /movieOfTheDay
// Description: This route is used to retrieve the information of a randomly selected movie for the day, including the movie name, ratings, plot, and movie poster.
// Route Parameters(s): None
// Query Parameter(s): None
// Route Handler: movieOfTheDay
// Return Type: JSON Object
// Return Parameters:
//  id(string): the id of the movie
//  title (string): the name of the selected movie
//  ratings (number): the ratings of the selected movie
//  plot (string): the plot summary of the selected movie
//  poster (string): the URL of the movie poster of the selected movie
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

// Route: GET /recommendations
// Description: This route is used to randomly retrieve 10 movie recommendations for a user based on their genre preferences, and their ratings must be greater than the average ratings in the genre. 
// Route Parameters(s): None 
// Query Parameter(s): email (string)*: the email of the user
// Route Handler: recommendations
// Type: JSON Object
// Return Parameters:
//  id(string): the id of the movie
//  title (string): the name of the selected movie
//  ratings (number): the ratings of the selected movie
//  plot (string): the plot summary of the selected movie
//  poster (string): the URL of the movie poster of the selected movie
const recommendations = async function (req, res) {
  const user_email = req.query.email

  try {
    // check if the user is logged in
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

// Route: GET / wideRangeDirector
// Description: Returns the top 10 Director who direct the most genre of movies Route Parameter(s): None
// Query Parameter(s): limit (number): the number of movies to be returned
//                     offset (number): the number of movies to be skipped
// Route Handler: wideRangeDirector
// Return Type: JSON Object
// Return Parameters: { crew_id(string), crew_name(string), crew_photo(string) }
const wideRangeDirector = async function (req, res) {
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

// Route: GET /movies/all
// Description: This route is used to retrieve all movies in the database.
// Route Parameters(s): None
// Query Parameter(s): limit (number): the number of movies to be returned
//                     offset (number): the number of movies to be skipped
// Route Handler: allMovies
// Return Type: JSON Object
// Return Parameters:
//  id(string): the id of the movie
//  title (string): the name of the selected movie
//  ratings (number): the ratings of the selected movie
//  plot (string): the plot summary of the selected movie
//  poster (string): the URL of the movie poster of the selected movie
const allMovies = async function (req, res) {
  const limit = parseInt(req.query.limit || 20)
  const offset = parseInt(req.query.offset || 0)

  try {
    let query = `
      SELECT id, title, imdb_rating, plot, poster
      FROM Movies
      LIMIT ? OFFSET ?
    `
    const [rows] = await pool.query(query, [limit, offset])
    res.status(200).json({ movies: rows })
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}

// Route: GET / movie / search
// Description: This route is used to search for movies based on various filters, such as genre, country, runtime, rating, release year, rated, and Oscar awarded.
// Route Parameters(s): None
// Query Parameter(s):
//  input_text(string): the search term
//  genre(string): the genre of the movie
//  country(string): the country of the movie
//  runtime_min(integer): the minimum runtime(in minutes) of the movie
//  runtime_max(integer): the maximum runtime(in minutes) of the movie
//  rating_min(float): the minimum rating of the movie
//  rating_max(float): the maximum rating of the movie
//  release_year_min(integer): the minimum release year of the movie
//  release_year_max(integer): the maximum release year of the movie
//  rated(boolean): a flag indicating whether the movie is rated or not
//  Oscar_awarded(boolean): a flag indicating whether the movie has won an Oscar or not
//  limit (number): the number of movies to be returned
//  offset (number): the number of movies to be skipped
// Route Handler: searchMovie 
// Return Type: JSON Object 
// Return Parameters:
//  id(string): the id of the movie
//  title (string): the name of the selected movie
//  ratings (number): the ratings of the selected movie
//  plot (string): the plot summary of the selected movie
//  poster (string): the URL of the movie poster of the selected movie
const searchMovie = async function (req, res) {
  const input_text = req.query.input_text || ''
  const genre = req.query.genre || ''
  const region = req.query.region || ''
  const runtimeMin = parseInt(req.query.runtime_min) || 0
  const runtimeMax = parseInt(req.query.runtime_max) || 1000000
  const ratingMin = parseFloat(req.query.rating_min) || 0
  const ratingMax = parseFloat(req.query.rating_max) || 10
  const releaseYearMin = parseInt(req.query.release_year_min) || 0
  const releaseYearMax = parseInt(req.query.release_year_max) || 1000000
  const rated = req.query.rated || 'Not Rated'
  const Oscar_awarded = req.query.Oscar_awarded || 0
  const limit = parseInt(req.query.limit || 20)
  const offset = parseInt(req.query.offset || 0)

  try {
    let query = `
      SELECT DISTINCT id, title, imdb_rating, plot, poster
      FROM Movies 
           JOIN MovieGenres ON Movies.id = MovieGenres.movie_id
           JOIN OscarAwards ON Movies.id = OscarAwards.movie_id
      WHERE imdb_rating >= ? AND imdb_rating <= ?
        AND release_year >= ? AND release_year <= ?
        AND runtime >= ? AND runtime <= ?
        AND rated = ? AND is_winner >= ?
    `
    const params = [ratingMin, ratingMax, releaseYearMin, releaseYearMax, runtimeMin, runtimeMax, rated, Oscar_awarded]

    if (input_text !== '') {
      query += ` AND title LIKE ?`
      params.push(`${input_text}%`)
    }

    if (genre !== '') {
      query += ` AND genre = ?`
      params.push(genre)
    }

    if (region !== '') {
      query += ` AND region = ?`
      params.push(region)
    }

    query += ` LIMIT ? OFFSET ?`
    params.push(limit, offset)

    const [rows] = await pool.query(query, params)
    res.status(200).json({ movies: rows })
  } catch (err) {
    console.log(err)
    res.status(500).send('Error retrieving movies from database')
  }
}

// Route: GET /actors/all
// Description: This route is used to retrieve all actors from the database
// Route Parameters(s): None
// Query Parameter(s): None
// Route Handler: allActors
// Type: JSON Object
// Return Parameters:
//  id(string): the id of the actor
//  name (string): the name of the selected actor
//  photo_url (string): the URL of the photo of the selected actor
const allActors = async function (req, res) {

  const limit = parseInt(req.query.limit || 20)
  const offset = parseInt(req.query.offset || 0)

  try {
    let query = `
     SELECT id, name, photo_url 
     FROM Actors
     LIMIT '${limit}' OFFSET '${offset}'
  `
    const [rows] = await pool.query(query, [limit, offset])
    res.status(200).json({ actors: rows })
  } catch (err) {
    console.log(err)
    res.status(500).send('Error retrieving actors from database')
  }
}

// Route: GET / actor / search
// Description: This route is used to search for actors based on various filters, such as awards, average rating of movies they have acted in, and birth year.
// Route Parameters(s): None
// Query Parameter(s):
//  input_text(string): the search term
//  awarded(boolean): a flag indicating whether the actor has won an award or not
//  avg_rating_min(float): the minimum average rating of movies the actor has acted in
//  avg_rating_max(float): the maximum average rating of movies the actor has acted in
//  birth_year_min(integer): the minimum birth year of the actor
//  birth_year_max(integer): the maximum birth year of the actor
//  limit (number): the number of actors to be returned
//  offset (number): the number of actors to be skipped
// Route Handler: searchActors 
// Return Type: JSON Object 
// Return Parameters:
//  id(string): the unique identifier of the actor
//  name(string): the name of the actor
//  photo(string): the URL of the photo of the actor
const searchActors = async function (req, res) {
  const input_text = req.query.input_text || ''
  const awarded = req.query.awarded || 0
  const avg_rating_min = parseFloat(req.query.avg_rating_min) || 0
  const avg_rating_max = parseFloat(req.query.avg_rating_max) || 10
  const birth_year_min = parseInt(req.query.birth_year_min) || 0
  const birth_year_max = parseInt(req.query.birth_year_max) || 1000000
  const limit = parseInt(req.query.limit || 20)
  const offset = parseInt(req.query.offset || 0)

  try {
    let query = `
      WITH ActorRatings AS (
          SELECT crew_id, AVG(M.imdb_rating) AS avg_rating
          FROM ActIn AI Join Movies M on AI.movie_id = M.id
          GROUP BY crew_id
      )
      SELECT A.id, A.name, A.photo_url
      FROM Actors A 
           JOIN ActorRatings AR on A.id = AR.crew_id
           JOIN OscarAwards OA on A.id = OA.crew_id
      WHERE OA.is_winner >= ? AND AR.avg_rating >= ? AND AR.avg_rating <= ? 
            AND A.birth_year >= ? AND A.birth_year <= ?
    `

    if (input_text !== '') {
      query += ` AND A.name LIKE ?`
    }
    query += ` LIMIT ? OFFSET ?`
    const params = [awarded, avg_rating_min, avg_rating_max, birth_year_min, birth_year_max,
      `${input_text}%`, limit, offset]
    const [rows] = await pool.query(query, params)
    res.status(200).json({ actors: rows })
  } catch (err) {
    console.log(err)
    res.status(500).send('Error retrieving actors from database')
  }
}

// Route: GET /directors/all
// Description: This route is used to retrieve all directors from the database
// Route Parameters(s): None
// Query Parameter(s): None
// Route Handler: allDirectors
// Type: JSON Object
// Return Parameters:
//  id(string): the id of the director
//  name (string): the name of the selected director
//  photo_url (string): the URL of the photo of the selected director
const allDirectors = async function (req, res) {
  const limit = parseInt(req.query.limit || 20)
  const offset = parseInt(req.query.offset || 0)

  try {
    let query = `
      SELECT id, name, photo_url
      FROM Directors
      LIMIT '${limit}' OFFSET '${offset}'
    `
    const [rows] = await pool.query(query, [limit, offset])
    res.status(200).json({ directors: rows })
  } catch (err) {
    console.log(err)
    res.status(500).send('Error retrieving directions from database')
  }
}

// Route: GET / director / search
// Description: This route is used to search for actors based on various filters, such as awards, average rating of movies they have acted in, and birth year.
// Route Parameters(s): None
// Query Parameter(s):
//  input_text(string): the search term
//  awarded(boolean): a flag indicating whether the actor has won an award or not
//  avg_rating_min(float): the minimum average rating of movies the actor has acted in
//  avg_rating_max(float): the maximum average rating of movies the actor has acted in
//  birth_year_min(integer): the minimum birth year of the actor
//  birth_year_max(integer): the maximum birth year of the actor
//  limit (number): the number of actors to be returned
//  offset (number): the number of actors to be skipped
// Route Handler: searchDirectors 
// Return Type: JSON Object 
// Return Parameters:
//  director_id(string): the unique identifier of the director
//  director_name(string): the name of the director
//  director_photo(string): the URL of the photo of the director
const searchDirectors = async function (req, res) {
  const input_text = req.query.input_text || ''
  const awarded = req.query.awarded || 0
  const avg_rating_min = parseFloat(req.query.avg_rating_min) || 0
  const avg_rating_max = parseFloat(req.query.avg_rating_max) || 10
  const birth_year_min = parseInt(req.query.birth_year_min) || 0
  const birth_year_max = parseInt(req.query.birth_year_max) || 1000000
  const limit = parseInt(req.query.limit || 20)
  const offset = parseInt(req.query.offset || 0)

  try {
    let query = `
      WITH DirectorRating AS (
          SELECT crew_id, AVG(M.imdb_rating) AS avg_rating
          FROM Dirct D Join Movies M on D.movie_id = M.id
          GROUP BY crew_id
      )
      SELECT A.id, A.name, A.photo_url, AR.avg_rating
      FROM Directors D 
           JOIN DirectorRating DR on D.id = DR.crew_id
           JOIN OscarAwards OA on A.id = OA.crew_id
      WHERE OA.is_winner >= ? AND DR.avg_rating >= ? AND DR.avg_rating <= ? 
            AND D.birth_year >= ? AND D.birth_year <= ?
    `

    if (input_text !== '') {
      query += ` AND D.name LIKE ?`
    }
    query += ` LIMIT ? OFFSET ?`
    const params = [awarded, avg_rating_min, avg_rating_max, birth_year_min, birth_year_max,
      `${input_text}%`, limit, offset]
    const [rows] = await pool.query(query, params)
    res.status(200).json({ actors: rows })
  } catch (err) {
    console.log(err)
    res.status(500).send('Error retrieving directors from database')
  }
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

// Route: GET /crew_award/:crew_id
// Description: Returns all the Oscar nomination and winning status of the given crew member Route Parameter(s): crew_id(string)
// Query Parameter(s): None
// Route Handler: crew_award
// Return Type: JSON Object
// Return Parameters: {year(int), category(string), movie_title(string), is_winner(bool)}
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

// Route: GET /crew_famous/:crew_id
// Description: Returns the movies that the crew is famous for Route Parameter(s): crew_id(string)
// Query Parameter(s): None
// Route Handler: crew_famous
// Return Type: JSON Object
// Return Parameters: {movie_id(string), movie_title(string), poster(string)}
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

// Route: GET /crew_act_in/:crew_id
// Description: Returns all the movies the given crew member had participate in Route Parameter(s): crew_id(string)
// Query Parameter(s): None
// Route Handler: crew_act_in
// Return Type: JSON Object
// Return Parameters: { movie_id(string), movie_title(string), character(string) }
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

// Route: GET /crew_rating/:crew_id
// Description: Returns the average of all the movies the given crew member had participate in Route Parameter(s): crew_id(string)
// Query Parameter(s): None
// Route Handler: crew_rating
// Return Type: JSON Object
// Return Parameters: { rating(float)}
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

// Route: GET /crew_duo/:crew_id
// Description: Returns the top 10 best crews who have worked with the given crew (order by average movie ratings)
// Route Parameter(s): crew_id(string)
// Query Parameter(s): None
// Route Handler: crew_duo
// Return Type: JSON Object
// Return Parameters: {duo_id(string), duo_name(string), duo_photo(string)}
const crewDuo = async function (req, res) {

  const crew_id = req.params.crew_id

  connection.query(`
    WITH CoStar AS (
        (SELECT AI.crew_id
          FROM ActIn A
          JOIN Movies M on A.movie_id = M.id
          JOIN ActIn AI on M.id = AI.movie_id
          WHERE A.crew_id='${crew_id}'
          AND A.crew_id <> AI.crew_id
        )
        UNION ALL
        (SELECT DI.crew_id
          FROM Direct D
          JOIN Movies M on D.movie_id = M.id
          JOIN Direct DI on M.id = DI.movie_id
          WHERE D.crew_id='${crew_id}'
          AND D.crew_id <> DI.crew_id
        )
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
  login,
  register,
  homesearch,
  movieOfTheDay,
  recommendations,
  wideRangeDirector,
  allMovies,
  searchMovie,
  allActors,
  searchActors,
  allDirectors,
  searchDirectors,
  crewActIn,
  crewRating,
  crewAward,
  crewFamous,
  crewFamousCoworker,
  crewDuo,
  crewInfo
}
