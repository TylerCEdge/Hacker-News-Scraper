// NPM modules

var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

// =============================================================================================================

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
require("axios");
require("cheerio");

// =============================================================================================================

// Require all models
require("./models");

// =============================================================================================================

var PORT = process.env.PORT || 8080;

// =============================================================================================================

// Initialize Express
var app = express();

// =============================================================================================================

// Configure middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// =============================================================================================================

// Use morgan logger for logging requests
app.use(logger("dev"));

// =============================================================================================================

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// =============================================================================================================

// Make public a static folder
app.use(express.static("public"));

// =============================================================================================================

//Routes
var routes = require('./controllers/news.js');
app.use('/',routes);

// =============================================================================================================

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/scrape", { useNewUrlParser: true });

// =============================================================================================================

// Start the server
app.listen(PORT, function () {
  console.log("App running on http://localhost:" + PORT);
});