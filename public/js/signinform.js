const studentIdValue = document.getElementById('studentId');
const adminidvalue = document.getElementById('facultyId');
const ferror = document.getElementById('ferror');
const serror = document.getElementById('serror');
const spasswdInput = document.getElementById('spasswd');
const fpasswdInput = document.getElementById('fpasswd');
const sloginForm = document.getElementById('sloginbtn');
const floginForm = document.getElementById('floginbtn');
const loader = document.querySelector('.loader');

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

sloginForm.addEventListener('click', async e => {
  e.preventDefault();

  const studentid = studentIdValue.value;
  const passwd = spasswdInput.value;
  await axios.post('/signIn', { studentid, passwd }).then(res => {
    console.log(res);
    if (!res.data.isLogged) {
      serror.innerHTML = 'invalid student id or password';
      setTimeout(() => {
        serror.innerHTML = '';
      }, 3000);
      return;
    }
    if (res.data.isLogged) {
      window.location.href = '/dashBoard';
    }
  });
});
floginForm.addEventListener('click', async e => {
  e.preventDefault();

  const adminid = adminidvalue.value;
  const passwd = fpasswdInput.value;
  await axios.post('/facultysignIn', { adminid, passwd }).then(res => {
    console.log(res);
    if (!res.data.isLogged) {
      ferror.innerHTML = 'invalid admin id or password';
      setTimeout(() => {
        ferror.innerHTML = '';
      }, 3000);
      return;
    }
    if (res.data.isLogged) {
      window.location.href = '/facultyDashBoard';
    }
  });
});
