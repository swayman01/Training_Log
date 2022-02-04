const express = require('express');
const router = express.Router();
const workoutsHTML = require('./../util/retrieve_workouts.js')
global_constants = require('./../util/global_constants')
DEBUG = global_constants.DEBUG
exported_variables = require('./../util/read_head');
if (DEBUG) console.log('loaded home_post.js', Date.now())
router.post('/', (req, res, next) => {
    res.redirect("/")
})
module.exports = router;