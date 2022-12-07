// This routine incorporates the desired changes into the database
function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}

function getMinOfArray(numArray) {
  return Math.min.apply(null, numArray);
}

const path = require('path')
const base_dir = path.dirname(path.resolve(__dirname))
const express = require('express');
// const app = express()
const router = express.Router();
const global_constants = require(base_dir + '/util/global_constants')
const start_time = Date.now()
const sqlite3 = require('sqlite3').verbose();
const et = require(base_dir + '/util/elapsed_time')
// const add_workout = require(base_dir + '/routes/add_workout')
const create_edit_categories_html = require(base_dir + '/util/create_edit_categories_html')
const exported_variables = require(base_dir + '/util/read_head');
// const post_edit_categories_variables = require(base_dir + '/routes/post_edit_categories')
// const post_edit_categories = require(base_dir + '/routes/post_edit_categories')
// const modify_workout_variables = require('./modify_workout')
const create_changesDICT = require(base_dir + '/util/create_changesDICT')
var DEBUG = global_constants.DEBUG
// DEBUG = true
const db1 = global_constants.db1
const home_get_variables = require(base_dir + '/routes/home_get')
const create_checked_categoryDICT = require(base_dir + '/util/create_checked_categoryDICT');
var error_in_edit_categories = 0
var error_in_add_new_category = 0
console.log('loaded post_update_db_workout.js', et(start_time))
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
  const create_category_array = require(base_dir + '/util/create_category_array') //commented out 10/21/22, added 10/25/22 //Need to use create_category array so we can update after adding a new category
  const modify_workout_variables = require('./modify_workout')
  var workout_actionGLOBAL = modify_workout_variables.workout_actionGLOBAL
  var category_array = create_category_array.category_array //Need to use create_category array so we can update after adding a new category
  const post_edit_categories_variables = require(base_dir + '/routes/post_edit_categories')
  // var checked_categoryDICT = post_edit_categories_variables.checked_categoryDICT
  var db = global_constants.db
  var inputs = req.body
  var error_messages = []
  if (DEBUG) console.log('56 post_update_db_workout workout_actionGLOBAL, category_array[0] ', workout_actionGLOBAL, category_array[0], et(start_time)) // This is used for Add New Category

  var select_categories = `
    SELECT id, category_name, category_position, isClosed, category_subheading
    FROM categories 
    WHERE category_name = '${category_name}'
    LIMIT 1
    `
    var db1 = new sqlite3.Database(base_dir + '/db/training_log.db', (err) => {
      if (err) {
        console.log('Error in post_update_db_workout - Could not connect to database:', err)
      }
    })
    if (DEBUG) console.log('69 post_update_workout db1 ', db1, et(start_time)) 
    db1.get(select_categories, [], (err, rows) => {
      if (err) {
        console.log('Error post_update_db_workout select_categories: ', et(start_time), err)
        // TODO Add error handling here
      }
      if (DEBUG) console.log('73 in post_update_db_workout start of db1.get db1: ', db1, et(start_time))
      if ((rows == undefined) && (workout_actionGLOBAL == 'Add')) {
        category_error_message = 'Category Does Not Exist. Capability to be added. In the meantime add via Edit Categories.'
        console.log(category_error_message, et(start_time))
        const reset_button = `
          <form action="/">
          <input type="submit" value="Go to Home Page" formaction="/">
        </form>
      `
        var category_error_html = exported_variables.training_log_head_html + category_error_message + reset_button
        category_error_message = ''
        console.log('86 post_edit_categories ', et(start_time))
        workout_actionGLOBAL = 'Edit Categories'
        module.exports.workout_actionGLOBAL = workout_actionGLOBAL
        category_name = modify_workout_variables.category_name
        var category_array = create_category_array.category_array
        if(DEBUG) console.log('89 post_edit_categories, category_array[0]', category_array[0], et(start_time))
        var checked_categoryDICT = {}
        var workout_array = home_get_variables.workout_array
        var selected_workout = modify_workout_variables.selected_workout
        if(DEBUG) console.log('93 post_edit_categories selected_workout.workout_name ', selected_workout.workout_name)
        //TODO replace with function
        for (let i=0; i < category_array.length; i++) {
          for (let j=0; j < workout_array.length; j++) {
            if ((category_array[i].category_name==workout_array[j].category_name)&&(workout_array[j].workout_name==selected_workout.workout_name)) {
              checked_categoryDICT[category_array[i].category_name] = 'checked'
            }
          }
        }
        checked_categoryDICT =  create_checked_categoryDICT(category_array, workout_array, workout_name) //Not sure this is needed 11/10/22
        if(DEBUG) console.log('107 post_edit_categories checked_categoryDICT', checked_categoryDICT, et(start_time))
        module.exports.checked_categoryDICT = selected_workout.checked_categoryDICT
        edit_categories_html = create_edit_categories_html(category_array, checked_categoryDICT, edit_categories_error_message = ' ')
  
        db1.close()
        if (DEBUG) console.log('110 in post_update_db_workout ((rows == undefined) && (workout_actionGLOBAL == Add'), et(start_time)
        return res.end(category_error_html)
      } else {
        if (DEBUG) console.log('113 in post_update_db_workout proceeding to add category', et(start_time))
      } //  if ((rows == undefined) && (workout_actionGLOBAL == 'Add'))
    
      
    // }) //end db1.get()
  
    async function post_db_return(res) {
      try {
        if (DEBUG) console.log('120 post_update_db_workout - post_db_return', et(start_time))
        // db.close()
        return res.redirect('/') //Added 11/02/22 per https://linuxpip.org/fix-cant-set-headers-after-they-are-sent-to-the-client/
      } catch (e) {
        console.log('*** Error in Add Workout in post_update_db_workout:)', e, et(start_time))
      }
    }
  
    if (workout_actionGLOBAL == 'Add') {
  
      async function workout_exists(workout_name) {
        if (DEBUG) console.log('91 starting workout_exists', et(start_time))
        const exported_variables = require(base_dir + '/util/read_head');
        const add_workout_html_equals = require(base_dir + '/util/add_workout_html_equals')
        var select_workout = `
                SELECT workout_name
                FROM workouts 
                WHERE workout_name = '${workout_name}'
                `
                if (DEBUG) console.log('114 in post_update_db_workout is database open? ', et(start_time))
        db1.get(select_workout, [], (err, rows) => {
          if (err) {
            console.log('Error post_update_db_workout db1.get: ', et(start_time), err)
          }
          if (DEBUG) console.log('151 post_update_db_workout workout_name rows', workout_name, rows, et(start_time))
          if (rows != undefined) {
            console.log('*** workout ', workout_name, ' already exists ', et(start_time))
            add_workout_error_message = workout_name + ' already exists. Please choose a new name or edit the existing workout'
            var add_workout_html = exported_variables.training_log_head_html +
              add_workout_html_equals(workout_actionGLOBAL, category_name, new_date, add_workout_error_message)
            add_workout_error_message = ''
            return res.end(add_workout_html)
          } else {
            try {
              table1 = 'categories_to_workouts';
              table2 = 'workouts'
              db1.serialize(() =>  {
                db1.run(`INSERT INTO ${table1} (workout_name, category_name) VALUES(?, ?)`, [workout_name, category_name])
                   .run(`INSERT INTO ${table2} (workout_name, workout_url, date_array, workout_length, toRepeat, workout_comment, last_date) 
                  VALUES(?, ?, ?, ?, ?, ?, ?)`, [workout_name, workout_url, date_array, workout_length, toRepeat, workout_comment, last_date]);
                if (DEBUG) console.log('143 in post_update_workout.js add_workout ', et(start_time))
              })
              db1.close((err) => {
                error_in_edit_categories = 1
                if (DEBUG) console.log('165 in post_update_db_workout add_workout, workout_exists - error_in_edit_categories: ',error_in_edit_categories, et(start_time))
                post_db_return(res)
                if (err) {
                  console.error('168 in post_Update_db_workout db1.close err ', err.message);
                }
              });
            } catch (e) {
              console.log('*** Error in post_update_db_workout Insert into _workouts:', e)
            }
          }
        })
      }
      async function init_add_workout() {
        if (DEBUG) console.log('184 starting init_add_workout', et(start_time))
        last_dateSTR = date_array.split(',')[0]
        last_dateOBJ = new Date(last_dateSTR)
        last_date = last_dateOBJ.getTime()
        workout_exists(workout_name)
        if (DEBUG) console.log('189 post workout_exists', et(start_time))
      }
  
      init_add_workout()
    }
  
    if (workout_actionGLOBAL == 'Edit') {
      if (DEBUG) console.log('190 db.run Update in Edit', et(start_time))
      async function init_edit_workout() {
        last_dateSTR = date_array.split(',')[0]
        last_dateOBJ = new Date(last_dateSTR)
        last_date = last_dateOBJ.getTime()
        selected_workout = modify_workout_variables.selected_workout
        if (DEBUG) console.log('193 db.run Update in Edit', et(start_time))
        try {
          console.log('198 in post_update_db_workout toRepeat', toRepeat, et(start_time))
          db_open = await db.open(base_dir + '/db/training_log.db')
          await db.run(`UPDATE ${table} 
                  SET workout_url = "${workout_url}",
                  date_array = "${date_array}",
                  workout_length = "${workout_length}",
                  toRepeat = "${toRepeat}",
                  workout_comment = "${workout_comment}",
                  last_date = "${last_date}"
                  WHERE id = "${selected_workout.id}"
                  `, [], (err, rows) => {
            if (err) {
              console.log('***Error in post_update_db_workout EDIT: ', err)
            }
          })
        } catch (e) {
          console.log('*** Error in Edit Workout in post_update_db_workout:)', e)
        }
        db.close()
        if (DEBUG) console.log('217 in post_update_db_workout pre return', et(start_time))
        await post_db_return(res) //commented out 11/1/22, added back 11/10/22
        return
      }
      init_edit_workout()
    }
  
    if (workout_actionGLOBAL == 'Edit Categories') {
      if (DEBUG) console.log('225 Edit Categories in post_update_db_workout ', checked_categoryDICT, et(start_time))
      async function add_new_category() {
        // This function adds the new category to categories and categories_to_workouts
        category_array = create_category_array.category_array
        check_for_checked_category(inputs)
              // Check for reserved and categories with the same name
        if (DEBUG) console.log('231 in post_update_db_workout after check_for_checked_category in add_new_category', et(start_time))
        if (typeof inputs.x_new_category_x !== 'undefined') {
          if (inputs.x_new_category_x === 'on') {
            //add New Category
            var reserved_categories = ['Category Name']
            var category_name_exists_flag = 0
            var new_category_name = category_inputs['x_new_category_name_x'] 
            for (let i = 0; i < category_array.length; i++) {
              if (category_inputs['x_new_category_name_x'] == category_array[i].category_name) {
                category_name_exists_flag = 1
              }
            }
            if (category_name_exists_flag == 1) {
              error_message = category_inputs['x_new_category_name_x'] + ' is already in use'
              if (DEBUG) console.log('*** 245 post_update_db_workout', error_message, '***')
              error_in_add_new_category = 1
              error_messages.push(error_message)
            }
  
            var reserved_category_flag = 0
            for (let i = 0; i < reserved_categories.length; i++) {
              if (category_inputs['x_new_category_name_x'] == reserved_categories[i]) {
                reserved_category_flag = 1
              }
            }
            if (reserved_category_flag == 1) {
              error_message = category_inputs['x_new_category_name_x'] + ' is a reserved category. Please choose a different name'
              if (DEBUG) console.log('259 post_update_db_workout', error_message)
              error_messages.push(error_message)
              error_in_add_new_category = 1
            }
  
            if ((reserved_category_flag == 1) || (category_name_exists_flag == 1)) {
              edit_categories_html = create_edit_categories_html(category_array, checked_categoryDICT, error_messages)
              // error_messages = [] //Added 11/08/22, commented out 11/14/22
              error_in_add_new_category = 1
              if (DEBUG) console.log('268 in add_new_category in post_update_db_workout res.end with error message', et(start_time))
              reserved_category_flag = 0
              category_name_exists_flag = 0
              // TODO Need new checked_categoryDICT?
              if (DEBUG) console.log('272 in post_update_db_workout error handling res.end checked_categoryDICT ', checked_categoryDICT, et(start_time))
              return res.end(create_edit_categories_html(category_array, checked_categoryDICT, error_messages))
              return
            } // end if ((reserved_category_flag == 1) || (category_name_exists_flag == 1))
            else { //Add new category and category to workout to database
              if (DEBUG) console.log('277 in post_update_db_workout adding new category ', et(start_time))
              
            // Set new category to first position past TODO 
            // Note tht category positions must be unique
            var category_position = 10
            var available_positions = new Set()
            var used_positions = new Set()
            var used_positionsARRAY = []
            for (let i = 0; i < category_array.length; i++) {
              used_positions.add(category_array[i].category_position)
              used_positionsARRAY.push(category_array[i].category_position)
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
            isClosed = 0
            try {
              var db1 = new sqlite3.Database(base_dir + '/db/training_log.db', (err) => {
                if (err) {
                  console.log('Error in post_update_db_workout - Could not connect to database:', err)
                } 
              })
              selected_workout = modify_workout_variables.selected_workout // Added 11/10/22 - not sure why global variable doesn't work
              db1.serialize(() =>  {
                db1.run(`
                  INSERT INTO categories(category_name, category_position, isClosed)
                  VALUES( ? , ? , ? )`, [new_category_name, category_position, isClosed])
                .run(`INSERT INTO categories_to_workouts (category_name, workout_name) 
                VALUES(?, ?)`, new_category_name, selected_workout.workout_name)
                 // Since process category only loops through existing categories, we need to insert the workout here
              })
              create_category_array()
              category_array = create_category_array.category_array //Added here for update with new categories
              db1.close((err) => {
                if (DEBUG) console.log('317 in post_update_db_workout new_category added to database', et(start_time))
                // post_db_return(res) //moved to init_edit categories 10/19/22
                if (err) {
                  console.error('320 in post_Update_db_workout db1.close err ', err.message);
                }
              // post_db_return(res) //commented out 11/1/22
              });
        } catch (e) {
          console.log('*** Error init_update_edit_categories() in post_update_db_workout:)', e, et(start_time))
        }
      } //end Add new category and category to workout to database
          } // end (inputs.x_new_category_x === 'on') 
        } else {
          if (DEBUG) console.log('333 new_category not checked in add_new_category in post_update_db_workout', et(start_time))
          // error_in_edit_categories = 1 // commented out 11/8/22
          //post_db_return(res) //moved to init_edit categories 10/19/22
        }
        // db.close()
      } // end add_new_category())
      
      async function check_for_checked_category(inputs) {
        category_array = create_category_array.category_array
        // This function makes sure that at least one category is checked
        let no_category_checked_flag = 1
        for (let i = 0; i < category_array.length; i++) {
          if (inputs[category_array[i].category_name] == 'on') {
            no_category_checked_flag = 0
          }
        }
        if (inputs['x_new_category_x']=='on') no_category_checked_flag = 0
        if (no_category_checked_flag) {
          if (DEBUG) console.log('349 in post_update_db_workout check_for_checked_category checked_categoryDICT', checked_categoryDICT, et(start_time))
          no_category_checked_flag = 0
          // TODO update checked_categoryDICT for correct redisplay on error?
          error_in_edit_categories = 1
          edit_categories_html = create_edit_categories_html(category_array, checked_categoryDICT, edit_categories_error_message = 'ERROR: Each workout must have at least one category')
          // error_in_edit_categories = 0 //Added 11/08/22, then deleted
          if (DEBUG) console.log('355 in post_update_db_workout check_for_checked_category res.end ... ', et(start_time))
          return res.end(edit_categories_html) // Doesn't stop database update of changed categories
          // return 'No Checked Categories'
        } else {
          // res.redirect("/") // Added since this is the last function called TODO see if we need to move
        }
      } //end check_for_checked_category(0
  
      async function process_checked_categories() {
        // Modifies database for changes in checked categories
        if (DEBUG) console.log('365 post_update_db_workout - processed_checked_categories', et(start_time))
        await create_category_array()
        await db.open(base_dir + '/db/training_log.db')
        category_array = create_category_array.category_array
        workout_array = home_get_variables.workout_array
        selected_workout = modify_workout_variables.selected_workout
        workout_name = selected_workout.workout_name
        checked_categoryDICT = create_checked_categoryDICT(category_array, workout_array, workout_name)
        for (let i = 0; i < category_array.length; i++) {
          // Compare inputs and checked_categoryDICT
          // If category is in checked_categoryDICT and inputs do nothing
          category_on_in_database = (checked_categoryDICT[category_array[i]['category_name']] == 'checked')
          // if (category_on_in_database) error_in_edit_categories = 0 // Added for case when deleted category is restored, this creates a problem for error when adding new category
          category_checked_on_screen = (category_inputs[category_array[i]['category_name']] == 'on')
          if (category_checked_on_screen && category_on_in_database) {
          }
          if (category_checked_on_screen && !category_on_in_database) {
            if (DEBUG) console.log('383 post_update_db_workout - Add ', category_array[i]['category_name'], ' to categories_to_workouts', et(start_time))
            await db.run(`INSERT INTO categories_to_workouts (category_name, workout_name) 
                    VALUES(?, ?)`, [category_array[i]['category_name'], selected_workout.workout_name]);
          }
          if (!category_checked_on_screen && category_on_in_database) {
            await db.run(`DELETE FROM categories_to_workouts
                      WHERE category_name = '${category_array[i]['category_name']}'
                      AND workout_name = '${selected_workout.workout_name}';`)
          }
        }
        db.close()
        // check for checked_categories here
        if (DEBUG) console.log('394 post_update_db_workout exit process categories res.redirect', et(start_time))
      } //end process_categories
  
      async function update_db_categories() {
        try {
        if (DEBUG) console.log('399 in post_update_db_workout update_db_categories', et(start_time))
        // This function modifies database for changes in category position and display off/on
        // Identify changes in categories and create dictionary of changes to avoid index changes
        changesDICT = create_changesDICT(category_array, category_inputs)
        if (DEBUG) console.log('403 in post_update_db_workout changesDICT, checked_categoryDICT', changesDICT, '\n', checked_categoryDICT, et(start_time))
          // Add checks or make update_db category recursive
          await create_category_array()
          try {
            await db.open(base_dir + '/db/training_log.db')
            if (DEBUG) console.log('408 in post_update_db_workout after await db.open changesDICT: ', changesDICT, et(start_time))
            category_array = create_category_array.category_array
            for (const [key, value] of Object.entries(changesDICT)) {
              category_name = key
              category_position = changesDICT[category_name]['category_position']
              isClosed = changesDICT[category_name]['isClosed']
              if (DEBUG) console.log('415 in post_update_db_workout ', et(start_time))
              await db.run(`UPDATE categories 
                      SET category_position = "${category_position}",
                      isClosed = "${isClosed}"
                      WHERE category_name = "${category_name}"
                      `)
              }
            db.close()
            } catch (e) {
              console.log('424 *** Error updating categories in database in post_update_db_workout:)', e, et(start_time))
            }
        if (DEBUG) console.log('426 post_update_db_workout exiting update_db_categories', et(start_time))
    }  catch (e) {
      console.log('432 Error update_db_categories in post_update_db_workout:)', e, et(start_time))
    }
      } //end update_db__categories
  
      async function init_edit_categories() {
        if (DEBUG) console.log('433 in post_update_db_workout init_update_edit_categories', et(start_time))
        edit_category_error_message = ' '
        try {
          await process_checked_categories()
          await update_db_categories()
          await add_new_category()
          if (DEBUG) console.log('439 in post_update_db_workout error_in_edit_categories, error_in_add_new_category ', error_in_edit_categories, error_in_add_new_category)
          if ((error_in_edit_categories!==1)&&(error_in_add_new_category!==1)) {
            await post_db_return(res) //try moving to add_new_category 10/27/22 - didn't work, need here
          }
          else {
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
            db1.all(join_categories_to_workouts, [], (err, rows) => {
              if (err) {console.log('*** Error in db.open: ', err)} 
              home_get_variables.workout_array = rows  
              console.log('457 in post_update_db_workout db1.all(join_categories_to_workouts', et(start_time))   
              })
            error_in_edit_categories = 0
            error_in_add_new_category = 0
            console.log('461 in post_update_db_workout db1.all(join_categories_to_workouts', et(start_time)) 

          }
        } catch (e) {
          console.log('*** Error init_update_edit_categories() in post_update_db_workout:)', e, et(start_time))
        }
      }
  
      init_edit_categories()
    } // end if (workout_actionGLOBAL == 'Edit Categories')
  }) // end db1.get(select_categories, [], (err, rows) =>
}) // end router.post('/update_db_workout', (req, res) =>

module.exports = router;