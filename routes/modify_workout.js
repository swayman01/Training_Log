// This module is activated by the + button.
// It creates the screen that allows the user to select the next action.
const express = require('express');
const router = express.Router();
const global_constants = require('./../util/global_constants')
const base_dir = global_constants.base_dir
const start_time = Date.now()
const et = require(base_dir + '/util/elapsed_time')
const exported_variables = require('./../util/read_head');
var DEBUG = global_constants.DEBUG
const INTERVAL_TIME = global_constants.INTERVAL_TIME
const db = global_constants.db
console.log('loaded modify_workout.js', et(start_time)) 

router.post('/modify_workout', (req, res) => {
  var workout_id = req.body.name
  var category_name = req.body.category_name
  today = new Date()
  new_date = date_format.format(today,'MM/DD/YY')
  workout_actionGLOBAL = 'Modify'

 var select_workout = `
    SELECT workout_name, workout_url, date_array, workout_length, toRepeat, workout_comment, workouts.id
    FROM workouts 
    WHERE id = ${workout_id}
    LIMIT 1
    `
   
  async function add_date_html(workout_name) {
    if (DEBUG) console.log('31 modify_workout add_date_html', workout_name, et(start_time))
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
      setTimeout(() => {
        var workout_name = ''
        if (DEBUG) console.log('55 db_get()', et(start_time))
        x = db.get(select_workout, [], (err, row) => {
          // console.log('55 db.get error: ', err)
          // if(err) {
          // console.log('56 db.get error: ', err)
          // } else{
          // This doesn't execute
          selected_workout = row
          workoutGLOBAL = selected_workout
          workoutGLOBAL.category_name = category_name
          workoutGLOBAL.workout_name = selected_workout.workout_name
          workout_name = selected_workout.workout_name
          if (DEBUG) console.log('67 modify_workout db.get workout_name', workout_name, et(start_time))
          module.exports.workoutGLOBAL = workoutGLOBAL
          // }
        })
      }, INTERVAL_TIME * 0)  // set to 0 before 5/14/22
      if (DEBUG) console.log('74 modify_workout db_get', db_get, x, et(start_time))
      // TODO Remove setTimeout
      // setTimeout(()=>{
      // console.log('66 modify_workout db_get', db_get, workout_name, et(start_time))
      // console.log('67 modify_workout db_get', db_get, db_get.toRepeat, et(start_time))
      // add_date_html(workout_name)
      // }, INTERVAL_TIME * 0)
      // await add_date_html()
    } catch (err) {
      console.log('***79 Promise error in modify_workout***', err, et(start_time))
    }
  }

  async function modify_workout_init() {
    // Promise never closes - use init() for now 5/12/22
    var x1 = 'line 88'
    try {
      var workout_name = ''
      if (DEBUG) console.log('90', base_dir + '/db/practice_training_log.db', et(start_time))
      x = await db.open(base_dir + '/db/practice_training_log.db'); // create a sqlite3.Database object & open the database on the passed filepath.
      if (DEBUG) console.log('92 x', x, et(start_time))
      x1 = await db.get(select_workout, [], (err, row) => {
        // This command works in db browser for sqlite
        if (DEBUG) console.log('94 db_get() row', row)
        // console.log('55 db.get error: ', err)
        // if(err) {
        // console.log('56 db.get error: ', err)
        // } else{
        // This doesn't execute
        selected_workout = row
        workout_name = selected_workout.workout_name
        workoutGLOBAL = selected_workout
        // workoutGLOBAL.category_name = category_name //commented out 5/13/22
        // workoutGLOBAL.workout_name = selected_workout.workout_name //commented out 5/13/22
        if (DEBUG) console.log('104 modify_workout db.get workout_name', workout_name, et(start_time))
        module.exports.workoutGLOBAL = workoutGLOBAL
        // }
      })
    } catch (err) {
      console.log('***112 Promise error in modify_workout***', err, et(start_time))
    }
    if (DEBUG) console.log('114 x1, workout_name', x, workout_name, et(start_time))
      // await add_date_html(workout_name)
      if (DEBUG) console.log('117 end of modify_workout init', db_get, et(start_time))
      // TODO Remove setTimeout
      // setTimeout(()=>{
      // add_date_html(workout_name)
      // TODO transfer workout_name
      // }, INTERVAL_TIME * 0)
      await add_date_html(workout_name)
   
  }
  // modify_workout_init()
  // Try outside await
  const sqlite3 = require('sqlite3').verbose();
  var db1 = new sqlite3.Database(base_dir + '/db/training_log.db', (err) => {
    if (err) {
      console.log('Could not connect to database:', err)
    } else if (DEBUG) console.log('128 Connected to database in modify_workout', et(start_time))
  })
  
  function init() {
    if (DEBUG) console.log('132 db1 in modify_workout', db1, et(start_time))
    var workout_name = ''
    x = db1.open
    if (DEBUG) console.log('135 x ', x, et(start_time))
    x = db1.get(select_workout, [], (err, row) => {
      if (DEBUG) console.log('136 workout_name', row.workout_name, et(start_time))
      selected_workout = row
      if (DEBUG) console.log('139 x ', x, et(start_time))
      workout_name = selected_workout.workout_name
      db.close
      console.log('142 in modify_workout.js selected_workout', et(start_time))
      module.exports.selected_workout = selected_workout
      add_date_html(workout_name)
    })
  }
  init()
  // modify_workout_init()
})
module.exports = router;