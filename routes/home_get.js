// This file retrieves the data from the database, completes the html file and sends it to the server
// Reference: https://github.com/tguichaoua/promised-sqlite3
// TODO Delete unused classes see debug .txt Training_log, also workout is not used 
const path = require('path')
const base_dir = path.dirname(path.resolve(__dirname))
const global_constants = require(base_dir + '/util/global_constants')
const start_time = Date.now()
const et = require(base_dir + '/util/elapsed_time')
console.log('loaded home_get', et(start_time))
const express = require('express');
const router = express.Router();
const format_date_array = require(base_dir + '/util/format_date_array')
const create_category_array = require(base_dir + '/util/create_category_array')
router.get('/', (req, res, next) => {
    var DEBUG = global_constants.DEBUG
    // DEBUG = false
    if (DEBUG) console.log('16 home_get', et(start_time))
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
    const exported_head = require(base_dir + '/util/read_head')
    const modify_workout = require(base_dir + '/routes/modify_workout')
    app.use(base_dir + '/routes', modify_workout)
    var workout_array = []
    var workouts_htmlGLOBAL = ''

    async function write_html(workout_array) {
        module.exports.workout_array = workout_array  // for use in edit_categories
        var last_category = -1 // Flag to show that we are on the last category
        if (workout_array.length > 0) {
            if (DEBUG) console.log('40 in write_html: ', workout_array[0]['workout_name'], et(start_time))
            for (let i = 0; i < workout_array.length; i++) {
                workout_array[i].date_array = format_date_array(workout_array[i])
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
                if (DEBUG) console.log('55 workouts_htmlGLOBAL', workouts_htmlGLOBAL.substring(0, 15), et(start_time))
                if (typeof workouts_htmlGLOBAL === 'undefined') {} else {
                    if (workouts_htmlGLOBAL.substring(0, 15) == '[object Object]') {
                        workouts_htmlGLOBAL = workouts_htmlGLOBAL.substring(16)
                    }
                }
            }
            res.end(exported_head.training_log_head_html + workouts_htmlGLOBAL);
        }
    }

    function write_details_end_html() {
        workouts_htmlGLOBAL
        if (workouts_htmlGLOBAL > 0) {
            workouts_htmlGLOBAL == '</ul></details>'
            if (DEBUG) console.log('69 workouts_htmlGLOBAL', workouts_htmlGLOBAL)
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
            <span class="plus_button tooltip">
                <span class="tooltiptext">Click to Add or Edit Workouts</span>
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
        workouts_htmlGLOBAL = workouts_htmlGLOBAL + workout
    }

    async function init() {
        try {
            if (DEBUG) console.log('134 home_get db', db, et(start_time))
            await create_category_array()
            await db.open('./db/training_log.db'); // create a sqlite3.Database object & open the database on the passed filepath.
            workout_array = await db.all(join_categories_to_workouts, [], (err, rows) => {
            if(err) {console.log('*** Error in db.open: ', err)}      
            })
            await write_html(workout_array)
            db.close()
        } catch (err) {
            console.log('*** Promise error in home_get***', err, et(start_time))
        }
    }

    init();
    if (DEBUG) console.log('148 home_get after init()', et(start_time))
})
module.exports = router;