// This module is executed from the modify_workout screen
// It creates the edit_categories screen
const express = require('express');
const router = express.Router();
const exported_variables = require('./../util/read_head');
const global_constants = require('./../util/global_constants')
const base_dir = global_constants.base_dir
const start_time = Date.now()
const et = require(base_dir + '/util/elapsed_time')
const modify_workout_variables = require('./../routes/modify_workout') 
const DEBUG = global_constants.DEBUG
const INTERVAL_TIME = global_constants.INTERVAL_TIME
const db = global_constants.db // used for promises
const sqlite3 = require('sqlite3').verbose();
db1 = new sqlite3.Database(base_dir + '/db/training_log.db', (err) => {
    if (err) {
      console.log('Could not connect to database:', err)
    } else if (DEBUG) console.log('134 Connected to database in modify_workout', et(start_time))
  })
if (DEBUG) console.log('loaded edit_categories.js', et(start_time))
router.post('/', (req, res, next) => {
  res.redirect("/")
})

router.post('/edit_categories', (req, res) => {
  // TODO Add checks for undefined and duplicates
  var toRepeat = 'N'
  if ((selected_workout.toRepeat == 1) || (selected_workout.toRepeat == 'Y')) toRepeat = 'Y'
  var category_name = modify_workout_variables.category_name
  var workout_actionGLOBAL = 'Edit Categories'
  module.exports.workout_actionGLOBAL = workout_actionGLOBAL
  modify_workout_variables.workout_actionGLOBAL =  workout_actionGLOBAL
  // get list of categories
  let retrieve_categories = `
      SELECT category_position, isClosed, category_name
      FROM categories 
      ORDER BY category_position
      `
  var category_array = []
  try {
    db1.all(retrieve_categories, [], (err, rows) => {
      category_array = rows
      module.exports.category_arrayGLOBAL = category_array
      module.exports.category_array = category_array
      if (err) {
        console.log('**47 error retrieving categories in edit_categories', et(start_time), err)
      }
    })
  } catch (e) {
    console.log('42 Did not retrieve categories in edit_categories:)', e)
  }

  // Find existing categories assigned to current workout
  let assigned_categories = `
      SELECT categories_to_workouts.category_name
      FROM categories_to_workouts
      INNER JOIN workouts 
      on categories_to_workouts.workout_name = workouts.workout_name
      WHERE workouts.id = ${selected_workout.id}
      `
  var checked_category_array = []
  try {
    db1.all(assigned_categories, [], (err, rows) => {
      checked_category_array = rows
      if (err) {
        console.log('***67 error finding assigned categories in edit_categories', et(start_time), err)
      }
    })
  } catch (e) {
    console.log('62 Did not retrieve categories in edit_categories:)', e)
  }
  // Start html file
  var edit_categories_html = exported_variables.training_log_head_html + `
    <h2>${workout_actionGLOBAL} for Workout ${selected_workout.workout_name}</h2>
    <form action="/update_db_workout" method="POST">
    `
  // TODO try label {horizontal-align: right; in css}
add_new_category_label = 'Add New Category'
var end_edit_categories_html = `
  <input type="checkbox" id="new_category" name="x_new_category_x"  >
  <input type="text" id="new_category_name" name="x_new_category_name_x" label=${add_new_category_label} value="Category Name">
  <label for="new_category">Add New Category</label>
  <br>
  <br>
  <input type="submit" value="Save Changes" formaction="/update_db_workout">
  <input type="submit" value="Cancel" formaction="/">
  </form> 
  </body>
  </html>
`
setTimeout(() => {
  // create entries for file
  for (let i = 0; i < category_array.length; i++) {
    category_name = category_array[i].category_name
    category_position = category_array[i].category_position
    isClosed = category_array[i].isClosed
    checked_category_flag = 0
    // ref: https://www.javascripttutorial.net/javascript-dom/javascript-checkbox/
    for (let j = 0; j < checked_category_array.length; j++) {
      if (checked_category_array[j].category_name == category_name) {
        checked_category_flag = 1
      }
      if (checked_category_flag) {
        form_entry_html = `
        <br>
        <input type="checkbox" id="${category_name}" name="${category_name}" checked>
        <label for="${category_name}">${category_name}</label>
        `
      } else {
        form_entry_html = `
        <input type="checkbox" id="${category_name}" name="${category_name}" >
        <label for="${category_name}">${category_name}</label><br>
        `
      }
    }
      if (isClosed == 1) {
        form_entry_html = form_entry_html + `
        <input type = "number" id="position" name = "position" min="0" max="500" value = "${category_position}" >
        <label for="position">Display Position (between 0 and 500)</label>
        <br>
        <label for="details">Display On/Off</label>
        <select id="details" name = "details" size="1" >
          <option value="0">Show Workouts</option>
          <option value="1" selected>Hide Workouts</option>
        </select>
        <br>
        <br>
        `
      }
      else {
        form_entry_html = form_entry_html + `
        <input type = "number" id="position" name = "position" min="0" max="500" value = "${category_position}" >
        <label for="position">Display Position (between 0 and 500)</label>
        <br>
        <label for="details">Display On/Off</label>
        <select id="details" name = "details" size="1" >
          <option value="0" selected>Show Workouts</option>
          <option value="1" >Hide Workouts</option>
        </select>
        <br>
        <br>
        `
      }
    edit_categories_html += form_entry_html
  }
  edit_categories_html += end_edit_categories_html
  res.end(edit_categories_html)
}, INTERVAL_TIME * 0) // 5/19/22 Does not make a difference whether this is 0 or 1
})
module.exports = router;