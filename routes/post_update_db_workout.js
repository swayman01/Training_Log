// TODO: Add description of what this routine does
// TODO Cleanup require('./../util/retrieve_workouts')
// Find out why workouts_html works and not workoutsHTML
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
global_constants = require('./../util/global_constants')
edit_workout_globals = require('./../routes/edit_workout')
edit_categories_globals = require('./../routes/edit_categories')
retrieve_workouts_globals = require('./../util/retrieve_workouts')
home_post = require('./../routes/home_post')
home_get = require('./../routes/home_get')
DEBUG = global_constants.DEBUG
INTERVAL_TIME = global_constants.INTERVAL_TIME
workout_actionGLOBAL = edit_workout_globals.workout_actionGLOBAL
category_arrayGLOBAL = edit_categories_globals.category_array
modify_workout_globals = require('./../routes/modify_workout')
db = global_constants.db
training_log_head_html = exported_variables.training_log_head_html
if (DEBUG) console.log('loaded post_update_db_workout.js', Date.now())
router.post('/update_db_workout', (req, res) => {
  category_name = req.body.category_name;
  table = 'workouts'
  workout_name = req.body.workout_name;
  workout_url = req.body.workout_url;
  date_array = req.body.workout_date;
  category_inputs = req.body
  last_dateOBJ = new Date(date_array)
  last_date = last_dateOBJ.getTime()
  if (isNaN(last_date)) last_date = 0
  workout_length = req.body.workout_length;
  toRepeat = req.body.toRepeat
  workout_comment = req.body.workout_comment;
  // Check for existing category
  var select_categories = `
    SELECT id, category_name, category_position, isClosed, category_subheading
    FROM categories 
    WHERE category_name = '${category_name}'
    LIMIT 1
    `
  db.get(select_categories, [], (err, rows) => {
    if (err) {
      console.log('52 err post_update_db_workout: ', Date.now(), err)
      // TODO Add error handling here
    }

    if (workout_actionGLOBAL == 'Add') {
      try {
        last_dateSTR = date_array.split(',')[0]
        last_dateOBJ = new Date(last_dateSTR)
        last_date = last_dateOBJ.getTime()
      } catch (err) {
        console.log('62 err: ', err, '\n')
      }
      if (DEBUG) console.log('64 db.run Update in Add', Date.now())
      if (rows == undefined) {
        console.log(Date.now(), 'Category Does Not Exist. Capability to be added. In the meantime add using DB Browser.')
        res.end('/')
      } else {
        table = 'categories_to_workouts'
        db.run(`INSERT INTO ${table} (workout_name, category_name) 
                    VALUES(?, ?)`, [workout_name, category_name]);
        console.log('72 db_return for categories_to_workouts', Date.now())
        if (err) {
          console.log('74 update error in Add in post_update_db_workout: ', err)
        }
      } // end else
      setTimeout(() => {
        if (DEBUG) console.log('\n78', Date.now(), workout_name, workout_url, date_array, workout_length, toRepeat, workout_comment, last_date)
        table = 'workouts'
        db.run(`INSERT INTO ${table} (workout_name, workout_url, date_array, workout_length, toRepeat, workout_comment, last_date) 
                    VALUES(?, ?, ?, ?, ?, ?, ?)`, [workout_name, workout_url, date_array, workout_length, toRepeat, workout_comment, last_date]);
      }, INTERVAL_TIME * 1)
      setTimeout(() => {
          if (DEBUG) console.log('84 call retrieve_workouts from Add in post_update_db_workouts', Date.now())
          workoutsHTML = retrieve_workouts()
          console.log('76 retrieving workouts in post_db_workout: ', workouts_html.substring(500, 540))
        },
        INTERVAL_TIME * 2)
      setTimeout(() => {
        if (DEBUG) console.log('90 call home_get in post_update_db_workout (Add)', Date.now())
        app.get('./../routes/home_get', (req, res, next) => {
          console.log('81 in post_update_db_workout (Add)', Date.now())
        })
        console.log('94 home_get in post_db_workout (Add)', Date.now())
      }, INTERVAL_TIME * 3) // This delay is needed 1/1/22
      setTimeout(() => {
        console.log('97 res.redirect in post_db_workout:', Date.now())
        res.redirect("/") // this works 1/28/22
      }, INTERVAL_TIME * 4) // Set to 0 1/1/22, reset on 1/6/22 after adding functionality
    }

    if (workout_actionGLOBAL == 'Edit') {
      console.log('88 db.run Update in Edit', Date.now())

      try {
        last_dateSTR = date_array.split(',')[0]
        last_dateOBJ = new Date(last_dateSTR)
        last_date = last_dateOBJ.getTime()
      } catch (err) {
        console.log('104 err: ', err, '\n')
      }

      db.run(`UPDATE ${table} 
          SET workout_url = "${workout_url}",
          date_array = "${date_array}",
          workout_length = "${workout_length}",
          toRepeat = "${toRepeat}",
          workout_comment = "${workout_comment}",
          last_date = "${last_date}"
          WHERE id = "${workoutGLOBAL.id}"
          `)
      if (err) {
        console.log('117 update error in post_update_db_workout: ', err)
      }

      setTimeout(() => {
          if (DEBUG) console.log('121 call retrieve_workouts from post_update_workout ', Date.now())
          workoutsHTML = retrieve_workouts()
          console.log('112 retrieving workouts in post_db_workout: ', Date.now(), '\n', workouts_html.substring(500, 540))
        },
        INTERVAL_TIME * 1)

      setTimeout(() => {
        if (DEBUG) console.log('134 call home_get in post_update_db_workout (Edit)', Date.now())
        app.get('./../routes/home_get', (req, res, next) => {})
      }, INTERVAL_TIME * 2) // This delay is needed 1/1/22

      setTimeout(() => {
        res.redirect("/")
        if (DEBUG) console.log('140 res.redirect in post_update_db_workout (Edit)', Date.now())
      }, INTERVAL_TIME * 3) // Set to 0 1/1/22, reset on 1/6/22 after adding functionality
    }

    if (workout_actionGLOBAL == 'Edit Categories') {
      // Get all the categories associated with the selected workout
      workout_name = workoutGLOBAL.workout_name
      delete_from_category_name = ''
      console.log('148 db.run Update in Edit Categories in post_update_db_workouts', Date.now(), workout_name)
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
      db.all(join_categories_to_workout, [], (err, rows) => {
        workout_array = rows
        // Ensure at least one box is checked
        if ((Object.keys(category_inputs).length == undefined) || (Object.keys(category_inputs).length == 0)) {
          console.log('ERROR: Each workout must have at least on category')
          // TODO: Reload edit_categories page
          res.redirect("/")
        }
        // If category is checked but not in categories_to_workout add entry in categories to workout
        for (const [key, value] of Object.entries(category_inputs)) {
          // console.log('\nxx170 key, value in post_update_db_workouts:', key, value)
          in_workout_array_flag = 0;
          for (let i = 0; i < workout_array.length; i++) {
            if (workout_array[i].category_name == key) {
              console.log('xx166 ', workout_array[i].category_name, ' is already in categories to workouts')
              in_workout_array_flag = 1;
            }
          }
          if ((in_workout_array_flag == 0) && (value == 'on')) {
            if (key == RESERVED_KEY) category_name = category_inputs[RESERVED_NAME]
            else category_name = key
            // TODO Check to see if key is a category name
            console.log('xx171 Inserting ', category_name, workout_name, ' into categories_to_workout')
            db.run(`INSERT INTO categories_to_workouts (category_name, workout_name) 
                    VALUES(?, ?)`, [category_name, workout_name]);
          }
        }
        // If category is not checked but in categories_to_workout remove category from workout
        for (let i = 0; i < workout_array.length; i++) {
          console.log('\nxx180 workout_array[i].category_name in post_update_db_workouts:', workout_array[i].category_name)
          in_workout_array_flag = 0;
          for (const [key, value] of Object.entries(category_inputs)) {
            // console.log('\nxx192 key, value in post_update_db_workouts:', key, value)
            delete_from_category_name = workout_array[i].category_name
            if (workout_array[i].category_name == key) {
              console.log('xx194 keep', workout_array[i].category_name)
              in_workout_array_flag = 1;
            }
          }
          if (in_workout_array_flag == 0) {
            console.log('xx191 Delete ', delete_from_category_name, workout_name, ' from categories_to_workout\n')
            db.run(`DELETE FROM categories_to_workouts
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
          // console.log('xx213 in post_update_db_workout', workout_actionGLOBAL, category_arrayGLOBAL, '\n', edit_categories_globals)
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
            // TODO Category position must be unique, add check
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
            db.run(`
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
            setTimeout(() => {
              for (const [key, value] of Object.entries(changesDICT)) {
                category_name = key
                category_position = changesDICT[category_name]['category_position']
                isClosed = changesDICT[category_name]['isClosed']
                db.run(`UPDATE categories 
                SET category_position = "${category_position}",
                isClosed = "${isClosed}"
                WHERE category_name = "${category_name}"
                `)
                if (err) {
                  console.log('286 update error in post_update_db_workout: ', err)
                  }
                }
              }, INTERVAL_TIME * 1)
          }
        }
        // TODO See about moving this code outside of the if statements
      })

      setTimeout(() => {
          workoutsHTML = retrieve_workouts()
          // if (DEBUG) console.log('166 retrieving workouts in post_db_workout: ', Date.now(), '\n', workouts_html.substring(500, 540))
        },
        INTERVAL_TIME * 2)

      setTimeout(() => {
        if (DEBUG) console.log('171 call home_get in post_update_db_workout (Edit)', Date.now())
        app.get('./../routes/home_get', (req, res, next) => {})
      }, INTERVAL_TIME * 3) // This delay is needed 1/1/22

      setTimeout(() => {
        res.redirect("/")
        if (DEBUG) console.log('125 res.redirect in post_update_db_workout (Edit)', Date.now())
      }, INTERVAL_TIME * 4) // Set to 0 1/1/22, reset on 1/6/22 after adding functionality      
    }
  })
})

module.exports = router;