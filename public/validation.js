function validateForm() {
  const usernameOrEmail = document.getElementById('unameOrEmail').value;
  const password = document.getElementById('passwd').value;
  if (usernameOrEmail == '') {
    alert('Username must be filled out');
    return false;
  } else if (
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(usernameOrEmail) ||
    /^[a-zA-Z0-9]$/.test(usernameOrEmail)
  ) {
    usernameOrEmail.style.border = '2px solid green';

    return true;
  }
  if (password == '') {
    alert('Password must be filled out');
    return false;
  }
  if (!/^[a-z0-9]{8,}$/.test(password)) {
    alert(
      'Password must be at least 8 characters and contain only lowercase letters and numbers'
    );
    return false;
  }
}
