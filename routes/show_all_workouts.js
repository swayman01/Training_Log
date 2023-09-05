// This routine shows all of the workouts, sorted from used most to least
// It is useful for searching all workouts or for analyzing use
//TODO Add other sort options
const path = require('path')
const base_dir = path.dirname(path.resolve(__dirname))
const express = require('express');
const router = express.Router();
const global_constants = require(base_dir + '/util/global_constants');
const home_get_variables = require(base_dir + '/routes/home_get');
const start_time = Date.now();
const et = require(base_dir + '/util/elapsed_time');
const format_date_array = require(base_dir + '/util/format_date_array')
const write_workouts = require(base_dir + '/util/write_workouts')
// const db = global_constants.db
// const db1 = global_constants.db1
const exported_head = require(base_dir + '/util/read_head');
const return_uncategorized_html = `
<form class = "return_to_uncategorized" >
    <input type="submit" value="Return to Categorized Workouts" class = "return_to_uncategorized" formaction="/">
</form> 
<br>
`
var all_workouts_array = '';
var all_workouts_html = ''
var DEBUG = global_constants.DEBUG;
DEBUG = true
console.log('show_all_workouts.js', et(start_time))
router.post('/show_all_workouts', (req, res) => {
    console.log('in show_all_workouts', et(start_time))
    async function write_all_html(all_workouts_array_1) {
        var all_workouts_html = ''
        for (let i = 0; i < all_workouts_array_1.length; i++) {
            all_workouts_array_1[i].date_array = format_date_array(all_workouts_array_1[i]);
            // per https://stackoverflow.com/questions/49938266/how-to-return-values-from-async-functions-using-async-await-from-function
            // if (DEBUG) console.log('41 show_all_workouts date_array', all_workouts_array[i].last_date, all_workouts_array[i].workout_name)
            workout = write_workouts(all_workouts_array_1[i])
            all_workouts_html = all_workouts_html + workout;
        }
        res.end(exported_head.training_log_head_html + return_uncategorized_html + all_workouts_html);
    }

    // async function getWorkouts(workout) {
    //     return write_workouts(workout);
    // } // Didn't work 7/15/23
    
    async function init() {
        try {
            if (req.body.sortby === "sortby_recent") sort_method = 'last_date DESC'
            if (req.body.sortby === "sortby_used") sort_method = 'last_date DESC'
            if (req.body.sortby === "sortby_length") sort_method = 'workout_length DESC'
            // module.exports.workout_array = workout_array  // for use in edit_categories
            var select_workouts = `
                SELECT workout_name, workout_url, date_array, toRepeat, workout_length, workout_comment, last_date, workouts.id
                FROM workouts 
                ORDER BY ${sort_method}
                `
            all_workouts_array = 'blank'
            var { PromisedDatabase } = require("promised-sqlite3");
            var db = new PromisedDatabase();
            if (DEBUG) console.log('69 show_all_workouts db', db, et(start_time))
            await db.open('./db/practice_training_log.db'); // create a sqlite3.Database object & open the database on the passed filepath.
            all_workouts_array = await db.all(select_workouts, [], (err, rows) => {
                if (DEBUG) console.log('64 in show_all_workouts init rows', rows)
                if (err) {
                    console.log('*** Error in db.open: ', err)
                }
            })
            await db.close()

            if (req.body.sortby === "sortby_recent") {
                all_workouts_array = all_workouts_array.sort(function (a, b) {
                    return b.last_date - a.last_date
                })
            }

            if (req.body.sortby === "sortby_used") {
//Not working
                //loop and add times used to all workouts_array
                var workout_dates_array = []
                var workout_dates_length = 0
                for (let i = 0; i < all_workouts_array.length; i++) {
                    workout_dates_array = all_workouts_array[i].date_array.split(',')
                    workout_dates_length = workout_dates_array.length
                    // console.log('88 workout_dates_length, last_element',all_workouts_array[i].workout_name, workout_dates_length, workout_dates_array[workout_dates_length-1])
                    // Quick check for date format
                    // SOMEDAY: Make date check more robust
                    if (workout_dates_array[workout_dates_array.length - 1].length === 0) {
                        workout_dates_length = workout_dates_array.length - 1
                    }
                    all_workouts_array[i].used = workout_dates_length
                }
                // Reference https://stackoverflow.com/questions/42870356/how-can-i-sort-an-array-of-dictionaries-by-its-key
                all_workouts_array = all_workouts_array.sort(function (a, b) {
                    return b.used - a.used
                })
                // for (let i = 0; i < all_workouts_array.length; i++) console.log(all_workouts_array[i].workout_name, all_workouts_array[i].used) 
            }

            if (req.body.sortby === "sortby_length") {
// Not removing parenthesis

                // const workout_lengthREG = new RegExp('(^([0-1]?\d|2[0-3]):([0-5]?\d):([0-5]?\d)$)|(^([0-5]?\d):([0-5]?\d)$)|(^[0-5]?\d$) ')
                const length_hhmmssREG = new RegExp(/\d{1,2}:\d{1,2}:\d{1,2}/)
                const length_mmssREG = new RegExp(/\d{1,2}:\d{1,2}/)
                //loop and add times used to all workouts_array
                for (let i = 0; i < all_workouts_array.length; i++) {
                    if (length_hhmmssREG.test(all_workouts_array[i].workout_length)) {
                        let array_input = length_hhmmssREG.exec(all_workouts_array[i].workout_length).input
                        let timeARRAY = array_input.split(":")
                        let timeINT = parseInt(timeARRAY[0]) * 3600 + parseInt(timeARRAY[1]) * 60 + parseInt(timeARRAY[2])
                        all_workouts_array[i].workout_lengthINT = timeINT
                        // console.log("conversion check: ", all_workouts_array[i].workout_length, all_workouts_array[i].workout_lengthINT)
                    }
                    else {
                        if (length_mmssREG.test(all_workouts_array[i].workout_length)) {
                            let array_input = length_mmssREG.exec(all_workouts_array[i].workout_length).input
                            let timeARRAY = array_input.split(":")
                            let timeINT = parseInt(timeARRAY[0]) * 60 + parseInt(timeARRAY[1])
                            all_workouts_array[i].workout_lengthINT = timeINT
                            if (isNaN(parseInt(timeARRAY[0]) * 60 + parseInt(timeARRAY[1]))) {
                                console.log('pause', all_workouts_array[i].workout_length)
                            }
                            // console.log("conversion check: ", all_workouts_array[i].workout_length, all_workouts_array[i].workout_lengthINT)
                    }
                        else console.log(all_workouts_array[i].workout_name, all_workouts_array[i].workout_length, 'not formatted')
                    }
                }
                // Reference https://stackoverflow.com/questions/42870356/how-can-i-sort-an-array-of-dictionaries-by-its-key
                all_workouts_array = all_workouts_array.sort(function (a, b) {
                    return b.workout_lengthINT - a.workout_lengthINT
                })
            }
            await write_all_html(all_workouts_array)
        } catch (err) {
            console.log('*** Promise error in home_get***', err, et(start_time))
        }
    }
    

    init();
    // TODO: move res.end to write_all_workouts
    // res.end(exported_head.training_log_head_html + all_workouts_button + all_workouts_html);
})
module.exports = router;