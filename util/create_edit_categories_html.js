module.exports = function create_edit_categories_html(category_array, checked_categoryDICT, edit_categories_error_message = ' ') {
  // This function creates the post_edit_categories screen
  const start_time = Date.now()
  const base_dir = path.dirname(path.resolve(__dirname))
  const exported_variables = require(base_dir + '/util/read_head');
  const global_constants = require(base_dir + '/util/global_constants')
  const modify_workout_globals = require('./../routes/modify_workout')
  // const home_get_variables = require(base_dir + '/routes/home_get');
  // const POST_edit_categories = require(base_dir + '/routes/POST_edit_categories');
  const et = require(base_dir + '/util/elapsed_time')
  const workout_actionGLOBAL = modify_workout_globals.workout_actionGLOBAL
  const add_new_category_label = 'Add New Category'
  var form_entry_html = ''
  const end_edit_categories_html = `
    <input type="checkbox" id="new_category" name="x_new_category_x"  >
    <input type="text" id="new_category_name" name="x_new_category_name_x" label=${add_new_category_label} value="Category Name">
    <label for="new_category">Add New Category</label>
    <br>
    <br>
    <input type="submit" value="Save Changes" formaction="/update_db_workout">
    <input type="submit" value="Cancel" formaction="/">
    </form> 
    </body>
    </html>
  `

  var DEBUG = global_constants.DEBUG
  // DEBUG = true
  console.log('loaded create_edit_categories_html', et(start_time))
  if (DEBUG) console.log('30 create_edit_categories', et(start_time))

  // Add html head
  var edit_categories_html = exported_variables.training_log_head_html + `
  <h2>${workout_actionGLOBAL} for Workout ${selected_workout.workout_name}</h2>
  <h2 class="error">${edit_categories_error_message}</h2>
  <form action="/update_db_workout" method="POST">
`

  // Handle both 1/0, Y/N (old formats for toRepeat)
  var toRepeat = 'N'
  if ((selected_workout.toRepeat == 1) || (selected_workout.toRepeat == 'Y')) toRepeat = 'Y'
  // create entries for file
  for (let i = 0; i < category_array.length; i++) {
    category_name = category_array[i].category_name
    category_position = category_array[i].category_position
    isClosed = category_array[i].isClosed
    checked_category_flag = 0
    if (checked_categoryDICT[category_array[i]['category_name']] == 'checked') {
      checked_category_flag = 1
    }

    if (checked_category_flag) {
      form_entry_html_a = `
          <br>
          <input type="checkbox" id="${category_name}" name="${category_name}" checked>
          <label for="${category_name}">${category_name}</label>
          `
    } else {
      form_entry_html_a = `
          <input type="checkbox" id="${category_name}" name="${category_name}" >
          <label for="${category_name}">${category_name}</label><br>
          `
    }

    // ref: https://www.javascripttutorial.net/javascript-dom/javascript-checkbox/
    
    if (isClosed == 1) {
      form_entry_html = form_entry_html + form_entry_html_a + `
              <input type = "number" id="position" name = "position" min="0" max="500" value = "${category_position}" >
              <label for="position">Display Position (required: between 0 and 500)</label>
              <br>
              <label for="details">Display On/Off</label>
              <select id="details" name = "details" size="1" class="display_off_or_on">
                <option value="0">Show Workouts</option>
                <option value="1" selected>Hide Workouts</option>
              </select>
              <br>
              <br>
              `
    } else {
      form_entry_html = form_entry_html + form_entry_html_a + `
              <input type = "number" id="position" name = "position" min="0" max="500" value = "${category_position}" >
              <label for="position">Display Position (required: between 0 and 500)</label>
              <br>
              <label for="details">Display On/Off</label>
              <select id="details" name = "details" size="1" class="display_off_or_on">
                <option value="0" selected>Show Workouts</option>
                <option value="1" >Hide Workouts</option>
              </select>
              <br>
              <br>
              `
    }
  }
  edit_categories_html = edit_categories_html + form_entry_html + end_edit_categories_html
  if (DEBUG) console.log('100 exiting create_edit_categories_html', et(start_time))
  return edit_categories_html
}