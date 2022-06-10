// This module is activated by the + button.
// It creates the screen that allows the user to select the next action.
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
const db = global_constants.db
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
   
  async function add_date_html(workout_name) {
    if (DEBUG) console.log('32 modify_workout add_date_html', workout_name, et(start_time))
    var add_date_html = exported_variables.training_log_head_html + `
        <h2>${workout_actionGLOBAL} ${workout_name}</h2>
        <form action="/new_workout_date" method="POST">
          <label for="date">Workout Date:</label><br>
          <input type="text" id="workout_date" name="workout_date" value=${new_date}><br>
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

  async function db_get() {
    try {
      x = 'db.get'
        var workout_name = ''
        if (DEBUG) console.log('55 db_get()', et(start_time))
        x = db.get(select_workout, [], (err, row) => {
          if(err) {
            console.log('*** Error db.get in modify_workout: ', err)
            } 
          selected_workout = row
          workoutGLOBAL = selected_workout
          workoutGLOBAL.category_name = category_name
          workoutGLOBAL.workout_name = selected_workout.workout_name
          workout_name = selected_workout.workout_name
          if (DEBUG) console.log('67 modify_workout db.get workout_name', workout_name, et(start_time))
          module.exports.workoutGLOBAL = workoutGLOBAL
        })
      if (DEBUG) console.log('68 modify_workout db_get', db_get, x, et(start_time))
    } catch (err) {
      console.log('*** Promise error in modify_workout***', err, et(start_time))
    }
  }

 
  const sqlite3 = require('sqlite3').verbose();
  var db1 = new sqlite3.Database(base_dir + '/db/training_log.db', (err) => {
    if (err) {
      console.log('Could not connect to database:', err)
    } else if (DEBUG) console.log('128 Connected to database in modify_workout', et(start_time))
  })
  
  function init() {
    if (DEBUG) console.log('81 db1 in modify_workout', db1, et(start_time))
    var workout_name = ''
    x = db1.open
    if (DEBUG) console.log('85 x ', x, et(start_time))
    x = db1.get(select_workout, [], (err, row) => {
      if (DEBUG) console.log('87 workout_name', row.workout_name, et(start_time))
      selected_workout = row
      if (DEBUG) console.log('89 x ', x, et(start_time))
      workout_name = selected_workout.workout_name
      db.close
      module.exports.selected_workout = selected_workout
      add_date_html(workout_name)
    })
  }
  init()
})
module.exports = router;