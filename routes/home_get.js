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
// var workoutsHTML = ''
setTimeout(() => {
    retrieve_workouts()
    // console.log('17 workouts_html in home_get', Date.now(), workoutsHTML, retrieve_workouts())
}, INTERVAL_TIME * 1)
setTimeout(() => {
    // TODO - where does home_get get workouts_html? From the return statement?
    router.get('/', (req, res, next) => {
        res.end( exported_head.training_log_head_html + workouts_html);
    })
}, INTERVAL_TIME * 2)
module.exports = router;