// This is the starting point
// cd /Users/swayman/Documents/Yoga_Training_Log/Training_log_App
// node Training_log_app.js
// Express tutorial https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/skeleton_website
// http://expressjs.com/en/starter/static-files.html

// Safe backups are in Yoga_Training_Log folder

// Flow  - TODO Update for edit_categories
// Training_log.js
//   home_get.js
//   read_head etc.
//     modify_workout.js
//        add_date_html
//         new_workout_date.js
//        add_workout.js
//        edit_workout.js
//        edit_categories
//          post_edit_categories
//     post_update_db_workout.js
// End Flow

const start_time = Date.now()
const express = require('express')
const app = express()
const path = require('path')
const base_dir = path.resolve(__dirname)
module.exports = base_dir;
const home_get = require(base_dir + '/routes/home_get')
// const home_post = require('./routes/home_post')
const post_update_db_workout = require(base_dir + '/routes/post_update_db_workout')
const new_workout_date = require(base_dir + '/routes/new_workout_date')
const add_workout = require(base_dir + '/routes/add_workout')
const edit_workout = require(base_dir + '/routes/edit_workout')
const post_edit_categories = require(base_dir + '/routes/post_edit_categories')//
const edit_categories = require(base_dir + '/routes/edit_categories')
const modify_workout = require(base_dir + '/routes/modify_workout')
const et = require('./util/elapsed_time')
const global_constants = require(base_dir + '/util/global_constants')
const port = 5001

app.use(express.urlencoded({
  extended: false
}))

app.use('/', home_get)
app.use('/', modify_workout)
app.use('/', new_workout_date)
app.use('/', add_workout)
app.use('/', edit_workout)
app.use('/', post_edit_categories)
app.use('/', post_update_db_workout)

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`, et(start_time))
})
module.exports = app;