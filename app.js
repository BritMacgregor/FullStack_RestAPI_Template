'use strict';

const express = require("express");
const app = express();
const routes = require("./routes");

const jsonParser = require("body-parser").json;
const logger = require("morgan");

app.use(logger("dev"));
app.use(jsonParser());

//mongoose stuff
const mongoose = require("mongoose");
//qa is the name of our route (stands for question and answer)
mongoose.connect("mongodb://localhost:27017/qa");

const db = mongoose.connection;

db.on("error", function(err){
	console.error("connection error:", err);
});

//once method is a callback that holds of all the database interaction code to ensure the code would only run after the database conncetion was open.
//in this express app... we don't ned to worry about the db. All we want to do is log out once the open event occurs.
//Now that the database is set up, let's set up the schemas in a seperate file called models.js
db.once("open", function(){
	console.log("db connection successful");
	//all database stuff goes here
});

app.use("/questions", routes);

// catch 404 and forward to error handler
app.use(function(req, res, next){
	const err = new Error("Not Found");
	err.status = 404;
	next(err);
});

// Error Handler

app.use(function(err, req, res, next){
	res.status(err.status || 500);
	res.json({
		error: {
			message: err.message
		}
	});
});

const port = process.env.PORT || 3000;

app.listen(port, function(){
	console.log("Express server is listening on port", port);
});
