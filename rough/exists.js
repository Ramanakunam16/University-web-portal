console.log(body);

//checking for exiting user and emails
try {
  // Check if username or email already exists
  const existingUser = await new Promise((resolve, reject) => {
    mysqlConnection.query(
      'SELECT user_name, user_email FROM users WHERE user_name = ? OR user_email = ?',
      [uname, email],
      (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results[0]);
        console.log('results:', results);
      }
    );
  });

  if (existingUser) {
    if (existingUser.user_name === uname) {
      console.log('Username already exists. Please select a new username.');
    } else if (existingUser.user_email === email) {
      console.log('Email already exists. Please use a different email.');
    }
    const message =
      "<script>alert('Username or email already exists.'); window.location.href='signupform.html'</script>";
    res.status(400).send(message);
    return;
  }
} catch {}

// console.log(existingUser, existingUser.user_name);
