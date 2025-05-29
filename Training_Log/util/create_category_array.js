module.exports = async function create_category_array() {
  // This function retrieves category data from the database and puts in an array
  const base_dir = path.dirname(path.resolve(__dirname))
  const global_constants = require(base_dir + '/util/global_constants')
  const start_time = Date.now()
  const et = require(base_dir + '/util/elapsed_time')
  var DEBUG = global_constants.DEBUG
  DEBUG = false;
  if (DEBUG) console.log('loaded create_category_array. ', et(start_time))
  var category_array = []
    let retrieve_categories_cmd = `
      SELECT category_position, isClosed, category_name
      FROM categories 
      ORDER BY category_position
    `
    const db = global_constants.db;
// Uncaught TypeError TypeError: The database connection is not open
// at prepare (/home/swayman/Documents/Training_Log/node_modules/better-sqlite3/lib/methods/wrappers.js:5:21)
// at create_category_array (/home/swayman/Documents/Training_Log/util/create_category_array.js:17:19)
// at init (/home/swayman/Documents/Training_Log/routes/home_get.js:123:13)
// at <anonymous> (/home/swayman/Documents/Training_Log/routes/home_get.js:133:5)

    var stmt = db.prepare(retrieve_categories_cmd);
    category_array = stmt.all();
    if (DEBUG) console.log('category_array\n', category_array);
            // workout_array =  db.exec(join_categories_to_workouts, [], (err, rows) => {
            // if(err) {console.log('*** Error in db.open: ', err)}      
            // })
    // try {
    //   var workout_array = db.transaction((users) => {
    //     const stmt = db.prepare(join_categories_to_workouts);
    //     for (const user of users) {
    //       stmt.run(user.name, user.email);
    //     }
    //   });
    // workout_array =  db.exec(join_categories_to_workouts, [], (err, rows) => {
    // if(err) {console.log('*** Error in db.open: ', err)}      
    // })
    // }
   
      // const db1 = global_constants.db1
    //   const db1 = global_constants.db
      
    //   try {
    //   if (DEBUG) console.log('20 in create_category_array pre db.open', et(start_time))
    //   db1.all(retrieve_categories, [], (err, rows) => {
    //     category_array = rows
    //     if (DEBUG) console.log('23 in create_category_array', rows, et(start_time))
    //     module.exports.category_array = category_array
    //   })
    // }
    //  catch (e) {
    //   console.log('Promise error create_category_array)', e)
    // }
    if (DEBUG) console.log('49 in create_category_array', et(start_time));
    module.exports.category_array = category_array;
    return
  }