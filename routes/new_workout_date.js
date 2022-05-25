// This routine adds the new date to the date_array
const express = require('express');
const app = express()
const router = express.Router();
const global_constants = require('./../util/global_constants')
const base_dir = global_constants.base_dir
const start_time = Date.now()
const et = require(base_dir + '/util/elapsed_time')
const modify_workout_variables = require('./../routes/modify_workout')
var DEBUG = global_constants.DEBUG
if (DEBUG) console.log('loaded new_workout_date.js', et(start_time))

router.post('/', (req, res, next) => {
  res.redirect("/")
})

router.post('/new_workout_date', (req, res) => {
  // TODO Add checks for undefined
  toRepeat = 'N'
  if ((modify_workout_variables.selected_workout.toRepeat == 1) || (modify_workout_variables.selected_workout.toRepeat == 'Y')) toRepeat = 'Y'
  workout_name = modify_workout_variables.selected_workout.workout_name
  // console.log('22 workout_name in new_workout_date', Date.now(), workout_name)
  let new_date = req.body.workout_date
  var date_arraySTR = modify_workout_variables.selected_workout.date_array
  var workout_id = modify_workout_variables.selected_workout.id
  const update_dates = require("./../util/update_dates");
  update_dates(workout_id, new_date, date_arraySTR)
  if (DEBUG) console.log('28 res.redirect in post_db_workout new_workout_date:', et(start_time))
    res.redirect("/")
})
module.exports = router;