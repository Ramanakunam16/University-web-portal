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
  document.querySelector('.dropdown-features').style.display = 'none';
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
    const data = response.data.userData.user;
    console.log(data);

    await axios.get('/reservedBooks').then(response => {
      const reservedBooks = response.data;
      console.log(reservedBooks);

      reservationHistory.push(reservedBooks);
    });
    reservationHistory[0].filter(book => {
      console.log('book', book);
      console.log('data', data);
      if (book.studentId === data.user_id) {
        studentReservationHistory.push(book);
      }
    });
  });

  console.log('reserved Books:', reservationHistory);
  console.log('specific student books:', studentReservationHistory);
  studentReservationHistory.forEach(book => {
    console.log(book);
    console.log(book.booked_date.toString());
    const bookedDate = new Date(book.booked_date);
    const deadlineDate = new Date(book.booked_date);
    deadlineDate.setDate(deadlineDate.getDate() + 14);
    // console.log(deadlineDate);
    const html = `<div class="books"> 
 <img class="bookCover" src="./imgs/b${book.book_id}.jpg" alt="book img">
 <div class= "bookInfo" >
     <h4>studentId:<p class="bookDetails">${book.studentId}</p></h4>
     <h4>Book title:<p class="bookDetails">${book.book_title}</p></h4>
     <h4>Author:<p class="bookDetails">${book.author}</p></h4>
     <h4>publishers:<p class="bookDetails">${book.publishers}</p></h4>
     <h4>book edition:<p class="bookDetails">${book.book_edition}</p></h4>

 </div >
 <div class="date">
    <h4>Booked On :</h4><p class="bookDetails">${bookedDate.toDateString()}</p>
   </div>
   <div id=""deadline>
   <h4>deadline date :</h4><p class="bookDetails">${deadlineDate.toDateString()}</p>
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
    const data = response.data.userData.user;
    console.log(data);

    await axios.get('/rejectedBooks').then(response => {
      const books = response.data;
      console.log('rejected Books', books);

      rejectedBooks.push(books);
    });
    rejectedBooks[0].filter(book => {
      console.log('rejected book', book);
      console.log(' user data', data);
      if (book.studentId === data.user_id) {
        rejectedBooksHistory.push(book);
      }
    });
  });

  console.log('rejected Books:', rejectedBooks);
  console.log('specific studentrejected books:', rejectedBooksHistory);
  rejectedBooksHistory.forEach(book => {
    console.log(book);
    const html = `<div class="books"> 
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

   <div class="deadlinedate">
 

  
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
    const data = response.data.userData.user;
    console.log(data);

    await axios.get('/completedBooks').then(response => {
      const books = response.data;
      console.log('completed Books', books);

      completedBooks.push(books);
    });
    completedBooks[0].filter(book => {
      console.log('completed book', book);
      console.log(' user data', data);
      if (book.studentId === data.user_id) {
        completedBooksHistory.push(book);
      }
    });
  });

  console.log('completed Books:', completedBooks);
  console.log('specific studentcompleted books:', completedBooksHistory);
  completedBooksHistory.forEach(book => {
    console.log(book);
    const html = `<div class="books"> 
 <img class="bookCover" src="./imgs/b${book.book_id}.jpg" alt="book img">
 <div class= "bookInfo" >
     <h4>studentId:<p class="bookDetails">${book.studentId}</p></h4>
     <h4>Book title:<p class="bookDetails">${book.book_title}</p></h4>
     <h4>Author:<p class="bookDetails">${book.author}</p></h4>
     <h4>publishers:<p class="bookDetails">${book.publishers}</p></h4>
     <h4>book edition:<p class="bookDetails">${book.book_edition}</p></h4>

 </div >
 <div class="date">
    <h4>Accepted On :</h4><p class="bookDetails">${book.completed_date}</p>
    <button class='returnbtn'>Return book</button>
   <span id="returnmsg">${book.returned ? 'Book Returned' : ''}</span>
   </div>

<div class="msg hidden">Do you want Return book?<button class="close">Yes</button>
            <button class="no">No</button>
        </div>


</div >`;

    document
      .querySelector('.completedContainer')
      .insertAdjacentHTML('afterbegin', html);

    const returnbtn = document.querySelector('.returnbtn');
    const msg = document.querySelector('.msg');
    const returnmsg = document.querySelector('#returnmsg');
    const confirmbtn = document.querySelector('.close');
    const rejectbtn = document.querySelector('.no');

    returnbtn.addEventListener('click', async () => {
      console.log('clicked', book);
      msg.classList.remove('hidden');
      confirmbtn.addEventListener('click', async () => {
        await axios.post('/returnedBooks', { book }).then(res => {
          console.log(res.data);
          if (res.data.returned) {
            window.location.reload = '/settings#box-4';
            studentReturnedBooks();
            returnbtn.style.display = 'none';
            returnmsg.innerHTML = 'Book Returned';
            msg.classList.add('hidden');
          }
        });
      });

      rejectbtn.addEventListener('click', () => {
        msg.classList.add('hidden');
      });
    });
    book.returned ? (returnbtn.style.display = 'none') : '';
  });
}

let returnedBooks = [];
let returnedBooksHistory = [];
async function studentReturnedBooks() {
  await axios.get('getSessionData').then(async response => {
    const data = response.data.userData.user;
    console.log(data);

    await axios.get('/returnedBooks').then(response => {
      const books = response.data;
      console.log('returned Books', books);

      returnedBooks.push(books);
    });
    returnedBooks[0].filter(book => {
      console.log('returned book', book);
      console.log(' user data', data);
      if (book.studentId === data.user_id) {
        returnedBooksHistory.push(book);
      }
    });
  });

  console.log('returned Books:', returnedBooks);
  console.log('specific studentreturned books:', returnedBooksHistory);
  returnedBooksHistory.forEach(book => {
    console.log(book);
    const html = `<div class="books"> 
 <img class="bookCover" src="./imgs/b${book.book_id}.jpg" alt="book img">
 <div class= "bookInfo" >
     <h4>studentId:<p class="bookDetails">${book.studentId}</p></h4>
     <h4>Book title:<p class="bookDetails">${book.book_title}</p></h4>
     <h4>Author:<p class="bookDetails">${book.author}</p></h4>
     <h4>publishers:<p class="bookDetails">${book.publishers}</p></h4>
     <h4>book edition:<p class="bookDetails">${book.book_edition}</p></h4>

 </div >
 <div class="date">

    <h4>Returned On :</h4><p class="bookDetails">${book.returned_date}</p>
   </div>
</div >`;

    document
      .querySelector('.returnedContainer')
      .insertAdjacentHTML('afterbegin', html);
  });
}
studentreservedBooks();
studentRejectedBooks();
studentCompletedBooks();
studentReturnedBooks();

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
const returnedBooksContainer = document.querySelector('.returnedContainer');
const returnedbtn = document.querySelector('.returnedbtn');

document.addEventListener('DOMContentLoaded', function () {
  completedBtn.addEventListener('click', () => {
    reserveBooksContainer.classList.add('hidden');
    returnedBooksContainer.classList.add('hidden');
    completedBooksContainer.classList.remove('hidden');
    completedBtn.style.backgroundColor = '#06eeee';
    reservedBtn.style.backgroundColor = '';
    rejectedBtn.style.backgroundColor = '';
    returnedbtn.style.backgroundColor = '';
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
  returnedBooksContainer.classList.add('hidden');
  reservedBtn.style.backgroundColor = '#4383be';
  completedBtn.style.backgroundColor = '';
  rejectedBtn.style.backgroundColor = '';
  returnedbtn.style.backgroundColor = '';
});
rejectedBtn.addEventListener('click', () => {
  reserveBooksContainer.classList.add('hidden');
  rejectedBooksContainer.classList.remove('hidden');
  completedBooksContainer.classList.add('hidden');
  returnedBooksContainer.classList.add('hidden');
  completedBtn.classList.add('hidden');
  rejectedBtn.classList.add('hidden');
  reservedBtn.style.backgroundColor = '';
  completedBtn.style.backgroundColor = '';
  returnedbtn.style.backgroundColor = '';
  rejectedBtn.style.backgroundColor = '#c76565';
});
returnedbtn.addEventListener('click', () => {
  reserveBooksContainer.classList.add('hidden');
  rejectedBooksContainer.classList.add('hidden');
  returnedBooksContainer.classList.remove('hidden');
  completedBooksContainer.classList.add('hidden');
  completedBtn.classList.add('hidden');
  rejectedBtn.classList.add('hidden');
  rejectedBtn.classList.add('hidden');
  reservedBtn.style.backgroundColor = '';
  completedBtn.style.backgroundColor = '';
  rejectedBtn.style.backgroundColor = '';
  returnedbtn.style.backgroundColor = '#333';
});

// book return
