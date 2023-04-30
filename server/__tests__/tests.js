const { expect } = require('@jest/globals');
const supertest = require('supertest');
const app = require('../server');
const results = require("./results.json")

describe('GET /login', () => {
    test('It should respond with 401 if invalid email or password is provided', async () => {
        const response = await supertest(app)
            .get('/login')
            .query({
                email: 'jane@example.com',
                password: 'password'
            })
        expect(response.statusCode).toBe(401)
        expect(response.body).toEqual({ message: 'Invalid email or password' })
    })

    test('It should respond with 200 and user data if valid email and password are provided', async () => {
        const response = await supertest(app)
            .get('/login')
            .query({
                email: 'jane@example.com',
                password: 'password456'
            })
        expect(response.body).toStrictEqual(results.login);
    })
})


describe('GET /register', () => {
    test('It should respond with 400 if email already registered', async () => {
        const response = await supertest(app)
            .get('/register')
            .query({
                email: 'jane@example.com',
                username: 'jane',
                password: 'password456',
                favoriteGenres: 'Action, Adventure, Comedy'
            })
        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual({ message: 'Email already registered' })
    })
})

describe('GET /allMovies', () => {
    jest.setTimeout(30000);
    test('It should respond with 200 and movie data', async () => {
        const response = await supertest(app)
            .get('/allMovies')
            .query({
                genre: 'Action',
                region: 'United States',
                runtimeMin: 100,
                runtimeMax: 200,
                ratingMin: 7,
                ratingMax: 10,
                releaseYearMin: 2000,
                releaseYearMax: 2020,
                awarded: 'true'
            })
        expect(response.statusCode).toBe(200)
        expect(response.body.movies).toStrictEqual(results.homeSearch)
    })
})

// test all actors
describe('GET /allActors', () => {
    test('It should respond with 200 and actor data', async () => {
        const response = await supertest(app)
            .get('/allActors')
        expect(response.statusCode).toBe(200)
        expect(response.body.total).toBeGreaterThan(0)
    })
})

describe('GET /allDirectors', () => {
    test('It should respond with 200 and director data', async () => {
        const response = await supertest(app)
            .get('/allDirectors')
        expect(response.statusCode).toBe(200)
        expect(response.body.total).toBeGreaterThan(0)
    })
})

describe('GET /homeSearch', () => {
    test('It should respond with 200 and movie data', async () => {
        const response = await supertest(app)
            .get('/homeSearch')
            .query({
                searchValue: 'Tom'
            })
        expect(response.statusCode).toBe(200)
        expect(response.body.moviesTotal).toBe(582)
        expect(response.body.moviesActInTotal).toBe(1539)
        expect(response.body.moviesCharactersTotal).toBe(1714)
        expect(response.body.actorsTotal).toBe(493)
        expect(response.body.directorsTotal).toBe(152)
    })
})

describe('GET /multifacedDirector', () => {
    test('It should respond with 200 and director data', async () => {
        const reponse = await supertest(app)
            .get('/multifacedDirector')
        expect(reponse.statusCode).toBe(200)
        expect(reponse.body.directors).toStrictEqual(results.multifacedDirector)
    })
})

describe('GET /movieOfTheDay', () => {
    test('It should respond with 200 and movie data', async () => {
        const response = await supertest(app)
            .get('/movieOfTheDay')
        expect(response.statusCode).toBe(200)
    })
})

describe('GET /recommendations', () => {
    test('It should respond with 200 and recommended movie data', async () => {
        const response = await supertest(app)
            .get('/recommendations')
            .query({
                email: 'yinhaoz@seas.upenn.edu'
            })
        expect(response.statusCode).toBe(200)
        expect(response.body.movies).toStrictEqual(results.recommendations)
    })
})

describe('GET /selectedGenres', () => {
    test('It should respond with 200 and selected genres data for the movie', async () => {
        const response = await supertest(app)
            .get('/selectedGenres')
            .query({
                movie_id: 'tt0096895'
            })
        expect(response.statusCode).toBe(200)
        expect(response.body.genres).toStrictEqual(results.selectedGenres)
    })
})

describe('GET /selectedAwards', () => {
    test('It should respond with 200 and selected awards data for the movie', async () => {
        const response = await supertest(app)
            .get('/selectedAwards')
            .query({
                movie_id: 'tt0096895'
            })
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual(results.selectedAwards)
    })
})

describe('GET /selectedActors', () => {
    test('It should respond with 200 and selected actors data for the movie', async () => {
        const response = await supertest(app)
            .get('/selectedActors')
            .query({
                movie_id: 'tt0096895'
            })
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual(results.selectedActors)
    })
})

describe('GET /selectedDirectors', () => {
    test('It should respond with 200 and selected directors data for the movie', async () => {
        const response = await supertest(app)
            .get('/selectedDirectors')
            .query({
                movie_id: 'tt0096895'
            })
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual(results.selectedDirectors)
    })
})

describe('GET /selectedActorAvgRating', () => {
    test('It should respond with 200 and selected actor average rating data for the actor', async () => {
        const response = await supertest(app)
            .get('/selectedActorAvgRating')
            .query({
                actor_id: 'nm0000199'
            })
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual(results.selectedActorAvgRating)
    })
})

describe('GET /selectedCrewAwards', () => {
    test('It should respond with 200 and selected crew awards data for the crew', async () => {
        const response = await supertest(app)
            .get('/selectedCrewAwards')
            .query({
                crew_id: 'nm0000199'
            })
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual(results.selectedCrewAwards)
    })
})

describe('GET /selectedCrewFamous', () => {
    test('It should respond with 200 and selected crew famous data for the crew', async () => {
        const response = await supertest(app)
            .get('/selectedCrewFamous')
            .query({
                crew_id: 'nm0000199'
            })
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual(results.selectedCrewFamous)
    })
})

describe('GET /selectedActIn', () => {
    test('It should respond with 200 and selected act in data for the actor', async () => {
        const response = await supertest(app)
            .get('/selectedActIn')
            .query({
                crew_id: 'nm0000199'
            })
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual(results.selectedActIn)
    })
})

describe('GET /selectedDuo', () => {
    test('It should respond with 200 and selected duo data for the crews', async () => {
        const response = await supertest(app)
            .get('/selectedDuo')
            .query({
                crew_id: 'nm0000199'
            })
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual(results.selectedDuo)
    })
})


describe('GET /selectedCo', () => {
    test('It should respond with 200 and selected co data for the crews', async () => {
        const response = await supertest(app)
            .get('/selectedCo')
            .query({
                crew_id: 'nm0000199'
            })
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual(results.selectedCo)
    })
})