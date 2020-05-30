var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
//Tools for scrapping
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models as db
var db = require("./models");
var port = 3000;

//Initialize Express as app
var app = express();

//Configure Middleware
//Use Morgan logger for loggin requests
app.use(logger("dev"));
//Parse request body as JSON
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static("public"));

//Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true});

//Routes
//GET route for scraping website
app.get("/scrap", function (req, res) {
    axios.get("").then(function (response) {
        var $ = cheerio.load(response.data);

    })
})

//Route for getting all Articles from the db
app.get("/articles", function(req, res) {
    db.Article.find({}).then(function (dbResponse) {
        res.send(dbResponse);
    })
    .catch(function (err) {
        res.json(err);
    })
});

//Route to grab specific ARticle by id, with populated note
app.get("/articles/:id", function (req, res) {
    db.Article.find(
        {
            _id: req.params.id
        })
        .populate("note")
        .then(function (dbArticle) {
            res.send(dbArticle)
        })
        .catch(function (error) {
            console.log(error);
            res.json(error);
        })
});

//Route for saving/Updating an Article's associated note
app.post("/articles/:id", function (req, res) {
    db.Note.create(req.body)
    .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params. id }, { Note: dbNote._id }, { new: true});
    })
    .then(function(dbArticle) {
        res.json(dbArticle)
    })
    .catch(function(error) {
        console.log(error);
        res.json(error);
    })
});

//Start the Server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});