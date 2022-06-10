module.exports = function (workout_id, new_date, date_arraySTR) {
  // This function updates the date_array and last_date
  const path = require('path')
  const base_dir = path.dirname(path.resolve(__dirname))
  const global_constants = require(base_dir + '/util/global_constants')
  var DEBUG = global_constants.DEBUG
  const start_time = Date.now()
  const et = require(base_dir + '/util/elapsed_time')
  console.log('loaded update_dates', et(start_time))
  if (DEBUG) console.log('9 in update_dates workout_id, new_date: ', et(start_time), '\n', workout_id, new_date, date_arraySTR)
  var date_array = date_arraySTR.split(',')
  var new_date_array = [new_date].concat(date_array)

  try {
    var last_dateSTR = new_date_array[0]
    var last_dateOBJ = new Date(last_dateSTR)
    var last_date = last_dateOBJ.getTime()
  } catch (err) {
    console.log('***18 err in update_dates: ', err, '\n')
  }
  // Update db for new_date_array and last_date
  var update_command = `
    UPDATE workouts 
    SET date_array = "${new_date_array}",
    last_date = "${last_date}"
    WHERE id = ${workout_id}
    `
    const sqlite3 = require('sqlite3').verbose();
    var db1 = new sqlite3.Database(base_dir + '/db/training_log.db', (err) => {
      if (err) {
        console.log('Could not connect to database:', err)
      } else if (DEBUG) console.log('32 Connected to database in update_dates', et(start_time))
    })
  db1.open
  var db_return = db1.run(update_command, (err) => {
    if (DEBUG) console.log('36 db_return in update_dates.js', db_return)
    if (err) {
      console.log('*** 38 in updated_dates update_command error', err)
    }
    if (DEBUG) console.log('40 update_command (new_date_array is updated): ', et(start_time)) //new_date_array is updated
  })
}