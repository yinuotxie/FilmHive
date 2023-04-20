const express = require('express')
const cors = require('cors')
const config = require('./config')
const routes = require('./routes')

const app = express()
app.use(cors({
  origin: '*',
}))

app.get("/login", routes.login)
app.get("/register", routes.register)
app.get("/allmovies", routes.allMovies)
app.get("/allactors", routes.allActors)
app.get("/alldirectors", routes.allDirectors)
app.get("/homesearch", routes.homeSearch)
app.get("/crew_info/:crew_id", routes.crewInfo)
app.get("/crew_award/:crew_id", routes.crewAward)
app.get("/crew_famous/:crew_id", routes.crewFamous)
app.get("/crew_act_in/:crew_id", routes.crewActIn)
app.get("/crew_rating/:crew_id", routes.crewRating)
app.get("/crew_duo/:crew_id", routes.crewDuo)
app.get("/crew_famous_coworker/:crew_id", routes.crewFamousCoworker)



app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
})

module.exports = app
