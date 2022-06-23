// This file displays the edit categories screen
path = require('path')
const base_dir = path.dirname(path.resolve(__dirname))
const express = require('express');
const router = express.Router();
const exported_variables = require(base_dir + '/util/read_head');
const global_constants = require(base_dir+ '/util/global_constants')
const start_time = Date.now()
const et = require(base_dir + '/util/elapsed_time')
console.log('loaded edit_categories.js', et(start_time))
const modify_workout_variables = require(base_dir + '/routes/modify_workout')
var DEBUG = global_constants.DEBUG
// DEBUG = true

router.post('/', (req, res, next) => {
  res.redirect("/")
})

router.post('/edit_categories', (req, res) => {
  // TODO Add checks for undefined and duplicates
  const db = global_constants.db
  var checked_category_array = []
  var form_entry_html = ''
  if (DEBUG) console.log('24 router.post(/edit_categories', et(start_time))
  var edit_categories_html = exported_variables.training_log_head_html + `
      <h2>${workout_actionGLOBAL} for Workout ${selected_workout.workout_name}</h2>
      <form action="/update_db_workout" method="POST">
    `

  async function edit_categories(category_array) {
    if (DEBUG) console.log('31 in edit_categories', category_array[0], et(start_time))
    var toRepeat = 'N'
    if ((selected_workout.toRepeat == 1) || (selected_workout.toRepeat == 'Y')) toRepeat = 'Y'
    var category_name = modify_workout_variables.category_name
    var workout_actionGLOBAL = 'Edit Categories'
    module.exports.workout_actionGLOBAL = workout_actionGLOBAL
    modify_workout_variables.workout_actionGLOBAL = workout_actionGLOBAL
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
    // create entries for file
    for (let i = 0; i < category_array.length; i++) {
      category_name = category_array[i].category_name
      category_position = category_array[i].category_position
      isClosed = category_array[i].isClosed
      checked_category_flag = 0
      if (DEBUG) console.log('57 in edit_categories', i, category_array[i], et(start_time))
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
      } else {
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
    res.end(edit_categories_html)  // Repeats
  }
  
  async function init_edit_categories() {
    // get list of categories
    let retrieve_categories = `
      SELECT category_position, isClosed, category_name
      FROM categories 
      ORDER BY category_position
      `
    let assigned_categories = `
      SELECT categories_to_workouts.category_name
      FROM categories_to_workouts
      INNER JOIN workouts 
      on categories_to_workouts.workout_name = workouts.workout_name
      WHERE workouts.id = ${selected_workout.id}
      `
    var category_array = []
    try {
      if (DEBUG) console.log('125 edit_categories db', db, et(start_time))
      db_open = await db.open('./db/training_log.db'); // create a sqlite3.Database object & open the database on the passed filepath.
      if (DEBUG)  console.log('127 edit_categories db_open', db_open, et(start_time))
      category_array = await db.all(retrieve_categories, [], (err, rows) => {
        category_array = rows
        // TODO eliminate one of the two lines below
        module.exports.category_arrayGLOBAL = category_array
        module.exports.category_array = category_array
        if (DEBUG) console.log('133 router.post in edit_categories  after run_edit_categories()', et(start_time))
        db.close()
      })
      checked_category_array = await db.all(assigned_categories, [], (err, rows) => {
        checked_category_array = rows
        if (err) {
          console.log('*** Error finding assigned categories in edit_categories', et(start_time), err)
        }
      })
      if (DEBUG) console.log('142 checked_category_array', checked_category_array, et(start_time))
      edit_categoriesPROMISE = await edit_categories(category_array, checked_category_array)
      if (DEBUG) console.log('144 checked_category_array', checked_category_array, et(start_time))
      module.exports.category_array = category_array
      if (DEBUG) console.log('146 edit_categoriesPROMISE', edit_categoriesPROMISE, et(start_time))
    } catch (e) {
      console.log('***Promise error edit_categories:)', e)
    }
  }
  init_edit_categories()
})

module.exports = router;