const express = require('express');
// const router = express.Router();
// exported_variables = require("./../Training_log_practice_NodeJs");
console.log('loaded read_head.js', Date.now())
// exported_variables = require('/Users/swayman/Documents/Classes/NodeJs/Practice/Training_log_practice/Training_log_practice_NodeJs.js')

// import training_log_head_html from "Training_log_practice_NodeJs.js"
// const exported_values = require('../Training_log_practice_NodeJs')
const {
    readFile,
    readFileSync,
    writeFile,
    writeFileSync,
    appendFileSync
} = require('fs')

head_input = './head_input.html'
var training_log_head_html = ''
readFile(head_input, 'utf8', (err, data) => {
    if (err) {
        console.log('21 error in read_head.js', err)
        return
    } else {
        training_log_head_html = data
        module.exports.training_log_head_html = training_log_head_html
    }
    // console.log('training_log_head_html in read_head', Date.now(), training_log_head_html) // training_log_head_html is okay
})