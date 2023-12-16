const userOrEmailInput = document.getElementById('studentId');
const error = document.getElementById('error');
const passwdInput = document.getElementById('passwd');
const loginForm = document.getElementById('loginbtn');
const loader = document.querySelector('.loader');

//     axios.post("/signIn")
//         .then(response => {
//             console.log(response.data);
//             if (response.data.isLogged) {
//                 passwdInput.style.border = "2px solid green";
//             }
//             else {
//                 passwdInput.style.border = "2px solid red";
//                 passwdInput.textContent = "wrong password.check again!"
//             }

//         })

//         .catch(error => {
//             console.log("error", error);
//         })
// })

// userOrEmailInput.addEventListener("blur", () => {
//     const usernameOrEmail = userOrEmailInput.value;
//     console.log(usernameOrEmail);
//     if (usernameOrEmail) {
//         axios.post("/check-Validity", { usernameOrEmail })
//             .then(response => {
//                 console.log(response.data.isValidity);
//                 if (response.data.isValidity) {

//                     userOrEmailInput.style.border = "2px solid red";
//                     error.textContent = " 🚫 Invalid userName or email Id"

//                 }
//                 else {
//                     userOrEmailInput.style.border = "2px solid green";
//                     error.textContent = "User Found ✅"
//                 }
//             })
//             .catch(error => {
//                 console.log("error in checking", error);
//             })
//     }

// })

// signIn();

check.onclick = togglePassword;
function togglePassword() {
  if (check.checked) {
    passwd.type = 'text';
  } else {
    passwd.type = 'password';
  }
}

const facultybtn = document.querySelector('.facultybtn');
const studentbtn = document.querySelector('.studentbtn');
const facultysignin = document.querySelector('.facultyLoginForm');
const studentsignin = document.querySelector('.studentLoginForm');

facultybtn.addEventListener('click', () => {
  loader.classList.remove('hidden');
  studentsignin.classList.add('hidden');
  setTimeout(() => {
    studentbtn.classList.remove('sactive');
    studentsignin.classList.add('hidden');
    facultysignin.classList.remove('hidden');
    facultybtn.classList.add('factive');
    loader.classList.add('hidden');
  }, 1000);
});

studentbtn.addEventListener('click', () => {
  loader.classList.remove('hidden');
  facultysignin.classList.add('hidden');
  setTimeout(() => {
    studentsignin.classList.remove('hidden');
    facultysignin.classList.add('hidden');
    facultybtn.classList.remove('factive');
    studentbtn.classList.add('sactive');
    loader.classList.add('hidden');
  }, 1000);
});
