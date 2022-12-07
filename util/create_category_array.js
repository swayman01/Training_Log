module.exports = async function create_category_array() {
  // This function retrieves category data from the database and puts in an array
  const base_dir = path.dirname(path.resolve(__dirname))
  const global_constants = require(base_dir + '/util/global_constants')
  const start_time = Date.now()
  const et = require(base_dir + '/util/elapsed_time')
  console.log('loaded create_category_array ', et(start_time))
  var DEBUG = global_constants.DEBUG
  // DEBUG = true
  var category_array = []
    let retrieve_categories = `
      SELECT category_position, isClosed, category_name
      FROM categories 
      ORDER BY category_position
    `
    const db = global_constants.db
   
      const db1 = global_constants.db1
      try {
      if (DEBUG) console.log('20 in create_category_array pre db.open', et(start_time))
      db1.all(retrieve_categories, [], (err, rows) => {
        category_array = rows
        if (DEBUG) console.log('23 in create_category_array', rows, et(start_time))
        module.exports.category_array = category_array
      })
    }
     catch (e) {
      console.log('Promise error create_category_array)', e)
    }
    if (DEBUG) console.log('30 in create_category_array', et(start_time))
    return
  }