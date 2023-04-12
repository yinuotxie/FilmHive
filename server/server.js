const express = require('express')
const cors = require('cors')
const config = require('./config')
const routes = require('./routes')

const app = express()
app.use(cors({
  origin: '*',
}))

app.get('/api/login', routes.login)
app.get("/api/register", routes.register)

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
})

module.exports = app
