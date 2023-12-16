const emailInput = document.getElementById('email');
const userNameInput = document.getElementById('uname');
const userNameAvailability = document.getElementById('userAvailability');
const emailAvailability = document.getElementById('emailAvailability');
const signUpForm = document.getElementById('signup');

userNameInput.addEventListener('blur', () => {
  const userName = userNameInput.value;
  console.log(userName);
  if (userName) {
    axios
      .post('/check-Availability', { userName })
      .then(response => {
        console.log(response.data.userName);
        if (response.data.userName) {
          userNameInput.style.border = '2px solid red';
          userNameAvailability.textContent =
            '🚫 username is already in use .please login';
        } else {
          userNameInput.style.border = '2px solid green';
          userNameAvailability.textContent = '🔥 username is available';
        }
      })
      .catch(error => {
        console.log('Error checking ', error);
      });
  }
});

emailInput.addEventListener('blur', () => {
  const email = emailInput.value;
  console.log(email);
  if (email) {
    axios
      .post('/check-Availability', { email })
      .then(response => {
        console.log(response.data.email);
        if (response.data.email) {
          emailInput.style.border = '2px solid red';
          emailAvailability.textContent =
            '🚫 email is already in use.Please login';
        } else {
          emailInput.style.border = '2px solid green';
          emailAvailability.textContent = '🔥 email is available.';
        }
      })
      .catch(error => {
        console.log('error checking'.error);
      });
  }
});

// signUpForm.addEventListener("submit", async (event) => {
//   event.preventDefault();

//   await axios.post("/signUp", new URLSearchParams(new FormData(event.target))
//   )
// });

check.onclick = togglePassword;
function togglePassword() {
  if (check.checked) {
    passwd.type = 'text';
  } else {
    passwd.type = 'password';
  }
}

function validateForm() {
  const email = document.getElementById('email');
  const username = document.getElementById('uname');
  const password = document.getElementById('passwd');

  if (username.value == '') {
    alert('Username must be filled out');
    return false;
  } else if (/^[a-zA-Z0-9]$/.test(username.value)) {
    username.style.border = '2px solid green';

    return true;
  }

  if (email.value == '') {
    alert('email must be filled out');
    return false;
  } else if (
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email.value)
  ) {
    email.style.border = '2px solid green';

    return true;
  }
  if (password.value == '') {
    alert('Password must be filled out');
    return false;
  }
  if (!/^[a-z0-9]{8,}$/.test(password.value)) {
    alert(
      'Password must be at least 8 characters and contain only lowercase letters and numbers'
    );
    return false;
  }
}

const facultybtn = document.querySelector('.facultybtn');
const studentbtn = document.querySelector('.studentbtn');
const facultysignup = document.querySelector('.facultysignupForm');
const studentsignup = document.querySelector('.studentsignupForm');

facultybtn.addEventListener('click', () => {
  studentbtn.classList.remove('active');
  studentsignup.classList.add('hidden');
  facultysignup.classList.remove('hidden');
  facultybtn.classList.add('active');
});

studentbtn.addEventListener('click', () => {
  studentsignup.classList.remove('hidden');
  facultysignup.classList.add('hidden');
  facultybtn.classList.remove('active');
  studentbtn.classList.add('active');
});
