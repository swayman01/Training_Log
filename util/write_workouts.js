module.exports = function write_workouts(workout_row) {
    // This function writes a workout in html format
    // Moved from home.js 7/13/23
    const base_dir = path.dirname(path.resolve(__dirname))
    const global_constants = require(base_dir + '/util/global_constants')
    const start_time = Date.now()
    const et = require(base_dir + '/util/elapsed_time')
    var DEBUG = global_constants.DEBUG
    var category_name = workout_row.category_name
    try {
        strong_a = ' '
        strong_b = ' '
        if ((workout_row.toRepeat == 'Y') || (workout_row.toRepeat == '1')) {
            strong_a = '<strong>'
            strong_b = '</strong>'
            div_1 = '<div class="flex-container workout-form">'
        }
        else {
            div_1 = '<div class="flex-container workout-form no_repeat">'
        }
        var add_date = `
        <form action="/modify_workout" method="POST">
            <input type="hidden" name="name" id="name" autocomplete="false" value=${workout_row.id}>
            <input type="hidden"  name="category_name" id="category_name" autocomplete="false" type="text" value="${category_name}">
            <span class="plus_button plus_button_tooltip">
                <span class="plus_button_tooltiptext ">Click to Add or Edit Workouts</span>
                <button type="submit" class="block button plus_button">+</button>
            </span>
        </form> 
        `

        workout = `
            <li id="wo_${workout_row.id}" "class="workout" >
            ${div_1}
                <div>
                ${add_date}
                </div>
                <div> 
                <a href="${workout_row.workout_url}"
                    target="_blank" rel="noopener noreferrer" 
                    class="link">${strong_a}${workout_row.workout_name}${strong_b}</a>
                </div>  
                <div class="workout-form">${workout_row.workout_length}</div>
                <div class="separator">-</div>
                <div class="dates">${workout_row.date_array}</div>
                <div class="comments">${workout_row.workout_comment}</div>
                </div>
            </li>
        `
    }
    catch (err) {
        console.log('*** Error in write_workouts ***', err, et(start_time))
    }
    if (DEBUG) console.log('54 in write_workouts', et(start_time))
return workout
}