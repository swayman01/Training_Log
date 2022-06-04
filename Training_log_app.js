// cd /Users/swayman/Documents/Yoga_Training_Log/Training_log_App
// node Training_log_app.js
// Express tutorial https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/skeleton_website
// http://expressjs.com/en/starter/static-files.html

// TODO: fix date sort for 2 digit months, 2 digit year
// TODO: when there are more than 5 dates, display the first 3 and plus x more
// TODO: Check for duplicate workout names when adding a workout and category
// Safe backups are in Yoga_Training_Log folder
// Flow
// Training_log.js
//   home_get.js
//     modify_workout.js
//        add_date.html
//        add_workout,rs
//        edit_workout, or
//        edit_categories
//     post_update_workout.js
//     new_workout_date
//        update_db_date
//     TODO: check read_head, home_post Continue from here
//       post_edit_categories,post_edit_workouts?

const express = require('express')
const app = express()
const path = require('path')
const home_get = require('./routes/home_get')
// const home_post = require('./routes/home_post') // commented out 6/3/22
const post_update_db_workout = require('./routes/post_update_db_workout')
const new_workout_date = require('./routes/new_workout_date')
const add_workout = require('./routes/add_workout')
const edit_workout = require('./routes/edit_workout')
const edit_categories = require('./routes/edit_categories')
const modify_workout = require('./routes/modify_workout')
const global_constants = require('./util/global_constants')
const port = 5001
// TODO update base_dir to avoid hardcoded path See Multiple_Submit_Buttons.js
const base_dir = path.resolve(__dirname)

app.use(express.urlencoded({
  extended: false
}))
app.use(express.json());
//TODO See which of these are needed
app.use('/', home_get)
// app.use('/', home_post) // commented 6/3/22
app.use('/', modify_workout)
app.use('/', new_workout_date)
app.use('/', add_workout)
app.use('/', edit_workout)
app.use('/', edit_categories)
app.use('/', post_update_db_workout)

app.listen(port, () => {
  console.log(`Server is listening on port ${port} ....`)
})
module.exports = app;