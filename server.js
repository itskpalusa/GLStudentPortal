const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");
const MongoClient = require("mongoose");

const app = express();

// Set the port
const port = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(` Server running on port: ${port}!`));

// Body Parser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
