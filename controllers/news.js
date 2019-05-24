var axios = require("axios");
var cheerio = require("cheerio");
var express = require("express")
var router = express.Router();
var db = require("../models")


// Default route renders the index handlebars view
router.get('/', function (req, res) {
    res.render('index');
});

router.get('/test', function (req, res) {
    ScrapeArticles();
    res.render('test');
});




// A function for scraping the echoJS website
function ScrapeArticles() {
    // First, we grab the body of the html with axios
    axios.get("https://thehackernews.com/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
        // console.log(response.data)

        // Now, we grab every h2 within an article tag, and do the following:
        $("h2").each(function () {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .text()
                // Removes unwanted characters from the titles
                .replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, ' ');
            result.link = $(this)
                .parent().parent().parent().parent()
                .find("a")
                .attr("href");
            result.img = $(this)
                .parent().parent().parent()
                .find("img")
                .attr("src");

            // Prevents Article replication by checking if it exists already
            db.Article.findOne({ 'title': result.title }, function (err, res) {
                if (err) {
                    console.log(err);
                }
                else {
                    if (res == null) {
                        // Create a new Article using the `result` object built from scraping
                        db.Article.create(result)
                            .then(function (dbArticle) {
                                // View the added result in the console
                                console.log(dbArticle);
                            })
                            .catch(function (err) {
                                // If an error occurred, log it
                                console.log(err);
                            });
                    }
                }
            });
        });
    });
};

// Route for getting all Articles from the db
router.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
    // TODO: Finish the route so it grabs all of the articles
  });
  
  // Route for grabbing a specific Article by id, populate it with it's note
  router.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
    // TODO
    // ====
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "note",
    // then responds with the article with the note included
  });
  
  // Route for saving/updating an Article's associated Note
  router.post("/articles/:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
    // TODO
    // ====
    // save the new note that gets posted to the Notes collection
    // then find an article from the req.params.id
    // and update it's "note" property with the _id of the new note
  });

module.exports = router;