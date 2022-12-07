module.exports = function create_checked_categoryDICT(category_array, workout_array, workout_name) {
    // This function creates a dictionary of categories that are checked on the screen for the selected workout
    var checked_categoryDICT = {}
    for (let i = 0; i < category_array.length; i++) {
        for (let j = 0; j < workout_array.length; j++) {
            if ((category_array[i].category_name == workout_array[j].category_name) && (workout_array[j].workout_name == workout_name)) {
                checked_categoryDICT[category_array[i].category_name] = 'checked'
            }
        }
    }
    return checked_categoryDICT
}