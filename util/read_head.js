// This module reads the html header file, css file, and closure file to create the
// beginning of the html file
const global_constants = require('./global_constants')
const base_dir = global_constants.base_dir
const start_time = Date.now()
const et = require(base_dir + '/util/elapsed_time')
const getFile = global_constants.getFile
console.log('loaded read_head.js', et(start_time))
var head_start = './static/html_inputs/head_start.html'
var css_input = './static/stylesheets/style.css'
var head_close = './static/html_inputs/head_close.html'
var results = []

const f1 = getFile(head_start)
const f2 = getFile(css_input)
const f3 = getFile(head_close)

Promise.all([f1, f2, f3])
  .then(res => {
    results = res
    training_log_head_html = results[0] + results[1] + results[2]
    module.exports.training_log_head_html = training_log_head_html
  })
  .catch(err => {
    console.error(err)
  })