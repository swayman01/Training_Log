global_constants = require('./../util/global_constants')
DEBUG = global_constants.DEBUG
if (DEBUG) console.log('loaded home_get', Date.now())
INTERVAL_TIME = global_constants.INTERVAL_TIME
const express = require('express');
const router = express.Router();
exported_head = require("./../util/read_head");
// setTimeout(()=>{
// console.log(exported_head.training_log_head_html)
// }, 100) // works after 100ms, TODO, use promises
retrieve_workouts = require("./../util/retrieve_workouts");
console.log('13 retrieve_workouts in home_get\n', retrieve_workouts)
// var workoutsHTML = ''
setTimeout(() => {
    retrieve_workouts()
    // console.log('17 workouts_html in home_get', Date.now(), workoutsHTML, retrieve_workouts())
}, INTERVAL_TIME * 1)
setTimeout(() => {
    // TODO - where does home_get get workouts_html? From the return statement?
    console.log('22 workouts_html in home_get', Date.now(), workouts_html.substring(16, 54))
    router.get('/', (req, res, next) => {
        // res.end(training_log_head_html + workouts_htmlGLOBAL)
        // if (error) {
        //     console.log('error in home_get.js', Date.now(), error)
        // }
        // Try https://stackoverflow.com/questions/43871885/how-to-execute-nodejs-function-on-page-refresh#43871980
        // console.log('30 in home_get exported_head.training_log_head_html', Date.now(), exported_head.training_log_head_html.substring(0, 15))
        // console.log('31 workouts_html in home_get', Date.now(), workouts_html.substring(16, 54))
        res.end( exported_head.training_log_head_html + workouts_html);
        // check retrieve workouts for new assignment here
    })
}, INTERVAL_TIME * 2)
module.exports = router;

// *** Start test stuff from https://www.tutorialsteacher.com/nodejs/nodejs-module-exports
// var test = require('./test.js');
// console.log('33 in home_get.js', test('test message'));
// test('Use this approach for retrieve workouts')
// console.log('34 in home_get.js', test.logger);
// *** End test stuff from https://www.tutorialsteacher.com/nodejs/nodejs-module-exports