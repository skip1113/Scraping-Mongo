# Scraping-Mongo
## Link to deployed Github: https://skip1113.github.io/Scraping-Mongo/.
## Link to deployed Heroku: https://scraping-mongo.herokuapp.com/

## Overview
This is a web-scrapping app. The application will let the user scrape news articles from Time Magazine's website. When the user clicks Scrape Article button, the trending articles from Time will be displayed in a table with a title, summary, link. You are able to save, unsave, and even attach and delete a note to the article that you click on.

## Instructions
Click the link to deployed Heroku and Click Scrape Article.

## To Run Locally
* Clone this repository from Github
* cd to the file
* terminal
    * npm install
    * mongod
    * node server.js
* Open your browser and search localhost:/3000
* Click that Scrap button

![](/public/home-img.png)

## Organization 
* Server.js file
    * Require tools
    * Set PORT
    * Connect with Database
* Routes to Scrape, GET, PUT
    * Find
    * Update  
    * $set
* Functions for buttons to GET articles and append to the page.

## Technology used:
* Javascript
* Jquery
* HTML
* CSS
* MongoDB
* Node Packages:
    * Axios
    * Cheerio
    * Express
    * Mongoose
    * Morgan
    * Bulma - Layout