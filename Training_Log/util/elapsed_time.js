module.exports = function (start_time) {
    // This function returns the elapsed start time. It facilitates debugging asynchronous operations
    return Date.now() - start_time
}