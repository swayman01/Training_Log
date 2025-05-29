module.exports = function (workout_id, new_date) {
  NOT USED
  global_constants = require('./global_constants')
    INTERVAL_TIME = global_constants.INTERVAL_TIME
    db = global_constants.db
    DEBUG = global_constants.DEBUG
    if (DEBUG)   console.log('loaded updated_last_date', Date.now())
    console.log('\n, workout_id, new_date: ', Date.now(), '\n', workout_id, new_date)
    workout = require("./../util/modify_workout")
    console.log('9 in update_db_date workout\n', workout.exports)
}