module.exports = function () {
    // This function retrieves workouts from the database and creates the html code
    console.log('loaded retrieve_workouts', Date.now())
    const express = require('express');
    const app = express();
    // const sqlite3 = require('sqlite3').verbose();
    const router = express.Router();
    module.exports = router;
    global_constants = require('./global_constants')
    INTERVAL_TIME = global_constants.INTERVAL_TIME
    db = global_constants.db
    DEBUG = global_constants.DEBUG
    const modify_workout = require('./../routes/modify_workout')
    app.use('/../routes', modify_workout)
    var workout_array = []
    var workouts_htmlGLOBAL = {}
    // Create the master file html file(categories and workouts)
    try {
        if (DEBUG) console.log('24 start retrieve_workouts: ', Date.now())
        let join_categories_to_workouts = `
      SELECT category_position, isClosed, category_subheading, categories.category_name, workouts.workout_name,
      workout_url, date_array, toRepeat, workout_length, workout_comment, workouts.id
      FROM categories 
      INNER JOIN categories_to_workouts 
      on categories.category_name = categories_to_workouts.category_name
      INNER JOIN workouts
      on categories_to_workouts.workout_name = workouts.workout_name
      ORDER BY category_position, last_date DESC
      `
        db.all(join_categories_to_workouts, [], (err, rows) => {
            workout_array = rows
            if (err) {
                console.log('32 error in join_categories_to_workouts in retrieve_workouts', Date.now(), err)
            }
        })
    } catch (e) {
        console.log('44 Did not retrieve data in retrieve_workouts:)', e) // Is this used? Yes
    }
    setTimeout(() => {
        workouts_html = write_html(workout_array)
        // This if/else probably isn't needed TODO delete if not 2/9/22
        if ((typeof workouts_html === 'undefined') || (typeof workouts_html === 'object')) {
            console.log('** 43 workouts_html is undefined or an object')
        } else {
            console.log('** 45 workouts_html', workouts_html)
            console.log('**46 (workouts_html.length', (workouts_html.length))
            if (workouts_html.length > 14) {
                console.log('** 48 workouts_html immediately after workouts_html = write_html(workout_array)', Date.now(), workouts_html.substring(0, 15), workouts_html.substring(16, 54))
                if (workouts_html.substring(0, 15) == '[object Object]') {
                    workouts_html = workouts_html.substring(16)
                    console.log('** 46 workouts_html after workouts_html = workouts_html.substring(15)', Date.now(), workouts_html.substring(0, 60))

                }
            }
        }
    }, INTERVAL_TIME * 0) // This delay needed 1/1/22, not needed 2/9/22 

    function write_html(workout_array) {
        workouts_htmlGLOBAL = {}
        var last_category = -1 // Flag to show that we are not on the last category
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
            if (typeof workouts_htmlGLOBAL === 'undefined') {
                if (DEBUG) console.log('75 workouts_htmlGLOBAL is undefined')
            } else {
                if (workouts_htmlGLOBAL.substring(0, 15) == '[object Object]') {
                    workouts_htmlGLOBAL = workouts_htmlGLOBAL.substring(16)
                    if (DEBUG) console.log('79 workouts_htmlGLOBAL in retrieve_workouts', Date.now(), workouts_htmlGLOBAL.substring(0, 50))
                }
            }
        }
        return workouts_htmlGLOBAL
    }

    function write_details_end_html() {
        if (workouts_htmlGLOBAL > 0) {
            workouts_htmlGLOBAL == '</ul></details>'
            console.log('** 103 workouts_htmlGLOBAL', workouts_htmlGLOBAL)
        } else {
            workouts_htmlGLOBAL = workouts_htmlGLOBAL + '</ul></details>'
            // console.log('** 92 workouts_htmlGLOBAL', workouts_htmlGLOBAL.substring(0, 60))
        }
    }

    function write_details_beginning_html(workout_row) {
        if (workout_row.isClosed == 1) details = 'open'
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
        // Put button and form on one line
        var add_date = `
    <form action="/modify_workout" method="POST">
      <input type="hidden" name="name" id="name" autocomplete="false" value=${workout_row.id}>
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
    setTimeout(() => {
        // module.workoutsGlobal = work_array
        if (DEBUG) console.log('127 setTimeout in retrieve_workouts', Date.now())
        workouts_html = write_html(workout_array)
    }, INTERVAL_TIME * 2) // This delay needed 1/1/22, however output indicates not so 1/22/22
    setTimeout(() => {
        // console.log('124 workouts_html in retrieve_workouts before return', Date.now(), workouts_html.substring(16, 54))
        // return workouts_html
    }, INTERVAL_TIME * 0) // This delay needed 1/1/22, however output indicates not so 1/22/22

    module.exports = router;

}