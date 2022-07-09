// This module is activated by the + button.
// It creates the screen that allows the user to select the next action and
// loads the workout name to exported variables
const express = require('express');
const router = express.Router();
const path = require('path')
const base_dir = path.dirname(path.resolve(__dirname))
const global_constants = require(base_dir + '/util/global_constants')
const start_time = Date.now()
const et = require(base_dir + '/util/elapsed_time')
const exported_variables = require(base_dir + '/util/read_head');
var DEBUG = global_constants.DEBUG
// DEBUG = true
console.log('loaded modify_workout.js', et(start_time)) 

router.post('/modify_workout', (req, res) => {
  var workout_id = req.body.name
  var category_name = req.body.category_name
  module.exports.category_name = category_name
  today = new Date()
  new_date = date_format.format(today, 'MM/DD/YY')
  workout_actionGLOBAL = 'Modify'
 var select_workout = `
    SELECT workout_name, workout_url, date_array, workout_length, toRepeat, workout_comment, workouts.id
    FROM workouts 
    WHERE id = ${workout_id}
    LIMIT 1
    `
   
  function add_date_html(workout_name) {
    if (DEBUG) console.log('32 modify_workout add_date_html', workout_name, et(start_time))
    const date_pattern = "^(0?[1-9]|1[012])[\\/\\-](0?[1-9]|[12][0-9]|3[01])[\\/\\-]\\d{2}$"
    var add_date_html = exported_variables.training_log_head_html + `
        <h2>${workout_actionGLOBAL} ${workout_name}</h2>
        <form action="/new_workout_date" method="POST">
          <label for="date">Workout Date (mm/dd/yy):</label>
          <input type="text" id="workout_date" name="workout_date" value=${new_date}
          pattern = "${date_pattern}"><br>
          <br><br>
          <input type="submit" value="Submit New Date">
          <input type="submit" value="Add New Workout" formaction="/add_workout">
          <input type="submit" value="Edit This Workout" formaction="/edit_workout">
          <input type="submit" value="Edit categories" formaction="/edit_categories">
          <input type="submit" value="Cancel" formaction="/">
        </form> 
        </body>
        </html>
      `
    res.end(add_date_html)
  }

  const sqlite3 = require('sqlite3').verbose();
  // Since this loads the next screen there is no need to promisfy
  var db1 = new sqlite3.Database(base_dir + '/db/training_log.db', (err) => {
    if (err) {
      console.log('Could not connect to database:', err)
    } else if (DEBUG) console.log('55 Connected to database in modify_workout', et(start_time))
  })
  
    var workout_name = ''
    db1.open
    x = db1.get(select_workout, [], (err, row) => {
      if (DEBUG) console.log('60 modify_workout workout_name', row.workout_name, et(start_time))
      selected_workout = row
      if (DEBUG) console.log('62 modify_workout x ', x, et(start_time))
      workout_name = selected_workout.workout_name
      db1.close
      module.exports.selected_workout = selected_workout
      add_date_html(workout_name)
    })
})
module.exports = router;