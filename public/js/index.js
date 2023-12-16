window.addEventListener('popstate', event => {
  location.reload();
});
// history.go(-1);
// location.reload("/public/dashBoard.ejs");
const blogsbtn = document.querySelector('.blogbtn');
const major = document.querySelector('.major');

blogsbtn.addEventListener('click', () => {
  major.classList.remove('hidden');
  blogsbtn.classList.add('hidden');
});
