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
if (DEBUG) console.log('loaded edit_workout.js', Date.now())
router.post('/', (req, res, next) => {
    res.redirect("/")
})

router.post('/edit_workout', (req, res) => {
  // TODO Add checks for undefined
  toRepeat = 'N'
  if ((workoutGLOBAL.toRepeat == 1) || (workoutGLOBAL.toRepeat == 'Y')) toRepeat = 'Y'
  workout_name = workoutGLOBAL.workout_name
  workout_actionGLOBAL = 'Edit'
  module.exports.workout_actionGLOBAL = workout_actionGLOBAL
  var edit_workout_html = exported_variables.training_log_head_html +
  `
<h2>${workout_actionGLOBAL} Workout ${workoutGLOBAL.workout_name}</h2>

<form action="/add_workout" method="POST">
<label for="workout_url">Workout URL (optional) :</label><br>
<input type="text" id="workout_url" name="workout_url" value="${workoutGLOBAL.workout_url}"><br>
<label for="date">Workout Dates:</label><br>
<input type="text" id="workout_date" name="workout_date" value="${workoutGLOBAL.date_array}"><br>
<label for="workout_length">Workout Length (optional) :</label><br>
<input type="text" id="workout_length" name="workout_length" value="${workoutGLOBAL.workout_length}" ><br>
<label for="toRepeat">Repeat Workout:</label><br>
<input type="text" id="toRepeat" name="toRepeat" value="${toRepeat}"><br>
<label for="workout_comment">Workout Comment (optional) :</label><br>
<input type="text" id="workout_comment" name="workout_comment" value="${workoutGLOBAL.workout_comment}"><br>
<input type="submit" value="Save Changes" formaction="/update_db_workout">
<input type="submit" value="Cancel" formaction="/">
</form> 
</body>
</html>
`
res.end(edit_workout_html)
})
module.exports = router;