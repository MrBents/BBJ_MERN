var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var mongoose = require("mongoose");
var config = require("./config");

var indexRouter = require("./routes/index");
var conveyorsRouter = require("./routes/conveyors");

var app = express();

mongoose.Promise = Promise;

app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/conveyors", conveyorsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(config.port, function() {
  console.log("Example app listening on port " + config.port + "!");
});

mongoose.connect(
  config.db_url,
  (err, client) => {
    if (err) console.log("MongoDB connection error", err);
    else {
      console.log("Successful mongo connection");
    }
  }
);

var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// var db = mongoose.connection;
// db.on("error", console.error.bind(console, "MongoDB connection error:"));

module.exports = app;
