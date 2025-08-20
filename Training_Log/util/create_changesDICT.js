module.exports = function create_changesDICT(category_array, category_inputs) {
    // This function returns a dictionary of changes to the category table in the database
    const start_time = Date.now()
    const base_dir = path.dirname(path.resolve(__dirname))
    const et = require(base_dir + '/util/elapsed_time')
    changesDICT = {}
    console.log('create_changesDICT', et(start_time))
    for (let i = 0; i < category_array.length; i++) {
        let change_flag = 0
        if (category_array[i].category_position != category_inputs.position[i]) {
            change_flag = 1
        }
        if (category_array[i].isClosed.toString() != category_inputs.details[i]) {
            change_flag = 1
        }
        if (change_flag) {
            position = category_inputs.position[i]
            isClosed = category_inputs.details[i]
            category_name = category_array[i].category_name
            changesDICT[category_name] = {
                'category_position': position,
                'isClosed': isClosed
            }
        }
    }
    return changesDICT
}