// Connect to database
const sqlite3 = require('sqlite3').verbose();
date_format = require('date-and-time')
var db = new sqlite3.Database('./db/training_log.db', (err) => {
  if (err) {
    console.log('Could not connect to database:', err)
  } else console.log('5 Connected to database in global_constants', Date.now())
})
const INTERVAL_TIME = 500 // 500 works, 200 doesn't
module.exports.INTERVAL_TIME = INTERVAL_TIME
const DEBUG = true;
module.exports.db = db
module.exports.DEBUG = DEBUG
