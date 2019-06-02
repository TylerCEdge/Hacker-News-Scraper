// Dependencies
var express = require("express");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan")

// Port configuration

var PORT = process.env.PORT || 3000;

// Instantiate Express App

var app = express();

app.use(logger("dev"));

// Express Router Config

var router = express.Router();

// Routes require

require("./config/routes")(router);

// Public folder set as static directory

app.use(express.static(__dirname + "/public"));

// Handlebars connection to Express

app.engine("handlebars", expressHandlebars({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Set up BodyParser

app.use(bodyParser.urlencoded({
  extended: false
}));

// Have every request go through our router middleware

app.use(router);

// If deployed, use the deployed database.  Otherwise use the local mongoHeadlines database
var db = (process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines");

mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true }, function (err) {
  if (err) {
    console.log(err);
  }
  else {
    console.log("Mongoose connection is successful!");
  }
});

//Listen on PORT

app.listen(PORT, function () {
  console.log("Listening on http://localhost:" + PORT)
});