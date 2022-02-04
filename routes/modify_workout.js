const express = require('express');
const router = express.Router();
exported_variables = require('./../util/read_head');
global_constants = require('./../util/global_constants')
DEBUG = global_constants.DEBUG
INTERVAL_TIME = global_constants.INTERVAL_TIME
db = global_constants.db
if (DEBUG) console.log('loaded modify_workout.js', Date.now()) 

router.post('/modify_workout', (req, res) => {
  var workout_id = req.body.name
  console.log('17 workout_id in modify_workout', workout_id, Date.now()) // workout_id is passed
  today = new Date()
  new_date = date_format.format(today,'MM/DD/YYYY')
  workout_actionGLOBAL = 'Modify'

  let select_workout = `
    SELECT workout_name, workout_url, date_array, workout_length, toRepeat, workout_comment, workouts.id
    FROM workouts 
    WHERE id = ${workout_id}
    LIMIT 1
    `
    // TODO: Make async function
    db.get(select_workout, [], (err, row) => {
    workoutGLOBAL = row
    module.exports.workoutGLOBAL = workoutGLOBAL
  })
  setTimeout(()=>{
    var add_date_html = `
  <!DOCTYPE html>
<html>
<body>

<h2>${workout_actionGLOBAL} ${workoutGLOBAL.workout_name}</h2>

<form action="/new_workout_date" method="POST">
  <label for="date">Workout Date:</label><br>
  <input type="text" id="workout_date" name="workout_date" value=${new_date}><br>
  <input type="submit" value="Submit New Date">
  <input type="submit" value="Add New Workout" formaction="/add_workout">
  <input type="submit" value="Edit This Workout" formaction="/edit_workout">
  <input type="submit" value="Cancel" formaction="/">
</form> 
</body>
</html>
  `
  res.end(add_date_html)
  }, INTERVAL_TIME)

})
module.exports = router;