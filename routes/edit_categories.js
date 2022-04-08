// This module is executed from the modify_workout screen
// It creates the edit_categories screen
const express = require('express');
const router = express.Router();
exported_variables = require('./../util/read_head');
global_constants = require('./../util/global_constants')
modify_workout_variables = require('./../routes/modify_workout')
DEBUG = global_constants.DEBUG
INTERVAL_TIME = global_constants.INTERVAL_TIME
workoutGLOBAL = modify_workout_variables.workoutGLOBAL
db = global_constants.db
if (DEBUG) console.log('loaded edit_categories.js', Date.now())
router.post('/', (req, res, next) => {
  res.redirect("/")
})

router.post('/edit_categories', (req, res) => {
  // TODO Add checks for undefined and duplicates
  toRepeat = 'N'
  if ((workoutGLOBAL.toRepeat == 1) || (workoutGLOBAL.toRepeat == 'Y')) toRepeat = 'Y'
  workout_name = workoutGLOBAL.workout_name
  workout_category = workoutGLOBAL.category_name
  workout_actionGLOBAL = 'Edit Categories'
  module.exports.workout_actionGLOBAL = workout_actionGLOBAL
  // get list of categories
  let retrieve_categories = `
      SELECT category_position, isClosed, category_name
      FROM categories 
      ORDER BY category_position
      `
  var category_array = []
  try {
    db.all(retrieve_categories, [], (err, rows) => {
      category_array = rows
      module.exports.category_arrayGLOBAL = category_array
      module.exports.category_array = category_array
      if (err) {
        console.log('38 error retrieving categories in edit_categories', Date.now(), err)
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
      WHERE workouts.id = ${workoutGLOBAL.id}
      `
  var checked_category_array = []
  try {
    db.all(assigned_categories, [], (err, rows) => {
      checked_category_array = rows
      if (err) {
        console.log('58 error finding assigned categories in edit_categories', Date.now(), err)
      }
    })
  } catch (e) {
    console.log('62 Did not retrieve categories in edit_categories:)', e)
  }
  // Start html file
  var edit_categories_html = exported_variables.training_log_head_html + `
    <h2>${workout_actionGLOBAL} for Workout ${workoutGLOBAL.workout_name}</h2>
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
    // console.log('xx129 ',  category_name, isClosed, category_position )
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
}, INTERVAL_TIME * 1) // Timeout needed for db retrieval
})
module.exports = router;