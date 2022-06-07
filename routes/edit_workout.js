// This file posts the edit workout screen
const path = require('path')
const base_dir = path.dirname(path.resolve(__dirname))
const express = require('express');
const router = express.Router();
const global_constants = require(base_dir + '/util/global_constants')
const start_time = Date.now()
const et = require(base_dir + '/util/elapsed_time')
const exported_variables = require(base_dir + '/util/read_head');
const modify_workout_variables = require(base_dir + '/routes/modify_workout')
var DEBUG = global_constants.DEBUG
if (DEBUG) console.log('loaded edit_workout.js', et(start_time))

router.post('/edit_workout', (req, res) => {
  // TODO Add checks for undefined
  toRepeat = 'N'
  if ((selected_workout.toRepeat == 1) || (selected_workout.toRepeat == 'Y')) toRepeat = 'Y'
  workout_actionGLOBAL = 'Edit'
  // module.exports.workout_actionGLOBAL = workout_actionGLOBAL
  modify_workout_variables.workout_actionGLOBAL =  workout_actionGLOBAL 
  var edit_workout_html = exported_variables.training_log_head_html +
  `
<h2>${workout_actionGLOBAL} Workout ${selected_workout.workout_name}</h2>
<form action="/add_workout" method="POST">
  <label for="workout_url">Workout URL (optional) :</label><br>
  <input type="text" id="workout_url" name="workout_url" value="${selected_workout.workout_url}"><br>
  
  <label for="date">Workout Dates:</label><br>
  <input type="text" id="workout_date" name="workout_date" value="${selected_workout.date_array}"><br>
  
  <label for="workout_length">Workout Length (optional) :</label><br>
  <input type="text" id="workout_length" name="workout_length" value="${selected_workout.workout_length}" ><br>
  
  <label for="toRepeat">Repeat Workout:</label><br>
  <input type="text" id="toRepeat" name="toRepeat" value="${toRepeat}"><br>
  
  <label for="workout_comment">Workout Comment (optional) :</label><br>
  <input type="text" id="workout_comment" name="workout_comment" value="${selected_workout.workout_comment}"><br>
  <input type="submit" value="Save Changes" formaction="/update_db_workout">
  <input type="submit" value="Cancel" formaction="/">
</form> 
</body>
</html>
`
res.end(edit_workout_html)
})
module.exports = router;