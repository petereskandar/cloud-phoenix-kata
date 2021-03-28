const createError = require('http-errors')
const express = require('express')
const hbs = require("hbs");
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const dblogger = require('mongo-morgan')
const mongoose = require("mongoose");


const indexRouter = require('./routes/index')

const app = express()

// view engine setup
hbs.registerPartials(__dirname + "/views/partials");
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

// mongodb://user:pwd@local.phoenix-mongo-db-service:27017/demoDB
// process.env.DB_CONNECTION_STRING
app.use(dblogger('process.env.DB_CONNECTION_STRING', 'combined', {
  collection: 'logs'
}))

//mongodb://root:root@192.168.237.17:27017/demoDB
mongoose.connect('process.env.DB_CONNECTION_STRING', { useUnifiedTopology: true, useNewUrlParser: true });
const mongoConn = mongoose.connection;

mongoConn.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

app.use(logger('combined'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})


module.exports = app
