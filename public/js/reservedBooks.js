const main = document.querySelector('.main');
const bookCover = document.querySelector('.bookCover');
const rejectBtns = document.querySelectorAll('.reject');

axios.get('/reservedBooks').then(response => {
  let reservedBooks = response.data;
  console.log(reservedBooks);

  reservedBooks.forEach(book => {
    const html = `<div class="container"> 
                    <div class="reservedBook">
            <img class="bookCover" src="./imgs/b${book.book_id}.jpg" alt="book img">
            <div class= "bookInfo" >
                <h4>studentId:<p class="bookDetails">${book.studentId}</p></h4>
                <h4>Book title:<p class="bookDetails">${book.book_title}</p></h4>
                <h4>Author:<p class="bookDetails">${book.author}</p></h4>
                <h4>publishers:<p class="bookDetails">${book.publishers}</p></h4>
                <h4>book edition:<p class="bookDetails">${book.book_edition}</p></h4>
                <h4>booked date:<p class="bookDetails">${book.booked_date}</p></h4>

            </div >
                <div class="controls">
                    <button class="complete">mark as complete</button>
                    <button class="reject">Reject</button>
                    <button class="cancel hidden">remove from list</button>

                </div>
         
                <h2 class="completedMsg hidden">Completed</h2>
    </div>
    <div class="reason hidden">
        <h4>Provide reason for Rejection--</h4>
        <form action="/rejectedBooks" id="reason">
            <label for="reason1"> <input type="radio" name="reason" id="reason1" value="Availble books are already reserved by another students"> Availble books are already reserved by another students.</label> 
                <label for="reason2"><input type="radio" name="reason" id="reason2"  value="You didn't apply for library registration.Please register for libray identity card"> You didn't apply for library registration.Please register for libray identity card. <a href="#">click here to apply</a>.</label> 
                <label for="reason3"><input type="radio" name="reason" id="reason3"  value="Duplicate reservation requests for the same book"> Duplicate reservation requests for the same book.</label> 
                <label for="reason4"><input type="radio" name="reason" id="reason4"  value="Incomplete or inaccurate information provided in the reservation"> Incomplete or inaccurate information provided in the reservation.</label> 
                <label for="reason5"><input type="radio" name="reason" id="reason5"  value=" The student has exceeded the maximum allowed reservations"> The student has exceeded the maximum allowed reservations.</label>

                <button class="reasonCancelbtn">Cancel</button>
                <button class="reasonbtn">Submit</button>

        </form>
    </div>
        </div >`;

    main.insertAdjacentHTML('afterbegin', html);

    const rejectBtn = document.querySelector('.reject');
    const reservedBook = document.querySelector('.reservedBook');
    const container = document.querySelector('.container');
    const reason = container.querySelector('.reason');
    const reasonbtn = container.querySelector('.reasonbtn');

    //reject btn event handler
    rejectBtn.addEventListener('click', () => {
      reservedBook.classList.add('hidden');
      container.querySelector('.reason').classList.remove('hidden');
    });

    //submiting reason event handler
    reasonbtn.addEventListener('click', e => {
      e.preventDefault();
      const date = new Date().getDate();
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fir', 'Sat'];
      const day = new Date().getDay();
      const year = new Date().getFullYear();
      const hours = new Date().getHours();
      const minutes = new Date().getMinutes();
      const seconds = new Date().getSeconds();
      // console.log(time)
      const rejectedDate = `${date} ${days[day]} ${year} at ${hours}:${minutes}:${seconds}`;

      rejectedBooks(container, book, rejectedDate);
    });
    //reason component cancel btn
    document.querySelector('.reasonCancelbtn').addEventListener('click', e => {
      e.preventDefault();
      reservedBook.classList.remove('hidden');
      container.querySelector('.reason').classList.add('hidden');
    });

    //complete btn event handling
    document.querySelector('.complete').addEventListener('click', () => {
      container.style.filter = 'grayscale()';
      container.querySelector('.completedMsg').classList.remove('hidden');
      rejectBtn.classList.add('hidden');
      container.querySelector('.complete').classList.add('hidden');

      setTimeout(() => {
        container.style.display = 'none';
        const date = new Date().getDate();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fir', 'Sat'];
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
        const day = new Date().getDay();
        const month = new Date().getMonth();
        console.log(month);
        const year = new Date().getFullYear();
        const hours = new Date().getHours();
        const minutes = new Date().getMinutes();
        const seconds = new Date().getSeconds();
        // console.log(time)
        const completedDate = `${days[day]} ${date} ${months[month]} ${year} at ${hours}:${minutes}:${seconds}`;

        completedBooks(book, completedDate);
      }, 3000);
    });

    //cancel btn event handling
  });
});

// delete rejected books
async function rejectedBooks(container, book, rejectedDate) {
  const reasonForm = container.querySelector('#reason');
  const selecetdReason = reasonForm.querySelector(
    "input[name='reason']:checked"
  );

  if (selecetdReason) {
    const reasonValue = selecetdReason.value;
    await axios
      .post('/rejectedBooks', {
        reason: reasonValue,
        book: book,
        rejectedDate: rejectedDate,
      })
      .then(response => {
        const deleted = response.data;
        if (deleted) {
          container.style.display = 'none';
        }
      });
  } else {
    alert('Please select a reason before submitting.');
  }
}

async function completedBooks(book, completedDate) {
  await axios.post('/completedBooks', {
    book: book,
    completedDate: completedDate,
  });
}
