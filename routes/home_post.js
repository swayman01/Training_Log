const express = require('express');
const router = express.Router();
const global_constants = require('./../util/global_constants')
const base_dir = global_constants.base_dir
const start_time = Date.now()
const et = require(base_dir + '/util/elapsed_time')
DEBUG = global_constants.DEBUG
exported_variables = require('./../util/read_head');
if (DEBUG) console.log('loaded home_post.js', et(start_time))
router.post('/', (req, res, next) => {
    res.redirect("/")
})
module.exports = router;