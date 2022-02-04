module.exports = function (workout_id, new_date) {
  global_constants = require('./global_constants')
    INTERVAL_TIME = global_constants.INTERVAL_TIME
    db = global_constants.db
    DEBUG = global_constants.DEBUG
    if (DEBUG)   console.log('loaded updated_last_date', Date.now())
    console.log('\n, workout_id, new_date: ', Date.now(), '\n', workout_id, new_date)
    workout = require("./../util/modify_workout")
    console.log('9 in update_db_date workout\n', workout.exports)

}
// workoutGLOBAL.date_array.split(',').push(new_date)
//   // TODO Add this to edit workout and add workout
//   new_date_array = new_date.concat(', ', workoutGLOBAL.date_array)
//   try {
//     last_dateSTR = new_date_array.split(',')[0]
//     last_dateOBJ = new Date(last_dateSTR)
//     last_date = last_dateOBJ.getTime()
//     console.log('179 last_date', Date.now(), last_date)
//   }
//     catch(err) {
//       console.log('182 err: ', err, '\n')
//     }
//   // Update db for new_date_array and last_date
//   update_command = `
// UPDATE workouts 
// SET date_array = "${new_date_array}",
// last_date = "${last_date}"
// WHERE id = ${workoutGLOBAL.id}
//   `
//   // Reference: https://stackoverflow.com/questions/6597493/synchronous-database-queries-with-node-js
//   db_return = db.run(update_command) //TODO: See if we can something with the return code
//   // console.log('119 db_return', db_return, Date.now())
//   console.log('\n149 update_command: ', Date.now()) //new_date_array is updated
//   setTimeout(() => {
//     retrieve_workouts()
//   }, INTERVAL_TIME) // This delay is needed 1/1/22
//   // TODO Learn about unhandled promise rejection
//   setTimeout(() => {
//     // Reload home page
//     console.log('156 redirect after update_command: ', Date.now(), '\n')
//     res.redirect("/")
//   }, INTERVAL_TIME * 2)
// })
