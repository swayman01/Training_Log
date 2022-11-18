// This routine adds the new date to the date_array Training_Log_App
const start_time = Date.now()
const path = require('path')
const base_dir = path.dirname(path.resolve(__dirname))
const express = require('express');
const router = express.Router();
const global_constants = require(base_dir + '/util/global_constants')
const et = require(base_dir + '/util/elapsed_time')
const modify_workout_variables = require(base_dir + '/routes/modify_workout')
const db = global_constants.db
var DEBUG = global_constants.DEBUG
console.log('loaded new_workout_date.js', et(start_time))

router.post('/', (req, res, next) => {
  res.redirect("/")
})

router.post('/new_workout_date', (req, res) => {
  // TODO Add checks for undefined
  toRepeat = 'N'
  if ((modify_workout_variables.selected_workout.toRepeat == 1) || (modify_workout_variables.selected_workout.toRepeat == 'Y')) toRepeat = 'Y'
  workout_name = modify_workout_variables.selected_workout.workout_name
  let new_date = req.body.workout_date
  if (new_date=='') {
    res.redirect('/')
    return
  }
  var date_arraySTR = modify_workout_variables.selected_workout.date_array
  var workout_id = modify_workout_variables.selected_workout.id
  var date_array = date_arraySTR.split(',')
  var new_date_array = [new_date].concat(date_array)
  var last_dateSTR = new_date_array[0]
  var last_dateOBJ = new Date(last_dateSTR)
  var last_date = last_dateOBJ.getTime()
  var update_command = `
    UPDATE workouts 
    SET date_array = "${new_date_array}",
    last_date = "${last_date}"
    WHERE id = ${workout_id}
    `
    async function post_db_return(res)
    {
      if(DEBUG) console.log('39 post_db_return in new_workout_date', et(start_time))
      db.close()
      res.redirect('/')
    }
    async function init_update_dates() {
      try {
        if (DEBUG) console.log('45 in update_dates', et(start_time))
        db_open = await db.open(base_dir + '/db/training_log.db')
        var db_return = await db.run(update_command, (err) => {
          if (DEBUG) console.log('48 db_return in update_dates.js', db_return)
          if (err) {
            console.log('*** 50 update_command error in new_workout_date', err)
          }
          if (DEBUG) console.log('52 update_command (new_date_array is updated): ', et(start_time)) //new_date_array is updated
        })
        await post_db_return(res)
      } catch (err) {
        console.log('***Promise error in update_dates***', err, et(start_time))
      }
    }
    init_update_dates()
})
module.exports = router;