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
const create_edit_categories_html = require(base_dir + '/util/create_edit_categories_html')
const exported_variables = require(base_dir + '/util/read_head');
const create_changesDICT = require(base_dir + '/util/create_changesDICT');
var DEBUG = global_constants.DEBUG
// DEBUG = true
// const db1 = global_constants.db1
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
  var workout_actionGLOBAL = modify_workout_variables.workout_actionGLOBAL;
  var category_array = create_category_array.category_array //Need to use create_category array so we can update after adding a new category
  var db = global_constants.db
  var inputs = req.body
  var error_messages = []
  if (DEBUG) console.log('50 post_update_db_workout workout_actionGLOBAL, category_array[0] ', workout_actionGLOBAL, category_array[0], et(start_time)) // This is used for Add New Category

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
    if (DEBUG) console.log('63 post_update_workout db1 ', db1, et(start_time)) 
    db1.get(select_categories, [], (err, rows) => {
      if (err) {
        console.log('Error post_update_db_workout select_categories: ', et(start_time), err)
        // TODO Add error handling here
      }
      if (DEBUG) console.log('69 in post_update_db_workout start of db1.get db1: ', db1, et(start_time))
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
        console.log('80 post_edit_categories ', et(start_time))
        workout_actionGLOBAL = 'Edit Categories'
        module.exports.workout_actionGLOBAL = workout_actionGLOBAL
        category_name = modify_workout_variables.category_name
        var category_array = create_category_array.category_array
        if(DEBUG) console.log('85 post_update_db_workout, category_array[0]', category_array[0], et(start_time))
        var checked_categoryDICT = {}
        var workout_array = home_get_variables.workout_array
        var selected_workout = modify_workout_variables.selected_workout
        if(DEBUG) console.log('89 post_update_db_workout selected_workout.workout_name ', selected_workout.workout_name)
      //SOMEDAY replace with function
        for (let i=0; i < category_array.length; i++) {
          for (let j=0; j < workout_array.length; j++) {
            if ((category_array[i].category_name==workout_array[j].category_name)&&(workout_array[j].workout_name==selected_workout.workout_name)) {
              checked_categoryDICT[category_array[i].category_name] = 'checked';
            }
              if(DEBUG) console.log('95 in post_update_db_workout: ',i, category_array[i].category_name);
        }
      }
        checked_categoryDICT =  create_checked_categoryDICT(category_array, workout_array, workout_name); //Not sure this is needed 11/10/22, 
        if(DEBUG) console.log('99 post_update_db_workout checked_categoryDICT', checked_categoryDICT, et(start_time));
        module.exports.checked_categoryDICT = selected_workout.checked_categoryDICT;
        console.log('102 DEBUG: ', DEBUG);exports.checked_categoryDICT = selected_workout.checked_categoryDICT
        edit_categories_html = create_edit_categories_html(category_array, checked_categoryDICT, edit_categories_error_message = ' ')
        // db1.close() commented out 8/1/25
        if (DEBUG) console.log('104 in post_update_db_workout ((rows == undefined) && (workout_actionGLOBAL == Add'), et(start_time)
        return res.end(category_error_html)
      } else {
        if (DEBUG) console.log('107 in post_update_db_workout proceeding to add category', et(start_time))
      } //  if ((rows == undefined) && (workout_actionGLOBAL == 'Add'))
  
    async function post_db_return(res) {
      try {
        if (DEBUG) console.log('112 post_update_db_workout - post_db_return', et(start_time))
        // db.close()
        return res.redirect('/') //Added 11/02/22 per https://linuxpip.org/fix-cant-set-headers-after-they-are-sent-to-the-client/
      } catch (e) {
        console.log('*** Error in Add Workout in post_update_db_workout:)', e, et(start_time))
      }
    }
  if(DEBUG) console.log('119 in post_update_db_workout workout_actionGlobal: ', workout_actionGLOBAL);
    if (workout_actionGLOBAL == 'Add') {
  
      async function workout_exists(workout_name) {
        if (DEBUG) console.log('123 starting workout_exists', et(start_time))
        const exported_variables = require(base_dir + '/util/read_head');
        const add_workout_html_equals = require(base_dir + '/util/add_workout_html_equals')
        var select_workout = `
                SELECT workout_name
                FROM workouts 
                WHERE workout_name = '${workout_name}'
                `
                if (DEBUG) console.log('131 in post_update_db_workout is database open? ', et(start_time))
        db1.get(select_workout, [], (err, rows) => {
          if (err) {
            console.log('Error post_update_db_workout db1.get: ', et(start_time), err)
          }
          if (DEBUG) console.log('136 post_update_db_workout workout_name rows', workout_name, rows, et(start_time))
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
                if (DEBUG) console.log('156 in post_update_db_workout add_workout, workout_exists - error_in_edit_categories: ',error_in_edit_categories, et(start_time))
                post_db_return(res)
                if (err) {
                  console.error('159 in post_Update_db_workout db1.close err ', err.message);
                }
              });
            } catch (e) {
              console.log('*** Error in post_update_db_workout Insert into _workouts:', e)
            }
          }
        })
      }

      async function init_add_workout() {
        if (DEBUG) console.log('170 starting init_add_workout', et(start_time))
        last_dateSTR = date_array.split(',')[0]
        last_dateOBJ = new Date(last_dateSTR)
        last_date = last_dateOBJ.getTime()
        workout_exists(workout_name)
        if (DEBUG) console.log('175 post workout_exists', et(start_time))
      }
  
      init_add_workout()
    }
  if (DEBUG) console.log('passed Add')
    if (workout_actionGLOBAL == 'Edit') {
      if (DEBUG) console.log('182 Edit Workout', et(start_time))
      function init_edit_workout() { //deleted async
        last_dateSTR = date_array.split(',')[0]
        last_dateOBJ = new Date(last_dateSTR)
        last_date = last_dateOBJ.getTime()
        selected_workout = modify_workout_variables.selected_workout
        try {
          // console.log('190 in post_update_db_workout workout.id', selected_workout.id, et(start_time))
          update_table = `UPDATE ${table} 
          SET workout_url = '${workout_url}',
                  date_array = '${date_array}',
                  workout_length = '${workout_length}',
                  toRepeat = '${toRepeat}',
                  workout_comment = '${workout_comment}',
                  last_date = '${last_date}',
                  workout_comment = '${workout_comment}'
                  WHERE id = ${selected_workout.id}`;
          // console.log('199 in post_update_db_workout update_table\n', update_table);
            if (err) {
              console.log('***Error in post_update_db_workout EDIT: ', err)
            }
          db1.close((err)=>{
            if (err) {console.log('error closing db1 ', err.msg)}
          });
          var update_stmt = db.prepare(update_table);
          workout_array = update_stmt.run();
        } catch (e) {
          console.log('*** Error in Edit Workout in post_update_db_workout:)', e)
        }
        
        if (DEBUG) console.log('217 in post_update_db_workout pre return', et(start_time))
        post_db_return(res) //commented out 11/1/22, added back 11/10/22, deleted await 4/25/25
        return
}
      init_edit_workout()
    }
  if (DEBUG) console.log('passed Edit')
    if (workout_actionGLOBAL == 'Edit Categories') {
      category_array = create_category_array.category_array;
      workout_array = home_get_variables.workout_array;
      selected_workout = modify_workout_variables.selected_workout;
      workout_name = selected_workout.workout_name; //TODO rework logic
      checked_categoryDICT = create_checked_categoryDICT(category_array, workout_array, workout_name);
      if (DEBUG) console.log('\n226 Edit Categories in post_update_db_workout ', checked_categoryDICT, et(start_time))
      async function add_new_category() {
        // This function adds the new category to categories and categories_to_workouts
        category_array = create_category_array.category_array
        check_for_checked_category(inputs)
              // Check for reserved and categories with the same name
        if (DEBUG) console.log('233 in post_update_db_workout after check_for_checked_category in add_new_category', et(start_time))
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
              if (DEBUG) console.log('*** 247 post_update_db_workout', error_message, '***')
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
              error_in_add_new_category = 1
              if (DEBUG) console.log('266 in add_new_category in post_update_db_workout res.end with error message', et(start_time))
              reserved_category_flag = 0
              category_name_exists_flag = 0
              if (DEBUG) console.log('271 in post_update_db_workout error handling res.end checked_categoryDICT ', checked_categoryDICT, et(start_time))
              return res.end(create_edit_categories_html(category_array, checked_categoryDICT, error_messages))
              return
            } // end if ((reserved_category_flag == 1) || (category_name_exists_flag == 1))
            else { //Add new category and category to workout to database
              if (DEBUG) console.log('276 in post_update_db_workout adding new category ', et(start_time))
              
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
            // try {
            //   var db1 = new sqlite3.Database(base_dir + '/db/training_log.db', (err) => {
            //     if (err) {
            //       console.log('Error in post_update_db_workout - Could not connect to database:', err)
            //     } ; console.log(x1);
              // insert_into_categories = insert_into_categories + x1; console.log(x1);
              selected_workout = modify_workout_variables.selected_workout // Added 11/10/22 - not sure why global variable doesn't work
              // db1.serialize(() =>  {
              //   db1.run(`
              //     INSERT INTO categories(category_name, category_position, isClosed)
              //     VALUES( ? , ? , ? )`, [new_category_name, category_position, isClosed])
              //   .run(`INSERT INTO categories_to_workouts (category_name, workout_name) 
              //   VALUES(?, ?)`, new_category_name, selected_workout.workout_name)
              //    // Since process category only loops through existing categories, we need to insert the workout here
              // })

               let insert_into_categories = `INSERT INTO categories(category_name, category_position, isClosed) VALUES(`;
               let x1 = "'" + new_category_name + "'," + category_position + ',' + isClosed + ")";
               insert_into_categories = insert_into_categories + x1;
               insert_stmt_1 = db.prepare(insert_into_categories);
               insert_stmt_1.run();
               
               insert_into_categories_to_workouts = `INSERT INTO categories_to_workouts (category_name, workout_name) VALUES(`;
               // i is not defined
               let x3 = "'" + new_category_name + "'," + "'" + selected_workout.workout_name + "'" + ')';
              //  let x4 = "'" + selected_workout.workout_name + "'" + ')'; console.log(x4);
               insert_into_categories_to_workouts = insert_into_categories_to_workouts + x3;
               insert_stmt = db.prepare(insert_into_categories_to_workouts);
               insert_stmt.run();

              create_category_array()
              category_array = create_category_array.category_array //Added here for update with new categories
              // db1.close((err) => {
              //   if (DEBUG) console.log('308 in post_update_db_workout new_category added to database', et(start_time))
              //   if (err) {
              //     console.error('310 in post_Update_db_workout db1.close err ', err.message);
              //   }
              // });
        // } catch (e) {
        //   console.log('*** Error init_update_edit_categories() in post_update_db_workout:)', e, et(start_time))
        // }
      } //end Add new category and category to workout to database
          } // end (inputs.x_new_category_x === 'on') 
        } else {
          if (DEBUG) console.log('323 new_category not checked in add_new_category in post_update_db_workout', et(start_time))
        }
        // db.close()
      } // end add_new_category())
      
      async function check_for_checked_category(inputs) {
        // category_array = create_category_array.category_array  // 8/6/25 Do we need this? commented out 8/9/25
        // This function makes sure that at least one category is checked
        let no_category_checked_flag = 1
        for (let i = 0; i < category_array.length; i++) {
          if (inputs[category_array[i].category_name] == 'on') {
            no_category_checked_flag = 0
          }
        }
        if (inputs['x_new_category_x']=='on') no_category_checked_flag = 0
      if (DEBUG) console.log('344 check_for_checked_category', et(start_time))
        if (no_category_checked_flag) {
          if (DEBUG) console.log('336 in post_update_db_workout check_for_checked_category checked_categoryDICT', checked_categoryDICT, et(start_time))
          no_category_checked_flag = 0
          error_in_edit_categories = 1
          edit_categories_html = create_edit_categories_html(category_array, checked_categoryDICT, edit_categories_error_message = 'ERROR: Each workout must have at least one category')
          // error_in_edit_categories = 0 //Added 11/08/22, then deleted
          if (DEBUG) console.log('351 in post_update_db_workout check_for_checked_category res.end ... ', et(start_time))
          return res.end(edit_categories_html) // Doesn't stop database update of changed categories
        } 
      } //end check_for_checked_category(0
  
      async function process_checked_categories() {
        // Modifies database for changes in checked categories
        if (DEBUG) console.log('358 post_update_db_workout - process_checked_categories', et(start_time))
        await create_category_array()
      //TODO update db method here
        // await db.open(base_dir + '/db/training_log.db')
        if (DEBUG) console.log('361 post_update)db_workouts\ndb', db, '\n\ndb1', db1);
        // db = global_constants.db;
        category_array = create_category_array.category_array
        workout_array = home_get_variables.workout_array
        selected_workout = modify_workout_variables.selected_workout
        workout_name = selected_workout.workout_name
        checked_categoryDICT = create_checked_categoryDICT(category_array, workout_array, workout_name);
        for (let i = 0; i < category_array.length; i++) {
          // Compare inputs and checked_categoryDICT
          // If category is in checked_categoryDICT and inputs do nothing
          category_on_in_database = (checked_categoryDICT[category_array[i]['category_name']] == 'checked')
          category_checked_on_screen = (category_inputs[category_array[i]['category_name']] == 'on')
          if (category_checked_on_screen && category_on_in_database) {
          }
          if (category_checked_on_screen && !category_on_in_database) {
            if (DEBUG) console.log('377 post_update_db_workout - Add ', category_array[i]['category_name'], ' to categories_to_workouts', et(start_time));
            insert_into_categories_to_workouts = `INSERT INTO categories_to_workouts (category_name, workout_name) VALUES(`;
            let x1 = "'" + category_array[i]['category_name'] + "'" + ',';
            let x2 = "'" + selected_workout.workout_name + "'" + ')';
            insert_into_categories_to_workouts = insert_into_categories_to_workouts + x1 + x2;
            // console.log([category_array[i]['category_name'], selected_workout.workout_name])
            // [category_array[i]['category_name'], selected_workout.workout_name]`)`;
            if(DEBUG) console.log('373 insert_into_categories_to_workouts: ', insert_into_categories_to_workouts);
            insert_stmt = db.prepare(insert_into_categories_to_workouts);
            insert_stmt.run();
            // await db1.run(`INSERT INTO categories_to_workouts (category_name, workout_name) 
                    // VALUES(`[category_array[i]['category_name'], selected_workout.workout_name])` )`;
          }
          if (!category_checked_on_screen && category_on_in_database) {
            delete_categories_from_workouts = 'DELETE FROM categories_to_workouts WHERE category_name = ';
            let x1 = "'" + category_array[i]['category_name'] + "'";
            let x2 =  ' AND workout_name = ' + "'" + selected_workout.workout_name  + "'";
            delete_categories_from_workouts = delete_categories_from_workouts + x1 + x2;
            delete_stmt = db.prepare(delete_categories_from_workouts);
            delete_stmt.run();
            // await db1.run(`DELETE FROM categories_to_workouts 
                      // WHERE category_name = '${category_array[i]['category_name']}'
                      // AND workout_name = '${selected_workout.workout_name}';`)
          }
        }
        // db.close()
        // check for checked_categories here
        if (DEBUG) console.log('382 post_update_db_workout exit process categories res.redirect', et(start_time))
      } //end process_categories
  
      async function update_db_categories() {
        try {
        if (DEBUG) console.log('402 in post_update_db_workout update_db_categories', et(start_time))
        // This function modifies database for changes in category position and display off/on
        // Identify changes in categories and create dictionary of changes to avoid index changes
        db = global_constants.db;
        changesDICT = create_changesDICT(category_array, category_inputs);
        if (DEBUG) console.log('406 in post_update_db_workout changesDICT, checked_categoryDICT', changesDICT, '\n', checked_categoryDICT, et(start_time))
          // Add checks or make update_db category recursive
          await create_category_array()
          try {
            // await db.open(base_dir + '/db/training_log.db')
            if (DEBUG) console.log('405 in post_update_db_workout changesDICT: ', changesDICT, '\n\nchangesDICT', changesDICT,et(start_time))
            //New Code
              category_array = create_category_array.category_array;
              changesDICT = create_changesDICT(category_array, category_inputs);  //8/6/25 Is this needed?
            for (const [key, value] of Object.entries(changesDICT)) {
              category_name = key
              category_position = changesDICT[category_name]['category_position']
              isClosed = changesDICT[category_name]['isClosed']
              if (DEBUG) console.log('413 in post_update_db_workout ', et(start_time))
              update_categories = `UPDATE categories SET category_position = ${category_position},`
              let x1 = `isClosed = ${isClosed} `
              let x2 = `WHERE category_name = '${category_name}'`;
              update_categories = update_categories + x1 + x2;
              console.log('update_categories:', update_categories)
              update_categories_stmt = db.prepare(update_categories);
              update_categories_stmt.run();
              //End new code  -start old code 
              // await db1.run(`UPDATE categories 
              //         SET category_position = '${category_position}',
              //         isClosed = '${isClosed}'
              //         WHERE category_name = '${category_name}'
              //         `)
              //End old code
              if (DEBUG) console.log('417 category_name: ', category_name, et(start_time));
            }
            // db.close()
            } catch (e) {
              console.log('431 *** Error updating categories in database in post_update_db_workout:)', e, et(start_time))
            }
        if (DEBUG) console.log('441 post_update_db_workout exiting update_db_categories', et(start_time))
    }  catch (e) {
      console.log('441 Error update_db_categories in post_update_db_workout:)', e, '\n\nchangesDICT', changesDICT,et(start_time));
    }
      } //end update_db__categories
  
      async function init_edit_categories() {
        if (DEBUG) console.log('446 in post_update_db_workout init_update_edit_categories', et(start_time))
        edit_category_error_message = ' '
        try {
          //TODO make each of these async
          await process_checked_categories()  // starts at line 349
          await update_db_categories()  // starts at line 394
          await add_new_category()
          await check_for_checked_category(inputs)
          if (DEBUG) console.log('454 in post_update_db_workout error_in_edit_categories, error_in_add_new_category ', error_in_edit_categories, error_in_add_new_category, et(start_time))
          if ((error_in_edit_categories!==1)&&(error_in_add_new_category!==1)) {
          if (DEBUG) console.log('456 pre await post_db_return', et(start_time))
            await post_db_return(res)
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
          // await db.open(base_dir + '/db/training_log.db')
          var stmt = db.prepare(join_categories_to_workouts);
            var return_code = stmt.all();
            console.log('447 DEBUG:', DEBUG);
            if (DEBUG) console.log('446 in post_update_db_workout returd code for db operation: ', return_code);

            // db.all(join_categories_to_workouts, [], (err, rows) => {
            //   if (err) {console.log('*** Error in db.open: ', err)} 
            //   home_get_variables.workout_array = rows  
            //   console.log('441 in post_update_db_workout db1.all(join_categories_to_workouts', et(start_time))   
            //   })
              // db.close()
              post_db_return(res)
              console.log('505 in post_update_db_workout after db.all(join_categories_to_workouts error_in_edit_categories, add_new_category', error_in_edit_categories, error_in_add_new_category, et(start_time))
              error_in_edit_categories = 0
              error_in_add_new_category = 0
          }
        } catch (e) {
          console.log('*** Error init_update_edit_categories() in post_update_db_workout:)', e, et(start_time))
        }
      }
  
      init_edit_categories()
    } // end if (workout_actionGLOBAL == 'Edit Categories')
    if (DEBUG) console.log('passed Edit Categories', workout_actionGLOBAL);
  }) // end db1.get(select_categories, [], (err, rows) =>
}) // end router.post('/update_db_workout', (req, res) =>

module.exports = router;