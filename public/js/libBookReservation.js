//Serach features
const searchbtn = document.querySelector('.searchbtn');
const container = document.querySelector('.container');
const searchHeader = document.querySelector('.search-header');
const booksContainer = document.querySelector('.book-container');
const searchInput = document.querySelector('.searchInput');
const bookName = document.querySelectorAll('.book-name');
const msg = document.querySelector('.msg');
console.log(bookName);
const book = document.querySelectorAll('.book');
console.log(book);
searchInput.addEventListener('input', e => {
  const value = e.target.value;

  if (value) {
    searchHeader.classList.add('hidden');

    booksContainer.classList.remove('hidden');
    msg.classList.add('hidden');
  } else {
    searchHeader.classList.remove('hidden');

    booksContainer.classList.add('hidden');
    msg.classList.add('hidden');
  }
});

// searchInput.addEventListener("keydown", (e) => {
//     if (e.key === "Enter") {
//         searchbtn.click();
//     }
// })

const books = [
  {
    book_id: 1,
    book_title: 'The Pragmatic programmer',
    author: 'Andrew Hunt, David Thomas',
    latest_edition: 'Second (20th Anniversary Edition)',
    publishers: 'Addison-Wesley Professional',
    book_img: 'b1.jpg',
    book_discription:
      ' Since its creation in 1999 by its authors to aid its clientele to develop better software,The Pragmatic Programmer has succeeded in becoming one of the highly-revered programming books. This book is for every coder looking to transcend to be a skilled software developer and a full-fledged programmer.',
  },
  {
    book_id: 2,
    book_title: 'Head First Design Patterns',
    author: 'Eric Freeman',
    latest_edition: 'First',
    publishers: "O'Reilly Media",
    book_img: 'b2.jpg',
    book_discription:
      'The Head First book series is known for its innovative way of breaking down complex topics intosimpler, easy-to-understand units. The Head First Design Patterns: A Brain-Friendly Guide is compiled based on this tried-and-tested formula.There is a galore of illustrative and brain-stimulating examples in the Head First Design Patternsbook that will make learning both efficient and fun simultaneously.',
  },
  {
    book_id: 3,
    book_title: 'Artificial Intelligence',
    author: 'Jhon paul',
    latest_edition: '',
    publishers: 'pearson',
    book_img: 'b3.jpg',
    book_discription: '',
  },
  {
    book_id: 4,
    book_title: 'Eloquent JavaScript',
    author: 'marjin',
    latest_edition: '',
    publishers: 'pearson',
    book_img: 'b4.jpg',
    book_discription: '',
  },

  {
    book_id: 5,
    book_title: 'C++ Primer',
    author: 'stanly,josee,barbara',
    latest_edition: '',
    publishers: 'pearson',
    book_img: 'b5.jpg',
    book_discription: '',
  },
  {
    book_id: 6,
    book_title: 'C Programming',
    author: 'greg perry',
    publishers: 'perason',
    latest_edition: '',
    book_img: 'b6.jpg',
    book_discription: '',
  },
  {
    book_id: 7,
    book_title: 'Head First Java',
    author: 'Eric',
    publishers: "O'relly",
    latest_edition: 'greg perry',
    book_img: 'b7.jpg',
    book_discription: '',
  },
];

const bookContainer = document.querySelector('.book-container');
const reservebtns = document.querySelectorAll('.btn1');
let count = 0;
let disabled = false;
books.forEach(book => {
  const html = `  <div class="book">
  <img class="book-cover" src="./imgs/${book.book_img}" alt="Book 1 Cover">
  <h3 class="book-name">${book.book_title}</h3>
  <button class="btn1">Reserve</button>
  <button class="btn2">Learn More</button>

  <div class="bookmodal hidden">
      <button class="close-modal">&times;</button>
      <img class="book-cover" src="${book.book_img}" alt="Book 1 Cover">
      <h3>Author</h3> - ${book.author}
      <h3>Latest Edition</h3> - ${book.latest_edition}
      <h3>Publisher</h3> -${book.publishers}

      <h3>About Book:</h3>
      <p>${book.book_discription}</p>

  </div>
</div>`;
  const date = new Date().getDate();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fir', 'Sat'];
  const day = new Date().getDay();
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  const hours = new Date().getHours();
  const minutes = new Date().getMinutes();
  const seconds = new Date().getSeconds();
  // console.log(time)
  const bookedDate = ` ${days[day]} ${date} ${months[month]}  ${year} at ${hours}:${minutes}:${seconds}`;

  bookContainer.insertAdjacentHTML('afterbegin', html);

  if (!disabled) {
    const reserveBtn = bookContainer.querySelector('.btn1');
    reserveBtn.addEventListener('click', () => {
      reserveBook(book, bookedDate);
      reserveBtn.textContent = 'Booked';
      reserveBtn.style.backgroundColor = 'grey';

      setTimeout(() => {
        msg.classList.remove('hidden');
        reserveBtn.style.display = 'none';
      }, 1000);
      setTimeout(() => {
        msg.classList.add('hidden');
        // reserveBtn.style.display = "none"
      }, 5000);

      count++;
      msg.textContent = `you reserved ${count} books for now. Feel free to book again!`;
      // msg.textContent = "you reserved 2 books for now.it was limited for day."
    });
  }
});

async function reserveBook(book, bookedDate) {
  await axios
    .post('/bookReservation', { book: book, bookedDate: bookedDate })
    .then(response => {
      console.log(response);
    });
}

const btn2 = document.querySelectorAll('.btn2');
const bookmodal = document.querySelectorAll('.bookmodal');
const closeModal = document.querySelectorAll('.close-modal');
console.log(btn2.length);
console.log(bookmodal.length);
for (let i = 0; i < btn2.length; i++) {
  btn2[i].addEventListener('click', () => {
    bookmodal[i].classList.remove('hidden');

    closeModal[i].addEventListener('click', () => {
      bookmodal[i].classList.add('hidden');
    });
  });
  // window.addEventListener("click", (e) => {
  //     if (e.target === bookmodal) {
  //         bookmodal[i].classList.add("hidden");
  //     })
}
searchInput.addEventListener('input', e => {
  const value = e.target.value;
  console.log(value);
  for (let i = 0; bookName.length; i++) {
    let bookNameValue = book[i].getElementsByClassName('book-name')[0];
    console.log('bookname', bookNameValue);

    if (bookNameValue) {
      let textvalue = bookNameValue.textContent || bookNameValue.innerHTML;
      console.log(textvalue);

      if (textvalue.toUpperCase().indexOf(value.toUpperCase()) > -1) {
        book[i].style.display = '';
      } else {
        book[i].style.display = 'none';
      }
    }
  }
});
