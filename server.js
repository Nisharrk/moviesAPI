const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const middlewares = require("./middlewares/middlewares.js");
const MoviesDB = require("./modules/moviesDB.js");
const routes = require("./api/routes.js");

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
app.get("/api/movies", routes);

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
