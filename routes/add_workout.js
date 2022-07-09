// This file displays the add workout screen
const path = require('path')
const base_dir = path.dirname(path.resolve(__dirname))
const express = require('express');
const router = express.Router();
const exported_variables = require(base_dir + '/util/read_head');
const global_constants = require(base_dir + '/util/global_constants')
const start_time = Date.now()
const et = require(base_dir + '/util/elapsed_time')
const modify_workout_variables = require(base_dir + '/routes/modify_workout')
const add_workout_html_equals = require(base_dir + '/util/add_workout_html_equals')
var DEBUG = global_constants.DEBUG
console.log('loaded add_workout.js', et(start_time))
router.post('/', (req, res, next) => {  // This is needed to prevent multiple entries
    // TODO lock out button while working
    res.redirect("/")
})

router.post('/add_workout', (req, res) => {
  var new_date = req.body.workout_date
  var category_name = modify_workout_variables.category_name
  var toRepeat = 'N'
  if ((selected_workout.toRepeat == 1) || (selected_workout.toRepeat == 'Y')) toRepeat = 'Y'
  var workout_actionGLOBAL = 'Add'
  module.exports.workout_actionGLOBAL = workout_actionGLOBAL
  modify_workout_variables.workout_actionGLOBAL =  workout_actionGLOBAL
  var add_workout_error_message = global_constants.add_workout_error_message
  if (add_workout_error_message === undefined) add_workout_error_message = 'undefined - change to blank when done debugging'
  if (DEBUG) console.log('31 post_update_db_workout add_workout_error_message', add_workout_error_message)
  var add_workout_html = exported_variables.training_log_head_html + 
    add_workout_html_equals(workout_actionGLOBAL, category_name, new_date, add_workout_error_message)
  add_workout_error_message = ''
if(DEBUG) console.log('35 res.end(add_workout_html) in add_workout', et(start_time))
res.end(add_workout_html)
})

module.exports = router;