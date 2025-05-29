module.exports = function (workout_row) { 
    // This routine formats the workout length for consistency
    const path = require('path')
    const base_dir = path.dirname(path.resolve(__dirname))
    const global_constants = require(base_dir + '/util/global_constants')
    const start_time = Date.now()
    const et = require(base_dir + '/util/elapsed_time')
    const length_hhmmssREG =global_constants.length_hhmmssREG
    const length_mmssREG =global_constants.length_mmssREG
    var DEBUG = global_constants.DEBUG
    workout_length_input = workout_row.workout_length
    var formatted_workout_length = ''

    if (length_hhmmssREG.test(workout_length_input)) {
        start = workout_length_input.match(length_hhmmssREG).index
        end = start + workout_length_input.match(length_hhmmssREG)[0].length
        formatted_workout_length = workout_length_input.substring(start, end)
    }
    else {
        if (length_mmssREG.test(workout_length_input)) {
            start = workout_length_input.match(length_mmssREG).index
            end = start + workout_length_input.match(length_mmssREG)[0].length
            formatted_workout_length = workout_length_input.substring(start, end)
            }
             else if (DEBUG) console.log('25', workout_row.workout_name, workout_row.workout_length, 'not formatted')
        }
    // formatted_workout_length = 'test to see that we are passing variable'
    return formatted_workout_length
}