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
db = global_constants.db
training_log_head_html = exported_variables.training_log_head_html
// var workouts_htmlGLOBAL = ' '
if (DEBUG) console.log('loaded post_update_db_workout.js', Date.now())

router.post('/update_db_workout', (req, res) => {
  category_name = req.body.category_name;
  table = 'workouts'
  workout_name = req.body.workout_name;
  workout_url = req.body.workout_url;
  date_array = req.body.workout_date;
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
      //TODO modify when adding categories
      try {
        last_dateSTR = date_array.split(',')[0]
        last_dateOBJ = new Date(last_dateSTR)
        last_date = last_dateOBJ.getTime()
      }
        catch(err) {
          console.log('55 err: ', err, '\n')
        }
      console.log('52 db.run Update in Add', Date.now())
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
        if (DEBUG) console.log('\n66', Date.now(), workout_name, workout_url, date_array, workout_length, toRepeat, workout_comment, last_date)
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
          console.log('98 err: ', err, '\n')
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
        console.log('1-5 update error in post_update_db_workout: ', err)
      }

      setTimeout(() => {
          if (DEBUG) console.log('110 call retrieve_workouts from post_update_workout ', Date.now())
          workoutsHTML = retrieve_workouts()
          console.log('112 retrieving workouts in post_db_workout: ', Date.now(), '\n', workouts_html.substring(500, 540))
        },
        INTERVAL_TIME * 1)

      setTimeout(() => {
        if (DEBUG) console.log('117 call home_get in post_update_db_workout (Edit)', Date.now())
        app.get('./../routes/home_get', (req, res, next) => {
        })
      }, INTERVAL_TIME * 2) // This delay is needed 1/1/22

      setTimeout(() => {
        res.redirect("/") 
        if (DEBUG) console.log('125 res.redirect in post_update_db_workout (Edit)', Date.now())
      }, INTERVAL_TIME * 3) // Set to 0 1/1/22, reset on 1/6/22 after adding functionality
    }
  })
})
module.exports = router;