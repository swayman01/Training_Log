// TODO change this to reference function, then fix workout_global exports
const express = require('express');
const router = express.Router();
const base_dir = path.resolve(__dirname)
const et = require(base_dir + '/../util/elapsed_time')
const start_time = Date.now()
const create_edit_categories_html = require(base_dir + '/../util/create_edit_categories_html')
const global_constants = require('../util/global_constants')
const modify_workout_variables = require('./modify_workout')
const home_get_variables = require('./home_get')
const create_category_array = require(base_dir + '/../util/create_category_array')
var DEBUG = global_constants.DEBUG
DEBUG = true
router.post('/', (req, res, next) => {
  if(DEBUG) console.log('15 workoutGlobal in post_edit_categories', workoutGLOBAL)
  res.redirect("/")
})

router.post('/post_edit_categories', (req, res) => {
  console.log('20 post_edit_categories ', et(start_time))
  workout_actionGLOBAL = 'Edit Categories'
  module.exports.workout_actionGLOBAL = workout_actionGLOBAL
  category_name = modify_workout_variables.category_name
  var category_array = create_category_array.category_array
  if(DEBUG) console.log('25 post_edit_categories, category_array[0]', category_array[0], et(start_time))
  var checked_categoryDICT = {}
  var workout_array = home_get_variables.workout_array
  var selected_workout = modify_workout_variables.selected_workout
  if(DEBUG) console.log('29 post_edit_categories selected_workout.workout_name ', selected_workout.workout_name)
  //TODO Pass workout name and check
  for (let i=0; i < category_array.length; i++) {
    for (let j=0; j < workout_array.length; j++) {
      if ((category_array[i].category_name==workout_array[j].category_name)&&(workout_array[j].workout_name==selected_workout.workout_name)) {
        checked_categoryDICT[category_array[i].category_name] = 'checked'
      }
    }
  }
  if(DEBUG) console.log('38 post_edit_categories checked_categoryDICT', checked_categoryDICT, et(start_time))
  module.exports.checked_categoryDICT = checked_categoryDICT
  edit_categories_html = create_edit_categories_html(category_array, checked_categoryDICT, edit_categories_error_message = ' ')
  res.end(edit_categories_html)
})

module.exports = router;