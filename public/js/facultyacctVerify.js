const form1 = document.getElementById('form1');
const form2 = document.querySelector('#form2');
const form3 = document.querySelector('#form3');
const verifyAcctBtn = document.querySelector('#verifyAcct');
const verifyOtpBtn = document.querySelector('#verifyOtp');
const verifyAccount = document.querySelector('.acctVerify');
const generateOtp = document.querySelector('.generateOtp');
const generateOtpBtn = document.querySelector('.generateotpBtn');
const verifyotpBtn = document.querySelector('.verifyotpBtn');
const verifyotp = document.querySelector('.verifyotp');
const otp = document.querySelector('.otp');

// form1.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const formData = new FormData(form1)
//     console.log(formData)
//     await axios.post("/facultyacctVerify", formData).then(response => {
//         console.log(response.data)
//         generateOtpBtn.classList.remove("hidden");
//         verifyAccount.classList.add("hidden")

//     })

// })
verifyAcctBtn.addEventListener('click', () => {
  verifyAccount.classList.add('hidden');
  generateOtp.classList.remove('hidden');
});
generateOtpBtn.addEventListener('click', () => {
  generateOtp.classList.add('hidden');
  verifyotp.classList.remove('hidden');
});
