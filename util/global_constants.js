const base_dir = '/Users/swayman/Documents/Yoga_Training_Log/Training_Log_App'
const { PromisedDatabase } = require("promised-sqlite3"); // import the class
const sqlite3 = require('sqlite3').verbose();
const db = new PromisedDatabase(); // create a instance of PromisedDatabase
    // note: at this state, the wrapped sqlite3.Database object is not created.
date_format = require('date-and-time')
const INTERVAL_TIME = 500 // 500 works, 200 doesn't
module.exports.INTERVAL_TIME = INTERVAL_TIME
module.exports.base_dir = base_dir
const start_time = Date.now()
const et = require(base_dir + '/util/elapsed_time')
const DEBUG = false;
var db1 = new sqlite3.Database('./db/training_log.db', (err) => {
  if (err) {
    console.log('Could not connect to database:', err)
  } else console.log('16 Connected to database in global_constants', et(start_time))
})  //used when async isn't needed
module.exports.db = db
module.exports.db1 = db1
module.exports.DEBUG = DEBUG
module.exports.base_dir = base_dir

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