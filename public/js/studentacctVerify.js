const verifyAcctBtn = document.querySelector('#verifyAcct');
const verifyAccount = document.querySelector('.acctVerify');
const verifyotp = document.querySelector('.verifyotp');
console.log('studentid', document.getElementById('studentId'));
document.getElementById('studentId').focus;
verifyAcctBtn.addEventListener('click', () => {
  verifyAccount.classList.add('hidden');
  verifyotp.classList.remove('hidden');
});
