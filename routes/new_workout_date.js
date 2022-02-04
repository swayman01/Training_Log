const express = require('express');
const app = express()
const router = express.Router();
exported_variables = require('./../util/read_head');
global_constants = require('./../util/global_constants')
modify_workout_variables = require('./../routes/modify_workout')
DEBUG = global_constants.DEBUG
INTERVAL_TIME = global_constants.INTERVAL_TIME
workoutGLOBAL = modify_workout_variables.workoutGLOBAL
db = global_constants.db
if (DEBUG) console.log('loaded new_workout_date.js', Date.now())
router.post('/', (req, res, next) => {
  res.redirect("/")
})
router.post('/new_workout_date', (req, res) => {
  // TODO Add checks for undefined
  // TODO Add Categories, comma separated
  toRepeat = 'N'
  if ((workoutGLOBAL.toRepeat == 1) || (workoutGLOBAL.toRepeat == 'Y')) toRepeat = 'Y'
  workout_name = workoutGLOBAL.workout_name
  console.log('22 workout_name in new_workout_date', Date.now(), workout_name)
  let new_date = req.body.workout_date
  console.log('\n23 update_db_date\n', req.body, new_date)
  workout = require("./../routes/modify_workout")
  date_arraySTR = workout.workoutGLOBAL.date_array
  workout_id = workout.workoutGLOBAL.id
  console.log('57 update_dates input', Date.now(), workout_id, new_date, date_arraySTR)
  update_dates = require("./../util/update_dates");
  update_dates(workout_id, new_date, date_arraySTR)
  setTimeout(() => {
    if (DEBUG) console.log('32 call retrieve_workouts from new_workout_date ', Date.now())
    workoutsHTML = retrieve_workouts()
    console.log('34 retrieving workouts in new_workout_date: ', Date.now(), '\n', workouts_html.substring(500, 540))
    },
  INTERVAL_TIME * 1)
  setTimeout(() => {
    if (DEBUG) console.log('31 call home_get in post_update_db_workout (new_workout_date)', Date.now())
    app.get('./../routes/home_get', (req, res, next) => {
      console.log('33 in post_update_db_workout (new_workout_datr)', Date.now())
    })
    console.log('35 home_get in post_db_workout (Add)', Date.now())
  }, INTERVAL_TIME * 2) // This delay is needed 1/1/22

  setTimeout(() => {
    console.log('39 res.redirect in post_db_workout new_workout_date:', Date.now())
    res.redirect("/")
  }, INTERVAL_TIME * 3) // Set to 0 1/1/22, reset on 1/6/22 after adding functionality

})
module.exports = router;