const express = require('express')
const router = express.Router()
const mongoose = require("mongoose");
const fs = require('fs')
const ssl = require('../generateCert/generateCert')


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Cloud Phoenix Kata v2.1', hostname: req.hostname})
})

// crash api 
router.get('/crash', function (req, res, next) {
  console.log(new Error('Requested crash by endpoint /crash'))
  setTimeout(function () {
    process.on("exit", function () {
        require("child_process").spawn(process.argv.shift(), process.argv, {
            cwd: process.cwd(),
            detached : true,
            stdio: "inherit"
        });
    });
    process.exit(1);
  }, 0);
})

// generate cert
router.get('/generatecert', function (req, res, next) {
  // generate key and save it locally
  ssl.generateCert();
  const key  = fs.readFileSync(ssl.SSL_PATH + 'generated-key.pem')
  const cert = fs.readFileSync(ssl.SSL_PATH + 'generated-cert.pem')
  setTimeout(() => res.send({
    keys: key,
    cert: cert
  }), 0)
})

// cert renderer template --> for test purposes
router.get('/certRender', (req, res, next) => {
  ssl.generateCert();
  const key  = fs.readFileSync(ssl.SSL_PATH + 'generated-key.pem')
  const cert = fs.readFileSync(ssl.SSL_PATH + 'generated-cert.pem')
    res.render('certificate', {
      keys: key,
      cert: cert
    })
})

// check DB connection status
router.get('/checkdbConn', (req, res, next) => {
  res.send({
    connectionStatus: mongoose.STATES[mongoose.connection.readyState],
    connectionString: process.env.DB_CONNECTION_STRING ? process.env.DB_CONNECTION_STRING : 'localhost'
  })
})

// find all logs in Logs Collection
router.get('/querylogs', (req, res, next) => {
  mongoose.connection.db.collection('logs', (err, collection) => {
    collection.find({}).toArray((err, data) => {
       res.send({logs: data});
    })
  })
})


module.exports = router
