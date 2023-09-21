// This is the starting point
// cd /Users/swayman/Documents/Yoga_Training_Log/Training_log_App
// node Training_log_app.js
// Express tutorial https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/skeleton_website
// http://expressjs.com/en/starter/static-files.html

// Safe backups are in Yoga_Training_Log folder

// Flow
/*
 Training_log.js
  /routes/home_get.js - TODO Delete unused classes see debug .txt Training_log, also workout is not used 
    /util/global_constants.js
    /util/elapsed_time.js
    /util/create_category_array.js
      /db/training_log.db
    /util/format_date_array.js
    /util/format_workout_length.js
    /db/training_log.db

  /routes/modify_workout.js
    /util/create_category_array.js
      /db/training_log.db
    /util/read_head
      /static/html_inputs/head_start.html'
      /static/stylesheets/Training_log.css'
      /static/html_inputs/head_close.html'
    /routes/new_workout_date.js
    /routes/add_workout.js
      /routes/post_update_db_workout.js
        /util/add_workout_html_equals
        /util/read_head
          /static/html_inputs/head_start.html'
          /static/stylesheets/Training_log.css'
          /static/html_inputs/head_close.html'
      /util/read_head
        /static/html_inputs/head_start.html'
        /static/stylesheets/Training_log.css'
        /static/html_inputs/head_close.html'
    /routes/edit_workout.js
      /util/read_head
        /static/html_inputs/head_start.html'
        /static/stylesheets/Training_log.css'
        /static/html_inputs/head_close.html'
      /routes/post_update_db_workout.js
        /util/read_head
          /static/html_inputs/head_start.html'
          /static/stylesheets/Training_log.css'
          /static/html_inputs/head_close.html'
    /routes/edit_categories.js
      /util/create_edit_categories_html.js
        /util/read_head
          /static/html_inputs/head_start.html'
          /static/stylesheets/Training_log.css'
          /static/html_inputs/head_close.html'
      /routes/post_update_db_workout.js
        /util/read_head
          /static/html_inputs/head_start.html'
          /static/stylesheets/Training_log.css'
          /static/html_inputs/head_close.html'
      /util/read_head
        /static/html_inputs/head_start.html'
        /static/stylesheets/Training_log.css'
        /static/html_inputs/head_close.html'
      /routes/post_edit_categories.js
      /util/create_changesDICT.js
      /util/create_checked_categoryDICT.js
  /routes/show_all_workouts.js
    /util/write_workouts.js
*/
// End Flow

const start_time = Date.now()
const express = require('express')
const app = express()
const path = require('path')
const base_dir = path.resolve(__dirname)
module.exports = base_dir;
const home_get = require(base_dir + '/routes/home_get')
const post_update_db_workout = require(base_dir + '/routes/post_update_db_workout')
const new_workout_date = require(base_dir + '/routes/new_workout_date')
const add_workout = require(base_dir + '/routes/add_workout')
const edit_workout = require(base_dir + '/routes/edit_workout')
const post_edit_categories = require(base_dir + '/routes/post_edit_categories')//
const modify_workout = require(base_dir + '/routes/modify_workout')
const show_all_workouts = require(base_dir + '/routes/show_all_workouts') 
const et = require('./util/elapsed_time')
// const global_constants = require(base_dir + '/util/global_constants')
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
app.use('/', show_all_workouts)

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`, et(start_time))
})
module.exports = app;