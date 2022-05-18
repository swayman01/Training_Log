// TODO: Add description of what this routine does
function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}
function getMinOfArray(numArray) {
  return Math.min.apply(null, numArray);
}
const express = require('express');
const app = express()
const router = express.Router();
var retrieve_workouts = require('./../util/retrieve_workouts')
const RESERVED_KEY = 'x_new_category_x'
const RESERVED_NAME = 'x_new_category_name_x'
const global_constants = require('./../util/global_constants')
const base_dir = global_constants.base_dir
const start_time = Date.now()
const et = require(base_dir + '/util/elapsed_time')
const edit_workout_globals = require('./../routes/edit_workout')
const edit_categories_globals = require('./../routes/edit_categories')
var DEBUG = global_constants.DEBUG
const INTERVAL_TIME = global_constants.INTERVAL_TIME
const workout_actionGLOBAL = edit_workout_globals.workout_actionGLOBAL
var category_arrayGLOBAL = edit_categories_globals.category_array
const db1 = global_constants.db1
if (DEBUG) console.log('loaded post_update_db_workout.js', et(start_time))
router.post('/update_db_workout', (req, res) => {
  var category_name = req.body.category_name;
  var table = 'workouts'
  var workout_name = req.body.workout_name;
  var workout_url = req.body.workout_url;
  var date_array = req.body.workout_date;
  var category_inputs = req.body
  var last_dateOBJ = new Date(date_array)
  var last_date = last_dateOBJ.getTime()
  if (isNaN(last_date)) last_date = 0
  var workout_length = req.body.workout_length;
  var toRepeat = req.body.toRepeat
  var workout_comment = req.body.workout_comment;
  var modify_workout_globals = require('./../routes/modify_workout')
  var workout_actionGLOBAL = modify_workout_globals.workout_actionGLOBAL
  // Check for existing category
  var select_categories = `
    SELECT id, category_name, category_position, isClosed, category_subheading
    FROM categories 
    WHERE category_name = '${category_name}'
    LIMIT 1
    `
  db1.get(select_categories, [], (err, rows) => {
    if (err) {
      console.log('***52 err post_update_db_workout: ' , err, et(start_time))
      // TODO Add error handling here
    }

    if (workout_actionGLOBAL == 'Add') {
      try {
        last_dateSTR = date_array.split(',')[0]
        last_dateOBJ = new Date(last_dateSTR)
        last_date = last_dateOBJ.getTime()
      } catch (err) {
        console.log('***62 err post_update_db_workout: : ', err, '\n', et(start_time))
      }
      if (DEBUG) console.log('64 db1.run Add in post_update_db.workout', et(start_time))
      if (rows == undefined) {
        console.log('Category Does Not Exist. Capability to be added. In the meantime add using DB Browser.', et(start_time))
        res.end('/')
      } else {
        table = 'categories_to_workouts'
        db1.run(`INSERT INTO ${table} (workout_name, category_name) 
                    VALUES(?, ?)`, [workout_name, category_name]);
        console.log('72 db_return for categories_to_workouts', et(start_time))
        if (err) {
          console.log('74 update error in Add in post_update_db_workout: ', err)
        }
      } // end else
      // setTimeout(() => {
        // if (DEBUG) console.log('\n78', Date.now(), workout_name, workout_url, date_array, workout_length, toRepeat, workout_comment, last_date)
        table = 'workouts'
        db1.run(`INSERT INTO ${table} (workout_name, workout_url, date_array, workout_length, toRepeat, workout_comment, last_date) 
                    VALUES(?, ?, ?, ?, ?, ?, ?)`, [workout_name, workout_url, date_array, workout_length, toRepeat, workout_comment, last_date]);
      // }, INTERVAL_TIME * 1)
      // setTimeout(() => {
          // if (DEBUG) console.log('84 call retrieve_workouts from Add in post_update_db_workouts', Date.now())
          // workoutsHTML = 'retrieve_workouts()'
          // console.log('86 retrieving workouts in post_db_workout: ', workoutsHTML)
        // }, INTERVAL_TIME * 2)
      // setTimeout(() => {
        if (DEBUG) console.log('90 call home_get in post_update_db_workout (Add)', et(start_time))
        app.get('./../routes/home_get', (req, res, next) => {
          console.log('91 in post_update_db_workout (Add)', et(start_time))
        })
        console.log('93 home_get in post_db_workout (Add)', et(start_time))
      // }, INTERVAL_TIME * 3) // This delay is needed 1/1/22
      // setTimeout(() => {
        console.log('96 res.redirect in post_db_workout:', et(start_time))
        res.redirect("/") // this works 1/28/22
      // }, INTERVAL_TIME * 4) // Set to 0 1/1/22, reset on 1/6/22 after adding functionality
    }

    if (workout_actionGLOBAL == 'Edit') {
      console.log('100 db1.run Update in Edit', et(start_time))
      last_dateSTR = date_array.split(',')[0]
      last_dateOBJ = new Date(last_dateSTR)
      last_date = last_dateOBJ.getTime()
      
      db1.run(`UPDATE ${table} 
          SET workout_url = "${workout_url}",
          date_array = "${date_array}",
          workout_length = "${workout_length}",
          toRepeat = "${toRepeat}",
          workout_comment = "${workout_comment}",
          last_date = "${last_date}"
          WHERE id = "${workoutGLOBAL.id}"
          `, [], (err, rows) => {
      if (err) {
        console.log('120 update error in EDIT post_update_db_workout: ', err, et(start_time))
      }
    }) // end db1.run(UPDATE)

      // setTimeout(() => {
          if (DEBUG) console.log('124 call retrieve_workouts from post_update_workout ', et(start_time))
          res.redirect("/") 
        // }, INTERVAL_TIME * 1)
 
    if (workout_actionGLOBAL == 'Edit Categories') {
      // Get all the categories associated with the selected workout
      workout_name = workoutGLOBAL.workout_name
      delete_from_category_name = ''
      console.log('132 db1.run Update in Edit Categories in post_update_db_workouts', workout_name, et(start_time))
      let join_categories_to_workout = `
              SELECT category_position, isClosed, category_subheading, categories.category_name, workouts.workout_name,
              workout_url, date_array, toRepeat, workout_length, workout_comment, workouts.id
              FROM categories 
              INNER JOIN categories_to_workouts 
              on categories.category_name = categories_to_workouts.category_name
              INNER JOIN workouts
              on categories_to_workouts.workout_name = workouts.workout_name
              WHERE workouts.workout_name = '${workout_name}'
              `
      // Retrieve categories selected for chosen workout
      db1.all(join_categories_to_workout, [], (err, rows) => {
        workout_array = rows
        // Ensure at least one box is checked
        if ((Object.keys(category_inputs).length == undefined) || (Object.keys(category_inputs).length == 0)) {
          console.log('*** ERROR: Each workout must have at least on category')
          // TODO: Reload edit_categories page
          res.redirect("/")
        }
        // If category is checked but not in categories_to_workout add entry in categories to workout
        for (const [key, value] of Object.entries(category_inputs)) {
          // console.log('\nxx170 key, value in post_update_db_workouts:', key, value)
          in_workout_array_flag = 0;
          for (let i = 0; i < workout_array.length; i++) {
            if (workout_array[i].category_name == key) {
              console.log('158 in post_updater_db_workout', workout_array[i].category_name, ' is already in categories to workouts')
              in_workout_array_flag = 1;
            }
          }
          if ((in_workout_array_flag == 0) && (value == 'on')) {
            if (key == RESERVED_KEY) category_name = category_inputs[RESERVED_NAME]
            else category_name = key
            // TODO Check to see if key is a category name
            console.log('166 Inserting ', category_name, workout_name, ' into categories_to_workout', et(start_time))
            db1.run(`INSERT INTO categories_to_workouts (category_name, workout_name) 
                    VALUES(?, ?)`, [category_name, workout_name]);
          }
        }
        // If category is not checked but in categories_to_workout remove category from workout
        for (let i = 0; i < workout_array.length; i++) {
          console.log('173 workout_array[i].category_name in post_update_db_workouts:', workout_array[i].category_name, et(start_time))
          in_workout_array_flag = 0;
          for (const [key, value] of Object.entries(category_inputs)) {
            console.log('\nxx192 key, value in post_update_db_workouts:', key, value)
            delete_from_category_name = workout_array[i].category_name
            if (workout_array[i].category_name == key) {
              console.log('xx194 keep', workout_array[i].category_name)
              in_workout_array_flag = 1;
            }
          }
          if (in_workout_array_flag == 0) {
            console.log('xx191 Delete ', delete_from_category_name, workout_name, ' from categories_to_workout\n')
            db1.run(`DELETE FROM categories_to_workouts
                      WHERE category_name = '${delete_from_category_name}'
                      AND workout_name = '${workout_name}';`)
          }
        }

        if (category_inputs[RESERVED_KEY] == 'on') {
          console.log('xx199 User wants to create new category:', category_inputs[RESERVED_NAME])
          // Check for reserved name and key
          if (category_inputs[RESERVED_NAME] == RESERVED_NAME) {
            console.log('ERROR: ', RESERVED_NAME, 'is a reserved name, use a different category name')
          }
          category_arrayGLOBAL = edit_categories_globals.category_arrayGLOBAL
          // if add new category and name is unique insert into categories
          category_name_exists_flag = 0
          for (let i = 0; i < category_arrayGLOBAL.length; i++) {
            console.log('xx220 category_inputs[RESERVED_NAME],category_arrayGLOBAL[i].category_name) ', category_inputs[RESERVED_NAME], category_arrayGLOBAL[i].category_name)
            if (category_inputs[RESERVED_NAME] == category_arrayGLOBAL[i].category_name) {
              category_name_exists_flag = 1
            }
          }
          if (category_name_exists_flag == 1) console.log('222 ', category_inputs[RESERVED_NAME], 'is already in use')
          else {
            category_name = category_inputs[RESERVED_NAME]
            // TODO Pull these values from form
            category_is_unique = 0
            isClosed = 0
            category_position = 10
            // TODO Category position must be unique
            var available_positions = new Set()
            var used_positions = new Set()
            var used_positionsARRAY = []
            for (let i = 0; i < category_arrayGLOBAL.length; i++) {
              used_positions.add(category_arrayGLOBAL[i].category_position)
              used_positionsARRAY.push(category_arrayGLOBAL[i].category_position)
            }
            for (let i = 11; i < (getMaxOfArray(used_positionsARRAY) + 2); i++) {
              available_positions.add(i)
            }
            used_positions.forEach(function (value) {
              available_positions.delete(value)
            })
            available_positionsARRAY = []
            available_positions.forEach(function (value) {
              available_positionsARRAY.push(value)
            })
            category_position = getMinOfArray(available_positionsARRAY)
            console.log('xx251 Inserting ', category_name, category_position, ' into categories')
            db1.run(`
                          INSERT INTO categories(category_name, category_position, isClosed)
                          VALUES( ? , ? , ? )
                          `, [category_name, category_position, isClosed]);
          }
        }
        category_arrayGLOBAL = edit_categories_globals.category_array
        // Create dictionary of changes to avoid index changes
        changesDICT = {}
        for (let i = 0; i < category_arrayGLOBAL.length; i++) {
          change_flag = 0
          if (category_arrayGLOBAL[i].category_position != category_inputs.position[i]) {
            change_flag = 1 
          }
          if (category_arrayGLOBAL[i].isClosed != category_inputs.details[i]) {
            change_flag = 1 
          }
          if (change_flag) {
            position = category_inputs.position[i]
            isClosed = category_inputs.details[i]
            category_name = category_arrayGLOBAL[i].category_name
            changesDICT[category_name] = {'category_position': position, 'isClosed': isClosed}
            // setTimeout(() => {
              for (const [key, value] of Object.entries(changesDICT)) {
                category_name = key
                category_position = changesDICT[category_name]['category_position']
                isClosed = changesDICT[category_name]['isClosed']
                db1.run(`UPDATE categories 
                SET category_position = "${category_position}",
                isClosed = "${isClosed}"
                WHERE category_name = "${category_name}"
                `)
                if (err) {
                  console.log('286 update error in post_update_db_workout: ', err)
                  }
                }
              // }, INTERVAL_TIME * 1)
          }
        }
        // TODO See about moving this code outside of the if statements
      })

  //     setTimeout(() => {
  //         workoutsHTML = 'retrieve_workouts()'
  //         // if (DEBUG) console.log('166 retrieving workouts in post_db_workout: ', Date.now(), '\n', workouts_html.substring(500, 540))
  //       },
  //       INTERVAL_TIME * 2)

  //     setTimeout(() => {
  //       if (DEBUG) console.log('171 call home_get in post_update_db_workout (Edit)', Date.now())
  //       app.get('./../routes/home_get', (req, res, next) => {})
  //     }, INTERVAL_TIME * 3) // This delay is needed 1/1/22

  //     setTimeout(() => {
  //       res.redirect("/")
  //       if (DEBUG) console.log('125 res.redirect in post_update_db_workout (Edit)', Date.now())
  //     }, INTERVAL_TIME * 4) // Set to 0 1/1/22, reset on 1/6/22 after adding functionality      
    }
    }
  })
})

module.exports = router;