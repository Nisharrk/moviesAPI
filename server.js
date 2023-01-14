const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const middlewares = require("./middlewares/middlewares.js");
const MoviesDB = require("./modules/moviesDB.js");

const app = express();

require("dotenv").config();

app.use(cors());
app.use(morgan("common"));
app.use(express.json());

const db = new MoviesDB();

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.json({ message: "API Listening" });
});

// api routes
// get movies with filters
app.get("/api/movies", async (req, res, next) => {
  try {
    const { page, perPage, title } = req.query;
    const movies = await db.getAllMovies(page, perPage, title);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
});

// get movies by id
app.get("/api/movies/:id", async (req, res, next) => {
  try {
    const movie = await db.getMovieById(req.params.id);
    res.status(200).json(movie);
  } catch (error) {
    next(error);
  }
});

// add a movie
app.post("/api/movies", async (req, res, next) => {
  try {
    const movie = await db.addNewMovie(req.body);
    res.status(201).json(movie);
    // console.log(movie);
  } catch (error) {
    next(error);
  }
});

// update movie
app.put("/api/movies/:id", async (req, res, next) => {
  try {
    const updatedMovie = await db.updateMovieById(req.body, req.params.id);
    res.status(200).json({ message: "Movie updated successfully" });
  } catch (error) {
    next(error);
  }
});

// delete movie
app.delete("/api/movies/:id", async (req, res, next) => {
  try {
    const result = await db.deleteMovieById(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Error Handlers, see ./middlewares/middlewares.js
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(port, () => {
      console.log(`Listening at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
