// TODO: Add description of what this routine does
// TODO Cleanup require('./../util/retrieve_workouts')
// Find out why workouts_html works and not workoutsHTML
const express = require('express');
const app = express()
const router = express.Router();
var retrieve_workouts = require('./../util/retrieve_workouts')
global_constants = require('./../util/global_constants')
edit_workout_globals = require('./../routes/edit_workout')
retrieve_workouts_globals = require('./../util/retrieve_workouts')
home_post = require('./../routes/home_post')
home_get = require('./../routes/home_get')
DEBUG = global_constants.DEBUG
INTERVAL_TIME = global_constants.INTERVAL_TIME
workout_actionGLOBAL = edit_workout_globals.workout_actionGLOBAL
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
  console.log('36 req.body in post_update_db_workout', Date.now(), req.body)
  // Check for existing category
  var select_categories = `
  SELECT id, category_name, category_position, isClosed, category_subheading
  FROM categories 
  WHERE category_name = '${category_name}'
  LIMIT 1
  `
  db.get(select_categories, [], (err, rows) => {
    if (err) {
      console.log('46 err post_update_db_workout: ', Date.now(), err)
      // TODO Add error handling here
    }

    if (workout_actionGLOBAL == 'Add') {
      try {
        last_dateSTR = date_array.split(',')[0]
        last_dateOBJ = new Date(last_dateSTR)
        last_date = last_dateOBJ.getTime()
      }
        catch(err) {
          console.log('55 err: ', err, '\n')
        }
      if (DEBUG) console.log('57 db.run Update in Add', Date.now())
      if (rows == undefined) {
        console.log(Date.now(), 'Category Does Not Exist. Capability to be added. In the meantime add using DB Browser.')
        res.end('/')
      } else {
        table = 'categories_to_workouts'
        db.run(`INSERT INTO ${table} (workout_name, category_name) 
                    VALUES(?, ?)`, [workout_name, category_name]);
        console.log('60 db_return for categories_to_workouts', Date.now())
        if (err) {
          console.log('62 update error in Add in post_update_db_workout: ', err)
        }
      }
      setTimeout(() => {
        if (DEBUG) console.log('\n71', Date.now(), workout_name, workout_url, date_array, workout_length, toRepeat, workout_comment, last_date)
        table = 'workouts'
        db.run(`INSERT INTO ${table} (workout_name, workout_url, date_array, workout_length, toRepeat, workout_comment, last_date) 
                    VALUES(?, ?, ?, ?, ?, ?, ?)`, [workout_name, workout_url, date_array, workout_length, toRepeat, workout_comment, last_date]);
      }, INTERVAL_TIME * 1)
      setTimeout(() => {
          if (DEBUG) console.log('74 call retrieve_workouts from Add in post_update_db_workouts', Date.now())
          workoutsHTML = retrieve_workouts()
          console.log('76 retrieving workouts in post_db_workout: ', workouts_html.substring(500, 540))
        },
        INTERVAL_TIME * 2)
      setTimeout(() => {
        if (DEBUG) console.log('79 call home_get in post_update_db_workout (Add)', Date.now())
        app.get('./../routes/home_get', (req, res, next) => {
          console.log('81 in post_update_db_workout (Add)', Date.now())
        })
        console.log('83 home_get in post_db_workout (Add)', Date.now())
      }, INTERVAL_TIME * 3) // This delay is needed 1/1/22
      setTimeout(() => {
        console.log('88 res.redirect in post_db_workout:', Date.now())
        res.redirect("/") // this works 1/28/22
      }, INTERVAL_TIME * 4) // Set to 0 1/1/22, reset on 1/6/22 after adding functionality
    }

    if (workout_actionGLOBAL == 'Edit') {
      console.log('88 db.run Update in Edit', Date.now())

      try {
        last_dateSTR = date_array.split(',')[0]
        last_dateOBJ = new Date(last_dateSTR)
        last_date = last_dateOBJ.getTime()
      }
        catch(err) {
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
        if (DEBUG) console.log('117 call home_get in post_update_db_workout (Edit)', Date.now())
        app.get('./../routes/home_get', (req, res, next) => {})
      }, INTERVAL_TIME * 2) // This delay is needed 1/1/22

      setTimeout(() => {
        res.redirect("/")
        if (DEBUG) console.log('125 res.redirect in post_update_db_workout (Edit)', Date.now())
      }, INTERVAL_TIME * 3) // Set to 0 1/1/22, reset on 1/6/22 after adding functionality
    }

    if (workout_actionGLOBAL == 'Edit Categories') {
      workout_name = workoutGLOBAL.workout_name
      delete_from_category_name = ''
      console.log('143 db.run Update in Edit Categories in post_update_db_workouts', Date.now(), workout_name)
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
      // console.log('154 join_categories_to_workout in post_update_db_workouts:\n', join_categories_to_workout)
      db.all(join_categories_to_workout, [], (err, rows) => {
        workout_array = rows
        console.log('156 in post_update_db_workouts', workout_name)
        console.log('157 in post_update_db_workout.js category_inputs', category_inputs)
        if (err) {
          console.log('Error in join_categories_to_workouts in post_update_workouts', Date.now(), err)
        }
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
            // for (let i = 0; i < 1; i++) {
            if (workout_array[i].category_name == key) {
              console.log('xx178 ', workout_array[i].category_name, ' is already in categories to workouts')
              in_workout_array_flag = 1;
            }
          }
          if (in_workout_array_flag == 0) {
            console.log('xx180 Inserting ', key, workout_name, ' into categories_to_workout')
            db.run(`INSERT INTO categories_to_workouts (category_name, workout_name) 
                    VALUES(?, ?)`, [key, workout_name]);
          }
        }
        // TODO: add line to add new category checkbox line, and add new category

        // If category is not checked but in categories_to_workout:
        // console.log('xx187 workout_array:\n', workout_array)
        for (let i = 0; i < workout_array.length; i++) {
          console.log('\nxx190 workout_array[i].category_name in post_update_db_workouts:', workout_array[i].category_name)
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
            console.log('xx198 Delete ', delete_from_category_name, workout_name, ' from categories_to_workout')
            db.run(`DELETE FROM categories_to_workouts
            WHERE category_name = '${delete_from_category_name}'
            AND workout_name = '${workout_name}';`)
          }
        }
      })

      //TODO: See about moving this code outside of the if statements
      setTimeout(() => {
          workoutsHTML = retrieve_workouts()
          // if (DEBUG) console.log('166 retrieving workouts in post_db_workout: ', Date.now(), '\n', workouts_html.substring(500, 540))
        },
        INTERVAL_TIME * 1)

      setTimeout(() => {
        if (DEBUG) console.log('171 call home_get in post_update_db_workout (Edit)', Date.now())
        app.get('./../routes/home_get', (req, res, next) => {})

      }, INTERVAL_TIME * 2) // This delay is needed 1/1/22

      setTimeout(() => {
        res.redirect("/") 
        if (DEBUG) console.log('125 res.redirect in post_update_db_workout (Edit)', Date.now())
      }, INTERVAL_TIME * 3) // Set to 0 1/1/22, reset on 1/6/22 after adding functionality
    }
  })
})
module.exports = router;