const { Router } = require("express");
const MoviesDB = require("../modules/moviesDB.js");

const router = Router();
const db = new MoviesDB();

router.get("/api/movies", async (req, res, next) => {
  try {
    const movies = await db.getAllMovies();
    res.json(movies);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
