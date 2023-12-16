//profile pic feature
const pic = document.getElementById('profilepic');

const input = document.getElementById('pic');

input.addEventListener('change', event => {
  pic.src = URL.createObjectURL(event.target.files[0]);
});

//dropDown feature
const dropdownbtn = document.querySelector('.dropdown-btn');
const overlay = document.querySelector('.overlay');

let dropdown = document.getElementsByClassName('dropdown-btn');
let i;

for (i = 0; i < dropdown.length; i++) {
  dropdown[i].addEventListener('click', function () {
    // this.classList.toggle("active");
    var dropdownContent = this.nextElementSibling;
    if (dropdownContent.style.display === 'block') {
      dropdownContent.style.display = 'none';
    } else {
      dropdownContent.style.display = 'block';
    }
  });
}
dropdownbtn.addEventListener('click', () => {
  console.log(dropdownbtn);
  overlay.classList.remove('hidden');
});

overlay.addEventListener('click', () => {
  console.log('clicked');
  document.querySelector('.dropdown-content').style.display = 'none';
  overlay.classList.add('hidden');
});

//library book reservation
const libreservebtn = document.querySelector('.libReserve');
const box_2 = document.querySelector('.box-2');
const box_4 = document.querySelector('.box-4');
const profileSettings = document.querySelector('.profileSettings');
profileSettings.style.backgroundColor = '#077397';

let studentReservationHistory = [];
let reservationHistory = [];

libreservebtn.addEventListener('click', async () => {
  console.log('btn clicked');
  box_2.classList.add('hidden');
  box_4.classList.remove('hidden');
  libreservebtn.classList.add('active');
  libreservebtn.style.backgroundColor = '#077397';
  profileSettings.style.backgroundColor = '';
});
async function studentreservedBooks() {
  await axios.get('getSessionData').then(async response => {
    const data = response.data;
    console.log(data);

    await axios.get('/reservedBooks').then(response => {
      const reservedBooks = response.data;
      console.log(reservedBooks);

      reservationHistory.push(reservedBooks);
    });
    reservationHistory[0].filter(book => {
      console.log('book', book);
      console.log('data', data);
      if (book.studentId === data.userData.user_id) {
        studentReservationHistory.push(book);
      }
    });
  });

  console.log('reserved Books:', reservationHistory);
  console.log('specific student books:', studentReservationHistory);
  studentReservationHistory.forEach(book => {
    console.log(book);
    const html = `<div class="reservedBooks"> 
 <img class="bookCover" src="./imgs/b${book.book_id}.jpg" alt="book img">
 <div class= "bookInfo" >
     <h4>studentId:<p class="bookDetails">${book.studentId}</p></h4>
     <h4>Book title:<p class="bookDetails">${book.book_title}</p></h4>
     <h4>Author:<p class="bookDetails">${book.author}</p></h4>
     <h4>publishers:<p class="bookDetails">${book.publishers}</p></h4>
     <h4>book edition:<p class="bookDetails">${book.book_edition}</p></h4>

 </div >
 <div class="date">
    <h4>Booked On :</h4><p class="bookDetails">${book.booked_date}</p>
   </div>

 
   

</div >`;

    document
      .querySelector('.reservedContainer')
      .insertAdjacentHTML('afterbegin', html);
  });
}

let rejectedBooks = [];
let rejectedBooksHistory = [];
async function studentRejectedBooks() {
  await axios.get('getSessionData').then(async response => {
    const data = response.data;
    console.log(data);

    await axios.get('/rejectedBooks').then(response => {
      const books = response.data;
      console.log('rejected Books', books);

      rejectedBooks.push(books);
    });
    rejectedBooks[0].filter(book => {
      console.log('rejected book', book);
      console.log(' user data', data);
      if (book.studentId === data.userData.user_id) {
        rejectedBooksHistory.push(book);
      }
    });
  });

  console.log('rejected Books:', rejectedBooks);
  console.log('specific studentrejected books:', rejectedBooksHistory);
  rejectedBooksHistory.forEach(book => {
    console.log(book);
    const html = `<div class="reservedBooks"> 
 <img class="bookCover" src="./imgs/b${book.book_id}.jpg" alt="book img">
 <div class= "bookInfo" >
     <h4>studentId:<p class="bookDetails">${book.studentId}</p></h4>
     <h4>Book title:<p class="bookDetails">${book.book_title}</p></h4>
     <h4>Author:<p class="bookDetails">${book.author}</p></h4>
     <h4>publishers:<p class="bookDetails">${book.publishers}</p></h4>
     <h4>book edition:<p class="bookDetails">${book.book_edition}</p></h4>

 </div >
 <div class="date">
    <h4>rejected On :</h4><p class="bookDetails">${book.rejected_date}</p>
   </div>

  
   <div class="reason">
       <h2>Reason:</h2>
      <p>${book.reason}</p>
      </div>
 
   

</div >`;

    document
      .querySelector('.rejectedContainer')
      .insertAdjacentHTML('afterbegin', html);
  });
}

let completedBooks = [];
let completedBooksHistory = [];
async function studentCompletedBooks() {
  await axios.get('getSessionData').then(async response => {
    const data = response.data;
    console.log(data);

    await axios.get('/completedBooks').then(response => {
      const books = response.data;
      console.log('completed Books', books);

      completedBooks.push(books);
    });
    completedBooks[0].filter(book => {
      console.log('completed book', book);
      console.log(' user data', data);
      if (book.studentId === data.userData.user_id) {
        completedBooksHistory.push(book);
      }
    });
  });

  console.log('completed Books:', completedBooks);
  console.log('specific studentcompleted books:', completedBooksHistory);
  completedBooksHistory.forEach(book => {
    console.log(book);
    const html = `<div class="reservedBooks"> 
 <img class="bookCover" src="./imgs/b${book.book_id}.jpg" alt="book img">
 <div class= "bookInfo" >
     <h4>studentId:<p class="bookDetails">${book.studentId}</p></h4>
     <h4>Book title:<p class="bookDetails">${book.book_title}</p></h4>
     <h4>Author:<p class="bookDetails">${book.author}</p></h4>
     <h4>publishers:<p class="bookDetails">${book.publishers}</p></h4>
     <h4>book edition:<p class="bookDetails">${book.book_edition}</p></h4>

 </div >
 <div class="date">
    <h4>completed On :</h4><p class="bookDetails">${book.completed_date}</p>
   </div>

 
   

</div >`;

    document
      .querySelector('.completedContainer')
      .insertAdjacentHTML('afterbegin', html);
  });
}
studentreservedBooks();
studentRejectedBooks();
studentCompletedBooks();

//profile Settings contents
profileSettings.addEventListener('click', () => {
  box_2.classList.remove('hidden');
  box_4.classList.add('hidden');
  libreservebtn.style.backgroundColor = '';
  profileSettings.style.backgroundColor = '#077397';
});

// library book reservation features
const completedBtn = document.querySelector('.completedBtn');
const rejectedBtn = document.querySelector('.rejectedBtn');
const reservedBtn = document.querySelector('.reservedBtn');
reservedBtn.style.backgroundColor = '#4383be';
const reserveBooksContainer = document.querySelector('.reservedContainer');
const completedBooksContainer = document.querySelector('.completedContainer');
const rejectedBooksContainer = document.querySelector('.rejectedContainer');

document.addEventListener('DOMContentLoaded', function () {
  completedBtn.addEventListener('click', () => {
    reserveBooksContainer.classList.add('hidden');
    completedBooksContainer.classList.remove('hidden');
    completedBtn.style.backgroundColor = '#06eeee';
    reservedBtn.style.backgroundColor = '';
    rejectedBtn.style.backgroundColor = '';
    rejectedBooksContainer.classList.add('hidden');
    const html = ``;
  });
});
reservedBtn.addEventListener('click', () => {
  reserveBooksContainer.classList.remove('hidden');
  rejectedBtn.classList.add('hidden');
  completedBtn.classList.add('hidden');
  completedBooksContainer.classList.add('hidden');
  rejectedBooksContainer.classList.add('hidden');
  reservedBtn.style.backgroundColor = '#4383be';
  completedBtn.style.backgroundColor = '';
  rejectedBtn.style.backgroundColor = '';
});
rejectedBtn.addEventListener('click', () => {
  reserveBooksContainer.classList.add('hidden');
  rejectedBooksContainer.classList.remove('hidden');
  completedBooksContainer.classList.add('hidden');
  completedBtn.classList.add('hidden');
  rejectedBtn.classList.add('hidden');
  reservedBtn.style.backgroundColor = '';
  completedBtn.style.backgroundColor = '';
  rejectedBtn.style.backgroundColor = '#c76565';
});
