const dropdownbtn = document.querySelector('.dropdown-btn');
const overlay = document.querySelector('.overlay');

let dropdown = document.getElementsByClassName('dropdown-btn');
let i;

for (i = 0; i < dropdown.length; i++) {
  dropdown[i].addEventListener('click', function () {
    // this.classList.toggle("active");
    var dropdownfeatures = this.nextElementSibling;
    if (dropdownfeatures.style.display === 'block') {
      dropdownfeatures.style.display = 'none';
    } else {
      dropdownfeatures.style.display = 'block';
    }
  });
}

dropdownbtn.addEventListener('click', () => {
  console.log(dropdownbtn);
  overlay.classList.remove('hidden');
});

overlay.addEventListener('click', () => {
  console.log('clicked');
  document.querySelector('.dropdown-features').style.display = 'none';

  overlay.classList.add('hidden');
});

const lestGobtn = document.querySelector('.letsGo');
const featuresSection = document.querySelector('.features');
lestGobtn.addEventListener('click', () => {
  const scrollTo = featuresSection.getBoundingClientRect();

  featuresSection.scrollIntoView({
    behavior: 'smooth',
    inline: 'center',
  });
});
