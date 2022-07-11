module.exports = function add_workout_html_equals(workout_actionGLOBAL, category_name, new_date, add_workout_error_message='') {
    var add_workout_html_body = 
      `
      <h2 class="error">${add_workout_error_message}</h2>
      <h2>${workout_actionGLOBAL} Workout </h2>
      <form action="/add_workout" method="POST">
        <label for="category_name">Category Name:</label><br>
        <input type="text" id="category_name" name="category_name" value="${category_name}" required><br><br>

        <label for="workout__name">Workout Name: (required - input any character before hitting cancel)</label><br>
        <input type="text" id="workout_name" name="workout_name" required><br><br>

        <label for="workout_url">Workout URL (optional) :</label><br>
        <input type="text" id="workout_url" name="workout_url" value=""><br><br>
        
        <label for="date">Workout Dates:</label><br>
        <input type="text" id="workout_date" name="workout_date" value="${new_date}"><br><br>
      
        <label for="workout_length">Workout Length (optional) :</label><br>
        <input type="text" id="workout_length" name="workout_length" value=" "><br><br>
        
        <label for="toRepeat">Repeat Workout:</label><br>
        <select id="toRepeat" name="toRepeat" class="toRepeat">
          <option value="Y">Y</option>
          <option value="N" selected>N</option>
        </select><br><br>
        
        <label for="workout_comment">Workout Comment (optional) :</label><br>
        <input type="text" id="workout_comment" name="workout_comment" value=""><br><br><br>
        <input type="submit" value="Add Workout" formaction="/update_db_workout">
        <input type="submit" value="Cancel" formaction="/">
      </form> 
    </body>
    </html>
    `
  return add_workout_html_body
  }
