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
const search = async function (req, res) {
  const genre = req.query.genre ?? '';
  const year = req.query.year ?? 0;
  const award = req.query.award ?? '';
  const country = req.query.country ?? '';
  const runtime = req.query.runtime ?? 0;
  const rating = req.query.rating ?? 0;
  const realeaseYear = req.query.realeaseYear ?? '';

  let query = `
    SELECT *
    FROM Movies
    WHERE 1 = 1
  `;
}

module.exports = {
  register,
  login,
}
