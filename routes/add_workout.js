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
var DEBUG = global_constants.DEBUG
if (DEBUG) console.log('loaded add_workout.js', et(start_time))
router.post('/', (req, res, next) => {  // This is needed to prevent multiple entries, but doesn't work
    // TODO lock out button while working
    res.redirect("/")
})

router.post('/add_workout', (req, res) => {
  // TODO Add checks for undefined and duplicates
  var new_date = req.body.workout_date
  var category_name = modify_workout_variables.category_name
  var toRepeat = 'N'
  if ((selected_workout.toRepeat == 1) || (selected_workout.toRepeat == 'Y')) toRepeat = 'Y'
  var workout_actionGLOBAL = 'Add'
  module.exports.workout_actionGLOBAL = workout_actionGLOBAL
  modify_workout_variables.workout_actionGLOBAL =  workout_actionGLOBAL
  var add_workout_html = exported_variables.training_log_head_html + 
  `
  <h2>${workout_actionGLOBAL} Workout </h2>
    <form action="/add_workout" method="POST">
      <label for="category_name">Category Name:</label><br>
      <input type="text" id="category_name" name="category_name" name="category_name" value="${category_name}"><br>

      <label for="workout__name">Workout Name:</label><br>
      <input type="text" id="workout_name" name="workout_name" ><br>

      <label for="workout_url">Workout URL (optional) :</label><br>
      <input type="text" id="workout_url" name="workout_url" value=""><br>
      
      <label for="date">Workout Dates:</label><br>
      <input type="text" id="workout_date" name="workout_date" value="${new_date}"><br>
      
      <label for="workout_length">Workout Length (optional) :</label><br>
      <input type="text" id="workout_length" name="workout_length" ><br>
      
      <label for="toRepeat">Repeat Workout:</label><br>
      <input type="text" id="toRepeat" name="toRepeat" value="${toRepeat}"><br>
      
      <label for="workout_comment">Workout Comment (optional) :</label><br>
      <input type="text" id="workout_comment" name="workout_comment" value=""><br>
      <input type="submit" value="Add Workout" formaction="/update_db_workout">
      <input type="submit" value="Cancel" formaction="/">
    </form> 
  </body>
  </html>
`
if(DEBUG) console.log('55 res.end(add_workout_html) in add_workout', et(start_time))
res.end(add_workout_html)
})

module.exports = router;