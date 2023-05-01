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
app.get("/movieoftheday", routes.movieOfTheDay)
app.get("/recommendations", routes.recommendations)
app.get("/multifaceddirector", routes.multifacedDirector)
app.get("/highlyratedmovies", routes.highlyRatedMovies)
app.get("/oscarmovies", routes.oscarMovies)
app.get("/selectedgenres", routes.selectedGenres)
app.get("/selectedawards", routes.selectedAwards)
app.get("/selectedactors", routes.selectedActors)
app.get("/selecteddirectors", routes.selectedDirectors)
app.get("/selectedcrewawards", routes.selectedCrewAwards)
app.get("/selectedcrewfamous", routes.selectedCrewFamous)
app.get("/selectedactin", routes.selectedActIn)
app.get("/selecteddirect", routes.selectedDirect)
app.get("/selectedduo", routes.selectedDuo)
app.get("/selectedco", routes.selectedCo)
app.get("/selectedcomments", routes.selectedComments)

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
})

module.exports = app
