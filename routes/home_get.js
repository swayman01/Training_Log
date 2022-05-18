// Reference: https://github.com/tguichaoua/promised-sqlite3
const base_dir = '/Users/swayman/Documents/Yoga_Training_Log/Training_Log_App'
global_constants = require('./../util/global_constants')
var DEBUG = global_constants.DEBUG
const start_time = Date.now()
const et = require(base_dir + '/util/elapsed_time')
console.log('loaded home_get', et(start_time))
DEBUG = false
const express = require('express');
const router = express.Router();
router.get('/', (req, res, next) => {
    var DEBUG = false
    if (DEBUG) console.log('15 home_get', et(start_time))
    var join_categories_to_workouts = `
        SELECT category_position, isClosed, category_subheading, categories.category_name, workouts.workout_name,
        workout_url, date_array, toRepeat, workout_length, workout_comment, workouts.id
        FROM categories 
        INNER JOIN categories_to_workouts 
        on categories.category_name = categories_to_workouts.category_name
        INNER JOIN workouts
        on categories_to_workouts.workout_name = workouts.workout_name
        ORDER BY category_position, last_date DESC
    `
    const express = require('express');
    const app = express();
    const db = global_constants.db
    const exported_head = require("./../util/read_head")
    const modify_workout = require('./../routes/modify_workout')
    app.use('/../routes', modify_workout)
    var workout_array = []
    var workouts_htmlGLOBAL = ''

    async function write_html(workout_array) {
        var last_category = -1 // Flag to show that we are on the last category
        if (workout_array.length>0) {
            if (DEBUG) {console.log('36 in write_html: ', workout_array[0]['workout_name'], et(start_time))}
            }
        else {console.log('38 in write_html workout_array: ', workout_array, et(start_time))}
        if (DEBUG) console.log('39 in write_html: ', et(start_time))
        for (let i = 0; i < workout_array.length; i++) {
            // Check for end of a category
            if (last_category != workout_array[i].category_position) {
                if (last_category != -1) {
                    write_details_end_html()
                }
                write_details_beginning_html(workout_array[i])
            }
            write_workouts(workout_array[i])
            last_category = workout_array[i].category_position
        }
        if (workout_array.length > 0) {
            write_details_end_html()
            if (DEBUG) console.log('53 workouts_htmlGLOBAL', workouts_htmlGLOBAL.substring(0, 15), et(start_time))
            if (typeof workouts_htmlGLOBAL === 'undefined') {} else {
                if (workouts_htmlGLOBAL.substring(0, 15) == '[object Object]') {
                    workouts_htmlGLOBAL = workouts_htmlGLOBAL.substring(16)
                }
            }
        }
        if (DEBUG) console.log('60 write_html (res stuff here) ', workouts_htmlGLOBAL.substring(0,20), et(start_time))
            res.end( exported_head.training_log_head_html + workouts_htmlGLOBAL); // Error [ERR_STREAM_WRITE_AFTER_END]: write after end
    }

    function write_details_end_html() {
        workouts_htmlGLOBAL
        if (workouts_htmlGLOBAL > 0) {
            workouts_htmlGLOBAL == '</ul></details>'
            if (DEBUG) console.log('68 workouts_htmlGLOBAL', workouts_htmlGLOBAL)
        } else {
            workouts_htmlGLOBAL = workouts_htmlGLOBAL + '</ul></details>'
        }
    }

    function write_details_beginning_html(workout_row) {
        if (workout_row.isClosed == 0) details = 'open'
        else details = 'closed'
        if (workouts_htmlGLOBAL.length > 0) {
            workouts_htmlGLOBAL = workouts_htmlGLOBAL + `<details ${details}><summary>${workout_row.category_name}</summary>
    <ul class="workouts">`
        } else {
            workouts_htmlGLOBAL = `<details ${details}><summary>${workout_row.category_name}</summary>
    <ul class="workouts">`
        }
    }

    function write_workouts(workout_row) {
        var category_name = workout_row.category_name
        var add_date = `
            <form action="/modify_workout" method="POST">
                <input type="hidden" name="name" id="name" autocomplete="false" value=${workout_row.id}>
                <input type="hidden"  name="category_name" id="category_name" autocomplete="false" type="text" value="${category_name}">
                <button type="submit" class="block">+</button>
            </form> 
            `
        strong_a = ' '
        strong_b = ' '
        if ((workout_row.toRepeat == 'Y') || (workout_row.toRepeat == '1')) {
            strong_a = '<strong>'
            strong_b = '</strong>'
        }
        workout = `
            <li id="wo_${workout_row.id}" "class="workout" >
            <div class="flex-container" "push_button">
                <div>
                ${add_date}
                </div>
                <div>   
                <a href="${workout_row.workout_url}"
                    target="_blank" rel="noopener noreferrer" 
                    class="link">${strong_a}${workout_row.workout_name}${strong_b}</a>
                </div>  
                <div class="length">${workout_row.workout_length}</div>
                <div class="separator">-</div>
                <div class="dates">${workout_row.date_array}</div>
                <div class="comments">${workout_row.workout_comment}</div>
                </div>
            </li>
        `
        workouts_htmlGLOBAL = workouts_htmlGLOBAL + workout
    }

    async function init() {
        try {
            if (DEBUG) console.log('1 home_get db', db, et(start_time))
            await db.open('./db/training_log.db'); // create a sqlite3.Database object & open the database on the passed filepath.
            workout_array = await db.all(join_categories_to_workouts, [], (err, rows) => {
               if(err) {console.log('*** Error in db.open: ', err)}      
            })
            await write_html(workout_array)
            db.close()
        } catch (err) {
            console.log('***132 Promise error in home_get***', err, et(start_time))
        }
    }

    init();
    if (DEBUG) console.log('137 home_get after init()', et(start_time))
    // res.end(exported_head.training_log_head_html + workouts_htmlGLOBAL);
})
module.exports = router;