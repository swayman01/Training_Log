app.post('/update_db_date', (req, res) => {
  Not Used
  console.log('2 app.post update_db_date', Date.now())
  let new_date = req.body.workout_date
  //add date to date array
  workoutGLOBAL.date_array.split(',').push(new_date)
  // TODO Add this to edit workout and perhaps add workout
  new_date_array = new_date.concat(', ', workoutGLOBAL.date_array)
  try {
    last_dateSTR = new_date_array.split(',')[0]
    last_dateOBJ = new Date(last_dateSTR)
    last_date = last_dateOBJ.getTime()
    console.log('179 last_date', Date.now(), last_date)
  }
    catch(err) {
      console.log('182 err: ', err, '\n')
    }
  // Update db for new_date_array and last_date
  update_command = `
UPDATE workouts 
SET date_array = "${new_date_array}",
last_date = "${last_date}"
WHERE id = ${workoutGLOBAL.id}
  `
  // Reference: https://stackoverflow.com/questions/6597493/synchronous-database-queries-with-node-js
  db_return = db.run(update_command) //TODO: See if we can something with the return code
  // console.log('119 db_return', db_return, Date.now())
  console.log('\n149 update_command: ', Date.now()) //new_date_array is updated
  setTimeout(() => {
    retrieve_workouts()
  }, INTERVAL_TIME) // This delay is needed 1/1/22
  // TODO Learn about unhandled promise rejection
  setTimeout(() => {
    // Reload home page
    console.log('156 redirect after update_command: ', Date.now(), '\n')
    res.redirect("/")
  }, INTERVAL_TIME * 2)
})