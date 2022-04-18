// Connect to database
const sqlite3 = require('sqlite3').verbose();
date_format = require('date-and-time')
var db = new sqlite3.Database('./db/training_log.db', (err) => {
  if (err) {
    console.log('Could not connect to database:', err)
  } else console.log('7 Connected to database in global_constants', Date.now())
})
const INTERVAL_TIME = 500 // 500 works, 200 doesn't
module.exports.INTERVAL_TIME = INTERVAL_TIME
const DEBUG = true;
module.exports.db = db
module.exports.DEBUG = DEBUG

const {
  readFile,
} = require('fs')
const getFile = (fileName) => {
  // This function is used to open multiple files asynchronous mode for using them
  // See Training_Log_Promise_Practice for more details
  return new Promise((resolve, reject) => {
    readFile(fileName, 'utf8', (err, data) => {
      if (err) {
        reject(err) // calling `reject` will cause the promise to fail with or without the error passed as an argument
        return // and we don't want to go any further
      }
      resolve(data)
    })
  })
}
module.exports.getFile = getFile