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

// Route: GET /movie/search
// Description: Search for movies based on filters
const movieSearch = async function (req, res) {
  const genre = req.query.genre ?? '';
  const award = req.query.award ?? '';
  const country = req.query.country ?? '';
  const runtime = req.query.runtime ?? '';
  const rating = req.query.rating ?? '';
  const releaseYear = req.query.releaseYear ?? '';

  let query = `
    SELECT M.id, M.title, M.plot, M.poster
    FROM (
      SELECT id, title, plot, poster, release_year, country, runtimeMinutes, imdb_rating
      FROM Movies
      WHERE 1 = 1
  `;
  
  if (releaseYear !== '') {
    query += ` AND release_year >= ${releaseYear}`;
  }
  
  if (country !== '') {
    query += ` AND country = '${country}'`;
  }
  
  if (runtime !== '') {
    query += ` AND runtimeMinutes >= ${runtime}`;
  }
  
  if (rating !== '') {
    query += ` AND imdb_rating >= ${rating}`;
  }
  
  query += `
      ) M
      JOIN (
        SELECT movie_id
        FROM MovieGenres
        WHERE genre_id = (SELECT id FROM Genres WHERE name = '${genre}')
      ) MG ON M.id = MG.movie_id
      JOIN (
        SELECT movie_id
        FROM OscarAwards
        WHERE category = '${award}' AND is_winner = 1
      ) OA ON M.id = OA.movie_id
    ORDER BY M.imdb_rating, M.title DESC;
  `;
  
  try {
    const result = await db.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

// Route: GET /actor/search
// Description: Search for actors based on filters
// TODO: change award to boolean. Use ActIn table to get actors 
const actorSearch = async function (req, res) {
  const rating = req.query.rating ?? 0.0;
  const birthYear = req.query.birthYear ?? '';

  let query = `
    WITH Actors AS (
      SELECT id, name, photo_url
      FROM Crews
      WHERE profession LIKE '%actor%' OR profession LIKE '%actress%'
    ),
    ActorAwards AS (
      SELECT crew_id
      FROM OscarAwards
      WHERE is_winner = 1 AND category IN ('ACTOR', 'ACTRESS')
    ),
    ActorRatings AS (
      SELECT crew_id, AVG(M.imdb_rating) AS avg_rating
      FROM ActIn
      JOIN Movies M ON ActIn.movie_id = M.id
      JOIN Actors A ON A.id = ActIn.crew_id
      WHERE 1=1
  `;
  
  if (birthYear !== '') {
    query += ` AND A.birth_year > ${birthYear}`;
  }
  
  query += `
      GROUP BY crew_id
      HAVING AVG(M.imdb_rating) > ${rating}
    )
    SELECT A.id, A.name, A.photo_url, AR.avg_rating
    FROM Actors A
         JOIN ActorAwards AA ON A.id = AA.crew_id
         JOIN ActorRatings AR ON A.id = AR.crew_id
    ORDER BY AR.avg_rating, A.name DESC;
  `;
  
  try {
    const result = await db.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

// Route: GET /movie/recommendation
// Description: Recommend movies based on user's preferences
// TODO: return the top 5 movies based on user's preferences randomly 
const movieRecommend = async function (req, res) {
}

module.exports = {
  register,
  login,
  movieSearch,
  actorSearch,
  movieRecommend
}
