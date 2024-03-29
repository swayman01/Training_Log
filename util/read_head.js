// This module reads the html header file, css file, and closure file to create the
// beginning of the html file
path = require('path')
const base_dir = path.dirname(path.resolve(__dirname))
const global_constants = require(base_dir + '/util/global_constants')
const start_time = Date.now()
const et = require(base_dir + '/util/elapsed_time')
const getFile = global_constants.getFile
console.log('loaded read_head.js', et(start_time))
const head_start = base_dir + '/static/html_inputs/head_start.html'
const css_input = base_dir + '/static/stylesheets/Training_log.css'
const head_close = base_dir + '/static/html_inputs/head_close.html'
var DEBUG = global_constants.DEBUG
var results = []

const f1 = getFile(head_start)
const f2 = getFile(css_input)
const f3 = getFile(head_close)
if (DEBUG) console.log('18 read_head.js - training_log_head_html', et(start_time))

Promise.all([f1, f2, f3])
  .then(res => {
    results = res
    training_log_head_html = results[0] + results[1] + results[2]
    module.exports.training_log_head_html = training_log_head_html
    if(DEBUG) console.log('26 loaded read_head.js Promise fulfilled', et(start_time))
  })
  .catch(err => {
    console.error(err)
  })