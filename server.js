var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
//Tools for scrapping
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models as db
var db = require("./models");
var PORT = 3000;

//Initialize Express as app
var app = express();

//Configure Middleware
//Use Morgan logger for loggin requests
app.use(logger("dev"));
//Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//Connect to the Mongo DB
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/Headline";
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/Headline", { useNewUrlParser: true });
// mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
// mongoose.connect("mongodb://localhost/Headline", { useNewUrlParser: true });
console.log("Mongoose connection");
//Routes
//Shows all unsaved articles on homepage
app.get("/", function (req, res) {
  db.Headline.find({ "saved": false }).then(function (dbHeadline) {
    // from the database as the value in an object
    res.json(db.Headline);
  }).catch(function (err) { 
    res.json(err) });
});
//Scrape website
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://time.com/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("section.homepage-module").each(function (i, element) {
      var result = {};

      result.title = $(this)
        .find("h2.title")
        .text();

      result.text = $(this)
        .find("p.summary")
        // .children("p")
        .text();

      result.link = $(this)

        .find("a")
        // .find("strong")
        .attr("href");
      // console.log("Line 52");
      db.Headline.create(result)
        .then(function (dbHeadline) {
          // View the added result in the console
          console.log("Created Results");
          console.log(dbHeadline);
        })
        .catch(function (err) {
          // If an error occurred, log it
          console.log(err);
        });
    });
    // console.log(result);
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/headlines", function (req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Headline.find({ saved: false }).then(function (dbHeadline) {
    // console.log(dbHeadline);
    res.json(dbHeadline);
  })
    .catch(function (err) {
      res.json(err);
    })
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/headlines/:id", function (req, res) {
  // TODO
  db.Headline.findOne(
    {
      _id: req.params.id
      //_id: mongojs.ObjectId(req.params.id)
    })
    .populate("note")
    .then(function (dbHeadline) {
      res.json(dbHeadline)
    })
    .catch(function (error) {
      console.log(error);
      res.json(error);
    })
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
});
// route for updating unset/clear note
app.put("/notes/:id", function (req, res) {
  // TODO
  db.Headline.findOneAndUpdate({_id: req.params.id}, { $unset: { note: 1}}, function (err, results) {
    res.json(results);
  });

  

});

// Route for saving/updating an Article's associated Note
app.post("/headlines/:id", function (req, res) {
  // TODO
  db.Note.create(req.body)
    .then(function (dbNote) {
      return db.Headline.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function (dbHeadline) {
      res.json(dbHeadline)
    })
    .catch(function (error) {
      res.json(error);
    });

});
// Finds articles that are saved
app.get("/saved", function (req, res) {
  db.Headline.find({ saved: true })
    .populate("notes")
    .then(function (dbHeadline) {
      
      res.json(dbHeadline);
    }).catch(function (err) { 
      res.json(err) });
});
// Posts saved articles 
app.put("/saved/:id", function (req, res) {
  db.Headline.findOneAndUpdate({ _id: req.params.id }, { $set: { saved: true } })
    .then(function (dbHeadline) {
      res.json(dbHeadline);
    }).catch(function (err) { 
      res.json(err) });
})

// Deletes specific articles from "Saved Articles" and puts them back on the homepage
app.put("/unsaved/:id", function (req, res) {
  db.Headline.findOneAndUpdate({ _id: req.params.id }, { $set: { saved: false } })
    .then(function (dbHeadline) {
      res.json(dbHeadline);
    }).catch(function (err) { 
      res.json(err) });
});
// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
