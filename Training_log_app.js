// cd /Users/swayman/Documents/Yoga_Training_Log
// nodemon Training_log_app.js
//  Read .css file here and add to variable
// Express tutorial https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/skeleton_website
// http://expressjs.com/en/starter/static-files.html
// TODO: Organize routes - https://stackoverflow.com/questions/59681974/how-to-organize-routes-in-nodejs-express-app
//  and https://vegibit.com/node-js-routes-tutorial/
// TODO: look up guide in https://stackoverflow.com/questions/59898760/assigning-a-promise-result-to-a-variable-in-nodejs
// See Simple_Form_nodeJS.js for ways to read in css files
// TODO: fix date sort for 2 digit months
// TODO: Open/Close on Categories
// TODO: tooltips on + button
// TODO: Check for duplicate workout names when adding a workout
// TODO: Don't fill in fields, except for category in Add Workout
// TODO: reorganize categories to separate morning for others - index by 10
// const sqlite3 = require('sqlite3').verbose();
// Safebackups are in Yoga_Training_Log folder
// Flow
// Training_log.js
//   home_get.js
//     modify_workout.js
//        add_workout or
//        edit_workout
//     post_update_workout.js
//     new_workout_date
//     TODO: Add retrieve workouts, home_get, home_post Continue from here

const express = require('express')
const app = express()
const path = require('path')
const home_get = require('./routes/home_get')
const home_post = require('./routes/home_post')
// const retrieve_workouts = require('./util/retrieve_workouts')
const post_update_db_workout = require('./routes/post_update_db_workout')
const new_workout_date = require('./routes/new_workout_date')
const add_workout = require('./routes/add_workout')
const edit_workout = require('./routes/edit_workout')
const modify_workout = require('./routes/modify_workout')

global_constants = require('./util/global_constants')
db = global_constants.db
app.use(express.urlencoded({
  extended: false
}))
app.use(express.json());

// TODO update base_dir to avoid hardcoded path See Multiple_Submit_Buttons.js
const base_dir = path.resolve(__dirname)
const {
  readFile,
  readFileSync,
  writeFile,
  writeFileSync,
  appendFileSync
} = require('fs')
const port = 5001
// Use setTimeout since db does not seem to work with Promises
const INTERVAL_TIME = global_constants.INTERVAL_TIME
// TODO: See if we need all of the app.use here, or if the other routines are okay
app.use('/', home_get)
app.use('/', home_post)
app.use('/', modify_workout)
app.use('/', new_workout_date)
app.use('/', add_workout)
app.use('/', edit_workout)
app.use('/', post_update_db_workout)

app.listen(port, () => {
  console.log(`199: server is listening on port ${port} ....`)
})
module.exports = app;