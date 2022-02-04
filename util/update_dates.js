module.exports = function (workout_id, new_date, date_arraySTR) {
  // This function updates the date_array and last_date

  global_constants = require('./global_constants')
  // INTERVAL_TIME = global_constants.INTERVAL_TIME
  db = global_constants.db
  DEBUG = global_constants.DEBUG
  if (DEBUG) console.log('loaded update_dates', Date.now())
  console.log('\n, workout_id, new_date: ', Date.now(), '\n', workout_id, new_date, date_arraySTR)
  date_array = date_arraySTR.split(',')
  new_date_array = [new_date].concat(date_array)
  // TODO Add this to edit workout and perhaps add workout

  try {
    last_dateSTR = new_date_array[0]
    last_dateOBJ = new Date(last_dateSTR)
    last_date = last_dateOBJ.getTime()
  } catch (err) {
    console.log('27 err in update_dates: ', err, '\n')
  }
  // Update db for new_date_array and last_date
  update_command = `
  UPDATE workouts 
  SET date_array = "${new_date_array}",
  last_date = "${last_date}"
  WHERE id = ${workout_id}
    `
  // Reference: https://stackoverflow.com/questions/6597493/synchronous-database-queries-with-node-js
  db_return = db.run(update_command, (err) => {
    if (err) {
      console.log('update_command error', err)
    }
  })
  if (DEBUG) console.log('41 update_command (new_date_array is updated): ', Date.now()) //new_date_array is updated
}
//   // Reference: https://stackoverflow.com/questions/6597493/synchronous-database-queries-with-node-js