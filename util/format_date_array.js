module.exports = function (workout_row) { // This file formats the date array
    // This creates a new dictionary entry, formatted_date_array for display purposes.
    const path = require('path')
    const base_dir = path.dirname(path.resolve(__dirname))
    const global_constants = require(base_dir + '/util/global_constants')
    const start_time = Date.now()
    const et = require(base_dir + '/util/elapsed_time')
    var DEBUG = global_constants.DEBUG
    date_format = require('date-and-time')
    if (workout_row['date_array']==null) workout_row['date_array'] = ''
    // Strip trailing comma
    // Someday:remove in data base
    if (workout_row.date_array[workout_row.date_array.length - 1] == ',') {
        workout_row.date_array = workout_row.date_array.substring(0, workout_row.date_array.length - 1)
    }
    var date_array = workout_row['date_array'].split(',')
    var formatted_date_arraySTR = []
    if (date_array.length < 5) {
        for (let j = 0; j < date_array.length; j++) {
            dateOBJ = new Date(date_array[j])
            if ((dateOBJ == 'Invalid Date')&&(workout_row['date_array']!='')) formatted_date = '**' + date_array[j] +'**' 
            else {
                if (workout_row['date_array']=='') formatted_date = "Haven't tried"
                else formatted_date = date_format.format(dateOBJ, 'MM/DD/YY')
            }
            if (j != (date_array.length - 1)) formatted_date = formatted_date + ', '
            formatted_date_arraySTR = formatted_date_arraySTR + formatted_date
        }
    } else {
        for (let j = 0; j < 3; j++) {
            dateOBJ = new Date(date_array[j])
            if ((dateOBJ == 'Invalid Date')&&(workout_row['date_array']!='')) formatted_date = '**' + date_array[j] +'**' 
            else formatted_date = date_format.format(dateOBJ, 'MM/DD/YY')
            if (j != (date_array.length - 1)) formatted_date = formatted_date + ', '
            formatted_date_arraySTR = formatted_date_arraySTR + formatted_date
        }
          
            dateOBJ = new Date(date_array[date_array.length - 1])
            if (dateOBJ == 'Invalid Date') formatted_date = "Haven't tried"
            else formatted_date = date_format.format(dateOBJ, 'MM/DD/YY')
            formatted_date_arraySTR = formatted_date_arraySTR + '... ' + formatted_date
            formatted_date_arraySTR = formatted_date_arraySTR + ', Total Times Workout Completed: ' + `${date_array.length}`
        }
    workout_row['formatted_date_array'] = formatted_date_arraySTR
    return workout_row['formatted_date_array']
}