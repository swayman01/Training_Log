const express = require('express');
const router = express.Router();
// const workoutsHTML = require('./../util/retrieve_workouts.js')
exported_variables = require('./../util/read_head');
global_constants = require('./../util/global_constants')
modify_workout_variables = require('./../routes/modify_workout')
DEBUG = global_constants.DEBUG
INTERVAL_TIME = global_constants.INTERVAL_TIME
workoutGLOBAL = modify_workout_variables.workoutGLOBAL
db = global_constants.db
if (DEBUG) console.log('loaded add_workout.js', Date.now())
router.post('/', (req, res, next) => {  // This is needed to prevent multiple entries
    res.redirect("/")
})

router.post('/add_workout', (req, res) => {
  // TODO Add checks for undefined and duplicates
  // if (DEBUG) console.log('18 in add_workout workoutGLOBAL: ', workoutGLOBAL)
  let new_date = req.body.workout_date
  var category_name = workoutGLOBAL.category_name
  console.log('** 26\n workoutGLOBAL in add_workout', workoutGLOBAL)
  toRepeat = 'N'
  if ((workoutGLOBAL.toRepeat == 1) || (workoutGLOBAL.toRepeat == 'Y')) toRepeat = 'Y'
  workout_name = workoutGLOBAL.workout_name
  workout_actionGLOBAL = 'Add'
  module.exports.workout_actionGLOBAL = workout_actionGLOBAL
  var add_workout_html = exported_variables.training_log_head_html + `
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
res.end(add_workout_html)
})

module.exports = router;