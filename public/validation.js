function validateForm() {
    var username = document.forms["loginForm"]["username"].value;
    var password = document.forms["loginForm"]["passwd"].value;
    if (username == "") {
        alert("Username must be filled out");
        return false;
    }
    if (password == "") {
        alert("Password must be filled out");
        return false;
    }
    if (!/^[a-z0-9]{8,}$/.test(password)) {
        alert("Password must be at least 8 characters and contain only lowercase letters and numbers");
        return false;
    }
}
