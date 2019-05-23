const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");
const MongoClient = require("mongoose");

// Routes
const users = require("./routes/api/userRoute");

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

// DB Config
let db = require("./config/keys").MongoURI;

// Connect to MongoDB
MongoClient.connect(
  "mongodb://username:password1@ds261296.mlab.com:61296/glcoca",
  {
    useNewUrlParser: true
  },
  function(err, database) {
    if (err) {
      console.error(err);
    }
    db = database; // once connected, assign the connection to the global variable
  }
)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Passport Middleware
app.use(passport.initialize());

// Use Routes
app.use("/api/users", users);

// Passport Middleware
app.use(passport.initialize());
