const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
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

db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(port, () => {
      console.log(`Listening at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
