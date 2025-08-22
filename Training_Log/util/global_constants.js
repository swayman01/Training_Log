// This file is a holding place for constants used across files
const path = require('path')
var base_dir = path.dirname(path.resolve(__dirname))
var DEBUG = false;
const sqlite3 = require('sqlite3').verbose();
const db = require ('better-sqlite3')('./db/training_log.db'); 
date_format = require('date-and-time') // Do not make a constant 7/9/22
const length_hhmmssREG = new RegExp(/\d{1,2}:\d{1,2}:\d{1,2}/)
const length_mmssREG = new RegExp(/\d{1,2}:\d{1,2}/)
module.exports.base_dir = base_dir
const start_time = Date.now()
const et = require(base_dir + '/util/elapsed_time')
// var db1 = new sqlite3.Database('./db/training_log.db', (err) => { //commented out 8/2025
//   if (err) {
//     console.log('Error in global_constants - Could not connect to database:', err)
//   } else console.log('Connected to sqlite3 database in global_constants', et(start_time))
// })  //used when async isn't needed
module.exports.db = db
// module.exports.db1 = db1
module.exports.DEBUG = DEBUG
module.exports.base_dir = base_dir
var add_workout_error_message = ''
module.exports.add_workout_error_message = add_workout_error_message
module.exports.length_hhmmssREG = length_hhmmssREG
module.exports.length_mmssREG = length_mmssREG

const {
  readFile,
} = require('fs')
const getFile = (fileName) => {
  // This function is used to open multiple files asynchronous mode for using them
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