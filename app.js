// importing modules
'use strict';
const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 8005;
const bodyParser = require('body-parser');
const lodash = require('lodash');
const { exec } = require('child_process');
const { execSync } = require('child_process');
const node_xlsx = require('node-xlsx').default;
const fs = require('fs');
// const fileUpload = require('express-fileupload');
const bcrypt = require('bcrypt');
const path = require('path');
const multer = require('multer');
const csv_parser = require('csv-parser');
require('dotenv').config();
const ejs = require('ejs');
const session = require('express-session');
const speakeasy = require('speakeasy');
const nodemailer = require('nodemailer');

//Storing uploaded files in uploads folder locally.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, Date.now() + extname);
  },
});
const upload = multer({ storage: storage });
const memoryStorage = multer.memoryStorage();
const memoryUpload = multer({ storage: memoryStorage });
// Function to always retrive latest uploaded file from uploads folder
function getlatestUploadedFile(uploadDir) {
  const files = fs.readdirSync(uploadDir);

  if (files.length === 0) {
    return null;
  }

  const sortedFiles = files.map(file => {
    const filePath = path.join(uploadDir, file);
    const stat = fs.statSync(filePath);
    return { file, stat };
  });

  sortedFiles.sort((a, b) => {
    b.stat.mtime.getTime() - b.stat.mtime.getTime();
  });
  return sortedFiles[0].file;
}

// expressjs middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(fileUpload());
app.use(express.json());
app.set('views', __dirname + '/public/views');
app.set('view engine', 'ejs');
app.use(
  session({
    secret: 'prototype',
    resave: false,
    saveUninitialized: true,
  })
);

// sqlCredentials importing
const sqlDbCredentials = require('./db/sqlDbCredentials.js');

// Function to create db connection
function createDbConnection() {
  return mysql.createConnection(sqlDbCredentials);
}

// HANDLING HTTP REQUESTS

app.get('/', (req, res) => {
  res.render('index');
});
app.get('/results', (req, res) => {
  res.render('results');
});
app.get('/uploadResults', (req, res) => {
  res.render('uploadResults');
});
app.get('/libBookReservation', isAuthUser, (req, res) => {
  res.render('libBookReservation');
});
app.get('/facultyacctVerify', (req, res) => {
  res.render('facultyacctVerify');
});
app.get('/studentacctVerify', (req, res) => {
  res.render('studentacctVerify');
});
app.get('/login', (req, res) => {
  res.render('signinform');
});
app.get('/studentReservedBooks', (req, res) => {
  res.render('reservedBooks');
});
app.get('/uploadBooks', (req, res) => {
  res.render('uploadBooks');
});
app.get('/forgotPassword', (req, res) => {
  // const filePath = __dirname + '/public/forgotPassword.html';
  res.render('forgotPassword');
});

// READING HTTP REQUETS

// Adding Results Data File to Database
app.post('/addResults', (req, res) => {
  const body = req.body;
  // body = {
  //   RegistrationNumber: 1,
  //   StudentName: "s1",
  //   semNo: 1,
  //   sgpa: 10,
  //   cs1: 9,
  //   cs2: 10,
  //   cs3: 9,
  //   cs4: 10,
  //   cs5: 9,
  // };
  var student_marks_details = [];
  Object.keys(body).forEach(key => {
    if (key.slice(0, 2) == 'cs') {
      student_marks_details.push([
        body.RegistrationNumber,
        body.semNo,
        key,
        body[key],
      ]);
    }
  });
  console.log(student_marks_details);

  // res.send({});

  // connect to Db
  const mysqlConnection = createDbConnection();

  //handling connection error
  mysqlConnection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
  });

  // query execution
  mysqlConnection.query(
    'INSERT INTO studentDetails values(?,?,?,?)',
    [body.RegistrationNumber, body.StudentName, body.semNo, body.sgpa],
    (err, results) => {
      if (err) {
        console.log('Invalid query', err);
      } else {
        console.log(results);
      }
    }
  );
  // query execution
  mysqlConnection.query(
    'INSERT INTO studentMarksDetails values ? ',
    [student_marks_details],
    (err, results) => {
      if (err) {
        console.log('Invalid query', err);
      } else {
        console.log(results);
      }
    }
  );
  // End Connection
  mysqlConnection.end();
});
app.post('/studentMarksDetails', (req, res) => {
  const body = req.body;

  // connection to Db
  const mysqlConnection = createDbConnection();

  // query execution

  mysqlConnection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
  });

  // query execution
  mysqlConnection.query(
    'SELECT * FROM studentMarksDetails where sem = ? AND registrationNumber = ?',
    [body.sem, body.registrationNumber],
    (err, results) => {
      if (err) {
        console.log('Invalid query', err);
      } else {
        console.log('smd:', results);
        res.json(results);
      }
    }
  );

  //End Connection
  mysqlConnection.end();
  // // res.json({
  // //   mainData: [
  // //     { registrationNo: 1, semNo: 1, subjectCode: "cs1", gradePoints: 10 },
  // //     { registrationNo: 1, semNo: 1, subjectCode: "cs2", gradePoints: 10 },
  // //     { registrationNo: 1, semNo: 1, subjectCode: "cs3", gradePoints: 10 },
  // //     { registrationNo: 1, semNo: 1, subjectCode: "cs4", gradePoints: 10 },
  // //     { registrationNo: 1, semNo: 1, subjectCode: "cs5", gradePoints: 10 },
  // //   ],
  // });
});

app.post('/studentDetails', (req, res) => {
  const body = req.body;

  const mysqlConnection = createDbConnection();

  mysqlConnection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
  });

  // excute query
  mysqlConnection.query(
    'SELECT * FROM studentDetails where sem = ? AND registrationNumber = ?',
    [body.sem, body.registrationNumber],
    (err, results) => {
      if (err) {
        console.log('Invalid query', err);
      } else {
        console.log('sd:', results);
        res.json(results);
      }
    }
  );
  //End Connection
  mysqlConnection.end();

  // res.json({
  //   studentDetails: [
  //     { registrationNo: 1, StudentName: "s1", semNo: 1, sGPA: 10 },
  //   ],
  // });
});

//uploading MDB file and reading uploaded file which is stored
app.post('/resultsFileUploadData', (req, res) => {
  // Read excel file
  const workBook = node_xlsx.parse(req.files.resultsFileUpload.data);
  const sheetData = workBook[0].data;
  console.log(req.files.resultsFileUpload.data);
  // const sheetDataColumns = sheetData[0];
  // sheetDataRows = sheetData.slice(1, sheetData.length);

  let mainData = [];
  console.log(mainData);

  const sheetDataLength = sheetData.length;

  for (var i = 1; i < sheetDataLength; i++) {
    let onemainData = {};
    for (var j = 0; j < sheetData[i].length; j++) {
      onemainData[lodash.camelCase(sheetData[0][j])] = sheetData[i][j];
    }
    mainData.push(onemainData);
  }
  //console.log(sheetData[0]);
  console.log(mainData);
  res.send('success');

  var studentResults = [];
  var studentDetails = [];

  for (let i = 0; i < mainData.length; i++) {
    Object.keys(mainData[i]).forEach(key => {
      if (key.slice(0, 2) == 'cs') {
        studentResults.push([
          mainData[i].registrationNumber,
          mainData[i].sem,
          key,
          mainData[i][key],
        ]);
      }
    });

    studentDetails.push([
      mainData[i].registrationNumber,
      mainData[i].studentName,
      mainData[i].sem,
      mainData[i].totalResult,
    ]);
  }
  console.log(studentDetails);
  console.log(studentResults);

  // connect to Db
  //const createDbConnection = require("./db/db.js").creatDbConnection;

  const mysqlConnection = createDbConnection();

  mysqlConnection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
    // Your code here
  });

  // excute query

  mysqlConnection.query(
    'INSERT INTO studentDetails values ?',
    [studentDetails],
    (err, results) => {
      if (err) {
        console.log('Invalid query', err);
      } else {
        console.log(results);
      }
    }
  );
  mysqlConnection.query(
    'INSERT INTO mainData values ? ',
    [studentResults],
    (err, results) => {
      if (err) {
        console.log('Invalid query', err);
      } else {
        console.log(results);
      }
    }
  );
  //End Connection
  mysqlConnection.end();
});

app.post('/upload', upload.single('myfile1'), (req, res) => {
  console.log('file uploaded', req.file);
  const latestUploadedFile = getlatestUploadedFile('uploads/');

  if (latestUploadedFile) {
    const mdbFile = latestUploadedFile;

    console.log(mdbFile);

    // const nonNullMdbFileData = mdbFileData.filter(byte => byte !== 0x00);
    // fs.writeFileSync(mdbFile.name, nonNullMdbFileData);
    // console.log(nonNullMdbFileData);

    const csvFilePath = __dirname + '/uploads/csv_data/data.csv';
    const tableName = 'Amber';

    console.log(tableName);
    const MdbFilePath = path.join('uploads', mdbFile);

    // Convert MDB to CSV
    const mdbToCsvCommand = `mdb-export "${MdbFilePath}" ${tableName} > ${csvFilePath}`;
    console.log('Executing command:', mdbToCsvCommand);
    exec(mdbToCsvCommand, async (error, stdout, stderr) => {
      try {
        if (error) {
          console.error(`Error extracting data: ${error.message}`);
          console.log('s2:', stderr);
          res.status(500).send('Error extracting data');
          return;
        }
        console.log('s1:', stdout);
        console.log('Data extracted successfully');
        // Convert CSV to Excel
      } catch {
        console.log('no file found!');
      }
    });
  }
  let data = [];
  console.log(data);
  const dataPath = __dirname + '/uploads/csv_data/data.csv';

  function onDataProcessingComplete() {
    // console.log('From json:', results);
    console.log('data', typeof data);
    console.log(data);
    const dataLength = data.length;
    const mainData = [];
    // const updatedObj = {};
    for (let i = 1; i < dataLength; i++) {
      const object = data[i];
      const updatedObj = {};
      // console.log('obj:', object);
      Object.keys(object).forEach(key => {
        // console.log(key);
        // const updatedObj = {};
        const updatedKey = lodash.camelCase(key);
        updatedObj[updatedKey] = object[key];
      });
      mainData.push(updatedObj);
    }

    // mainData.push(updatedObj);

    console.log('updatedData:', mainData);

    var studentResults = [];
    var studentDetails = [];

    for (let i = 0; i < mainData.length; i++) {
      Object.keys(mainData[i]).forEach(key => {
        if (key.slice(0, 2) == 'cs') {
          studentResults.push([
            mainData[i].registrationNumber,
            mainData[i].sem,
            key,
            mainData[i][key],
          ]);
        }
      });

      studentDetails.push([
        mainData[i].registrationNumber,
        mainData[i].studentName,
        mainData[i].sem,
        mainData[i].totalResult,
      ]);
    }
    console.log(studentDetails);
    console.log(studentResults);

    // connect to Db
    //const createDbConnection = require("./db/db.js").creatDbConnection;

    const mysqlConnection = createDbConnection();

    mysqlConnection.connect(err => {
      if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
      }
      console.log('Connected to MySQL');
    });

    // excute query

    mysqlConnection.query(
      'INSERT INTO studentDetails values ?',
      [studentDetails],
      (err, results) => {
        if (err) {
          console.log('Invalid query', err);
        } else {
          console.log(results);
        }
      }
    );
    mysqlConnection.query(
      'INSERT INTO studentMarksDetails values ?',
      [studentResults],
      (err, results) => {
        if (err) {
          console.log('Invalid query', err);
        } else {
          console.log(results);
          res.send('uploaded successfully');
        }
      }
    );
    //End Connection
    mysqlConnection.end();
  }

  const columnMap = {
    A: 'STUDENT NAME',
    B: 'REGISTRATION NUMBER',
    C: 'COURSE',
    D: 'SEM',
    E: 'CS1_FORMAL LANGUAGES AND AUTOMETA THEORY',
    F: 'CS2_COMPUTER NETWORKS',
    G: 'CS3_WEB TECHNOLOGY',
    H: 'CS4_DESIGN AND ANALYSIS OF ALGORITHMS',
    I: 'CS5_MACHINE LEARNING',
    J: 'CS6_COMPUTER GRAPHICS',
    K: 'CS7_WEB TECHNOLOGY LAB',
    L: 'CS8_COMPUTER GRAPHICS LAB',
    M: 'TOTAL RESULT',
  };

  fs.createReadStream(dataPath)
    .pipe(csv_parser())
    .on('data', row => {
      console.log('rows:', row);
      const newRow = {};

      for (const field in row) {
        // console.log('rows:', row);
        if (Object.hasOwnProperty.call(row, field) && columnMap[field]) {
          console.log(`${columnMap[field]}:${row[field]}`);
          // Convert numeric values to integers
          if (!isNaN(row[field])) {
            newRow[columnMap[field]] = parseFloat(row[field]);
            //   console.log(row[field]);
            //   console.log(newRow[columnMap[field]]);
          } else {
            newRow[columnMap[field]] = row[field];
          }
        }
      }

      data.push(newRow);
      // console.log("NEW ROW:", newRow);
    })
    .on('end', () => {
      // fs.writeFileSync(
      //   './uploads/mdb_data_in_json/data.json',
      //   JSON.stringify(data, null, 2)
      // );
      onDataProcessingComplete();
    });

  // const filePath = __dirname + '/uploads/mdb_data_in_json/data.json';

  // fs.readFile(filePath, 'utf-8', (err, results) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   try {
  //     // const data = JSON.parse(results);
  //     const mainData = [];
  //     // console.log('From json:', results);
  //     const data = results;
  //     console.log('data', typeof data);
  //     const updatedObj = {};
  //     for (let i = 1; i < results.length; i++) {
  //     const object = data[1];
  //     console.log('obj:', object);
  //     Object.keys(object).forEach(key => {
  //       console.log(key);
  //       // const updatedObj = {};
  //       const updatedKey = lodash.camelCase(key);
  //       updatedObj[updatedKey] = object[key];
  //     });
  //    }
  //     mainData.push(updatedObj);

  //     console.log('updatedData:', mainData);
  //   } catch (err) {
  //     console.log(err);
  //   }

  //   //Db Connection
  //   const mysqlConnection = createDbConnection();

  //   //handling connection error
  //   mysqlConnection.connect(err => {
  //     if (err) {
  //       console.error('Error connecting to MySQL:', err);
  //       return;
  //     }
  //     console.log('Connected to MySQL');
  //   });

  //   // Query Execution
  //   mysqlConnection.query(
  //     'INSERT INTO studentDetails VALUES (?,?,?,?)',
  //     [],
  //     (err, results) => {}
  //   );
  // });
});

// user account creation
// app.post('/signUp', async (req, res) => {
//   const mysqlConnection = createDbConnection();

//   mysqlConnection.connect(err => {
//     if (err) {
//       console.error('Error connecting to MySQL:', err);
//       return;
//     }
//     console.log('Connected to MySQL');
//   });

//   const uname = req.body.uname;
//   const email = req.body.email;
//   const passwd = req.body.passwd;

//   // Hash the password
//   const hashedPassword = await bcrypt.hash(passwd, 10);

//   console.log(hashedPassword);

//   // Insert the user
//   mysqlConnection.query(
//     'INSERT INTO users VALUES (?, ?, ?)',
//     [uname, email, hashedPassword],
//     (err, results) => {
//       if (err) {
//         console.log('Error:', err);
//         const message =
//           "<script>alert('username or email id already in use.Choose diferrent username or email id'); window.location.href='/login'</script>";
//         res.status(500).send(message);
//         return;
//       }
//       const message =
//         "<script>alert('Sign up successful.'); window.location.href='/login'</script>";
//       res.send(message);
//     }
//   );
//   // } .catch (error) {
//   //   console.error('Error:', error);
//   //   res.status(500).send('An error occurred while signing up.');
//   // }
// });

// // checking availability of user crenditials
// app.post('/check-Availability', (req, res) => {
//   const { userName, email } = req.body;

//   console.log({ email, userName });

//   const mysqlConnection = createDbConnection();

//   mysqlConnection.connect(err => {
//     if (err) {
//       console.error('Error connecting to MySQL:', err);
//       return;
//     }
//     console.log('Connected to MySQL');
//     // Your code here
//   });

//   mysqlConnection.query(
//     'SELECT COUNT(*) AS userNameCount FROM users WHERE user_name=?',
//     [userName],
//     (err, userNameResults) => {
//       if (err) {
//         console.error(err);
//         res.status(500).send('Error checking email availability');
//         return;
//       }

//       mysqlConnection.query(
//         'SELECT COUNT(*) AS emailCount FROM users WHERE user_email= ?',
//         [email],
//         (err, emailResults) => {
//           if (err) {
//             console.error(err);
//             res.status(500).send('Error checking email availability');
//             return;
//           }

//           const emailExists = emailResults[0].emailCount > 0;
//           const userNameExists = userNameResults[0].userNameCount > 0;

//           res.json({
//             email: emailExists,
//             userName: userNameExists,
//           });
//         }
//       );
//     }
//   );
// });
// app.post('/facultysignUp', async (req, res) => {
//   const mysqlConnection = createDbConnection();

//   mysqlConnection.connect(err => {
//     if (err) {
//       console.error('Error connecting to MySQL:', err);
//       return;
//     }
//     console.log('Connected to MySQL');
//   });

//   const uname = req.body.funame;
//   const email = req.body.femail;
//   const passwd = req.body.fpasswd;
//   console.log(uname, email, passwd);

//   // Hash the password
//   const hashedPassword = await bcrypt.hash(passwd, 10);
//   mysqlConnection.query(
//     'INSERT INTO faculty VALUES (?, ?, ?)',
//     [uname, email, hashedPassword],
//     (err, results) => {
//       if (err) {
//         console.log('Error:', err);
//         const message =
//           "<script>alert('username or email id already in use.Choose diferrent username or email id'); window.location.href='/login'</script>";
//         res.status(500).send(message);
//         return;
//       }
//     }
//   );
// });

// let results1 = {};

app.post('/studentacctVerify', (req, res) => {
  const studentId = req.body.studentId;
  // const password = req.body.createPasswd;
  console.log(studentId);
  //db connection
  const mysqlConnection = createDbConnection();

  mysqlConnection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
  });
  // excute query

  mysqlConnection.query(
    'SELECT * FROM studentLoginInfo WHERE user_id=?',
    [studentId],
    async (err, results) => {
      console.log(results);
      if (err) {
        console.log(err);
      }

      console.log(results[0].user_id);

      if (results[0].user_id === +studentId) {
        console.log('successfull');
        // res.redirect('/generateOTP');
      } else {
        res.json({
          isvalid: false,
        });
      }
    }
  );
});

app.post('/facultyacctVerify', (req, res) => {
  const facultyId = req.body.facultyId;
  // const email = req.body.emailid;
  console.log(facultyId);
  //db connection
  const mysqlConnection = createDbConnection();

  mysqlConnection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
  });
  // excute query

  mysqlConnection.query(
    'SELECT * FROM facultyLoginInfo WHERE user_id=?',
    [facultyId],
    async (err, results) => {
      console.log(results);
      if (err) {
        console.log(err);
      }

      console.log(results[0].user_id);

      if (results[0].user_id === +facultyId) {
        console.log('successfull');
        // res.redirect('/generateOTP');
      } else {
        res.json({
          isvalid: false,
        });
      }
    }
  );
});
// password creation

let secret;
let otp;
app.post('/studentgenerateOTP', async (req, res) => {
  const email = req.body.emailid;
  console.log(email);

  //db connection
  const mysqlConnection = createDbConnection();

  mysqlConnection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
  });

  mysqlConnection.query(
    'SELECT * FROM studentLoginInfo WHERE user_email=? ',
    [email],
    async (err, results) => {
      console.log(results);
      if (err) {
      } else {
        const userData = results[0];
        if (email === userData.user_email) {
          secret = speakeasy.generateSecret();
          otp = speakeasy.totp({
            secret: secret.base32,
            encoding: 'base32',
          });

          console.log('secret token shared between client and server', secret);
          console.log('one time password', otp);
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'ramanakunam16@gmail.com',
              pass: 'bgdjppxbdfvtlcub',
            },
          });

          const mailOptions = {
            from: 'ramanakunam16@gmail.com',
            to: email,
            subject: 'your one time password(OTP)',
            text: `Your OTP is :${otp}`,
          };
          console.log(email);

          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              console.error('error sennding mail', err);
            } else {
              console.log('email sent', info.response);
            }
          });

          // res.render('otpVerification');
        }
      }
    }
  );
});
app.post('/generateOTP', async (req, res) => {
  const email = req.body.emailid;

  //db connection
  const mysqlConnection = createDbConnection();

  mysqlConnection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
  });

  mysqlConnection.query(
    'SELECT * FROM facultyLoginInfo WHERE user_email=? ',
    [email],
    async (err, results) => {
      if (err) {
      } else {
        const userData = results[0];
        if (email === userData.user_email) {
          secret = speakeasy.generateSecret();
          otp = speakeasy.totp({
            secret: secret.base32,
            encoding: 'base32',
          });

          console.log('secret token shared between client and server', secret);
          console.log('one time password', otp);
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'ramanakunam16@gmail.com',
              pass: 'bgdjppxbdfvtlcub',
            },
          });

          const mailOptions = {
            from: 'ramanakunam16@gmail.com',
            to: email,
            subject: 'your one time password(OTP)',
            text: `Your OTP is :${otp}`,
          };
          console.log(email);

          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              console.error('error sennding mail', err);
            } else {
              console.log('email sent', info.response);
            }
          });

          // res.render('otpVerification');
        }
      }
    }
  );
});
app.post('/otp', (req, res) => {
  const userEnteredOTP = req.body.verifyotp;

  const isValidOTP = speakeasy.totp.verify({
    secret: secret.base32,
    encoding: 'base32',
    token: userEnteredOTP,
    window: 1,
  });

  if (isValidOTP) {
    res.render('createPassword');
  } else {
    res.send('invalid otp');
  }
});
app.post('/studentotp', (req, res) => {
  const userEnteredOTP = req.body.verifyotp;

  const isValidOTP = speakeasy.totp.verify({
    secret: secret.base32,
    encoding: 'base32',
    token: userEnteredOTP,
    window: 1,
  });

  if (isValidOTP) {
    res.render('studentCreatePassword');
  } else {
    res.send('invalid otp');
  }
});
app.post('/passwordCreation', (req, res) => {
  const facultyId = req.body.facultyId;
  const studentId = req.body.studentId;
  const password = req.body.createPasswd;
  console.log(facultyId);
  //db connection
  const mysqlConnection = createDbConnection();

  mysqlConnection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
  });
  // excute query
  if (facultyId) {
    mysqlConnection.query(
      'SELECT * FROM facultyLoginInfo WHERE user_id=?',
      [facultyId],
      async (err, results) => {
        console.log(results);
        if (err) {
          console.log(err);
        }

        console.log(results[0].user_id);

        if (results[0].user_id === +facultyId) {
          const hashedPassword = await bcrypt.hash(password, 10);

          mysqlConnection.query(
            'UPDATE facultyLoginInfo SET hashedPassword=? WHERE user_id=?',
            [hashedPassword, facultyId],
            (err, results) => {
              if (err) {
                console.log(err);
              } else {
                console.log('password  updated');
                res.redirect('login');
              }
            }
          );
          mysqlConnection.end();
        } else {
          console.log('noooo');
        }
      }
    );
  } else {
    mysqlConnection.query(
      'SELECT * FROM studentLoginInfo WHERE user_id=?',
      [studentId],
      async (err, results) => {
        console.log(results);
        if (err) {
          console.log(err);
        }

        console.log(results[0].user_id);

        if (results[0].user_id === +studentId) {
          const hashedPassword = await bcrypt.hash(password, 10);

          mysqlConnection.query(
            'UPDATE studentLoginInfo SET hashedPassword=? WHERE user_id=?',
            [hashedPassword, studentId],
            (err, results) => {
              if (err) {
                console.log(err);
              } else {
                console.log('password  updated');
                res.redirect('login');
              }
            }
          );
          mysqlConnection.end();
        } else {
          console.log('noooo');
        }
      }
    );
  }
});

let profilePic;

// login authentication
app.post('/signIn', async (req, res) => {
  const studentId = req.body.studentId;
  const password = req.body.passwd;
  console.log(studentId);

  //db connection
  const mysqlConnection = createDbConnection();

  mysqlConnection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
  });
  // excute query

  try {
    mysqlConnection.query(
      'SELECT * FROM studentLoginInfo WHERE  user_id=?',
      [studentId],
      async (err, results) => {
        console.log(results);
        if (err) {
          console.log('Invalid query', err);
        }

        if (results.length === 0) {
          // res.render("check");
          res.send('mell');
        } else if (results.length !== 0) {
          const passwordMatch = await bcrypt.compare(
            password,
            results[0].hashedPassword
          );

          if (passwordMatch) {
            // results1 = results[0];
            req.session.results = results[0];
            const userData = req.session.results;
            console.log('results', userData);
            // console.log(req.session.results);
            // req.session.save();
            try {
              mysqlConnection.query(
                'SELECT * FROM studentProfilePics WHERE user_id=?',
                [userData.user_id],
                async (err, results) => {
                  if (err) {
                    console.log(err);
                  }
                  console.log(results);
                  if (results.length !== 0) {
                    const picData = results;
                    profilePic = picData[0];
                    console.log('picdata', profilePic);
                  } else {
                    profilePic = {};
                  }
                }
              );
            } catch {
              console.log('no pics');
            }

            mysqlConnection.end();
            res.redirect('/dashBoard');
            // res.json({ isLogged: true });
          } else {
            res.json({ isLogged: false });
            //   const message =
            //     "<script>alert('invalid password'); window.location.href='signinform.html'</script>";
            //   res.send(message);
          }
        }
        // console.log(results);
      }
    );

    // const userData = req.session.results;
  } catch (error) {
    console.log(error);
  }
});
app.get('/getSessionData', (req, res) => {
  const userData = req.session.results || null;
  res.json({ userData });
});

app.post('/facultysignIn', (req, res) => {
  const facultyId = req.body.facultyId;
  const password = req.body.passwd;
  console.log(facultyId);
  //db connection
  const mysqlConnection = createDbConnection();

  mysqlConnection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
  });

  mysqlConnection.query(
    'SELECT * FROM facultyLoginInfo WHERE  user_id=?',
    [facultyId],
    async (err, results) => {
      console.log(results);
      if (err) {
        console.log('Invalid query', err);
      }

      if (results.length === 0) {
        // res.render("check");
        return;
      } else if (results.length !== 0) {
        const passwordMatch = await bcrypt.compare(
          password,
          results[0].hashedPassword
        );

        if (passwordMatch) {
          // results1 = results[0];
          req.session.results = results[0];
          const userData = req.session.results;
          console.log('results', userData);
          res.render('facultyDashBoard', {
            username: userData.user_name,
          });
        } else {
          const message =
            "<script>alert('invalid password'); window.location.href='signinform.html'</script>";
          res.send(message);
        }
      }
    }
  );
});
function isAuthUser(req, res, next) {
  if (req.session && req.session.results) {
    return next();
  }

  res.redirect('/');
}

// dashboard page
app.get('/dashBoard', isAuthUser, (req, res) => {
  // const filePath = __dirname + '/public/dashBoard.ejs';
  // res.setHeader(
  //   'cache-control',
  //   'no=cache',
  //   'no-store',
  //   'must-revalisate',
  //   'proxy-revalidate'
  // );
  // res.setHeader('Expires', '0');
  // res.setHeader('Pragma', 'no-cache');
  // req.session.results1 = results1;
  // req.session.save();
  // console.log(filePath);
  // res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  // res.setHeader('Content-Disposition', 'inline; filename=dashboard.html');
  const userData = req.session.results;
  console.log(userData);

  if (!profilePic) {
    res.render('dashBoard', {
      username: userData.user_name,
      email: userData.user_email,
      userPic: profilePic.user_name,
      profilePicData: 'no profile pic',
      profilePicMimeType: 'no profile pic',
    });
  } else {
    res.render('dashBoard', {
      username: userData.user_name,
      email: userData.user_email,
      userPic: profilePic.user_name,
      profilePicData: profilePic.data,
      profilePicMimeType: profilePic.mime_type,
    });
  }
});

//booksReservation

app.post('/bookReservation', isAuthUser, (req, res) => {
  const { book, bookedDate } = req.body;
  console.log(book, bookedDate);
  const userData = req.session.results;
  console.log(userData);

  //db connection
  const mysqlConnection = createDbConnection();

  mysqlConnection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
  });

  mysqlConnection.query(
    'INSERT INTO reservedBooks (studentId,book_title,author,publishers,book_edition,book_img,book_id,booked_date) VALUES(?,?,?,?,?,?,?,?)',
    [
      userData.user_id,
      book.book_title,
      book.author,
      book.publishers,
      book.book_edition,
      book.book_img,
      book.book_id,
      bookedDate,
    ]
  );

  mysqlConnection.end();
});
app.post('/rejectedBooks', (req, res) => {
  const { studentId, book_title, author, publishers, book_edition, book_id } =
    req.body.book;
  const rejectedDate = req.body.rejectedDate;
  const reason = req.body.reason;
  console.log(reason);

  //db connection
  const mysqlConnection = createDbConnection();

  mysqlConnection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
  });

  mysqlConnection.query(
    'INSERT INTO rejectedBooks (studentId,book_title,author,publishers,book_edition,reason,book_id,rejected_date) VALUES(?,?,?,?,?,?,?,?)',
    [
      studentId,
      book_title,
      author,
      publishers,
      book_edition,
      reason,
      book_id,
      rejectedDate,
    ]
  );
  res.json({
    deleted: true,
  });

  mysqlConnection.query(
    'DELETE FROM reservedBooks WHERE studentId=? AND book_id=? ',
    [studentId, book_id]
  );
  mysqlConnection.end();
});
app.post('/completedBooks', (req, res) => {
  const { studentId, book_title, author, publishers, book_edition, book_id } =
    req.body.book;
  const completedDate = req.body.completedDate;

  //db connection
  const mysqlConnection = createDbConnection();

  mysqlConnection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
  });

  mysqlConnection.query(
    'INSERT INTO completedBooks (studentId,book_title,author,publishers,book_edition,book_id,completed_date) VALUES(?,?,?,?,?,?,?)',
    [
      studentId,
      book_title,
      author,
      publishers,
      book_edition,
      book_id,
      completedDate,
    ]
  );
  res.json({
    deleted: true,
  });

  mysqlConnection.query(
    'DELETE FROM reservedBooks WHERE studentId=? AND book_id=? ',
    [studentId, book_id]
  );
  mysqlConnection.end();
});
app.get('/reservedBooks', (req, res) => {
  const mysqlConnection = createDbConnection();

  mysqlConnection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
  });

  mysqlConnection.query('SELECT * FROM reservedBooks', (err, results) => {
    console.log(results);

    res.json(results);
  });
});

app.get('/rejectedBooks', (_, res) => {
  const mysqlConnection = createDbConnection();

  mysqlConnection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
  });

  mysqlConnection.query('SELECT * FROM rejectedBooks', (err, results) => {
    console.log(results);

    res.json(results);
  });
});

app.get('/completedBooks', (_, res) => {
  const mysqlConnection = createDbConnection();

  mysqlConnection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
  });

  mysqlConnection.query('SELECT * FROM completedBooks', (err, results) => {
    console.log(results);

    res.json(results);
  });
});

// settings pages
app.get('/settings', isAuthUser, (req, res) => {
  // req.session.results1 = results1;
  // const filePath = __dirname + '/public/settings.ejs';
  const userData = req.session.results;
  if (profilePic === 0) {
    res.render('settings', {
      username: userData.user_name,
      email: userData.user_email,
      userPic: profilePic.user_name,
      profilePicData: 'no profile pic',
      profilePicMimeType: 'no profile pic',
    });
  } else {
    res.render('settings', {
      username: userData.user_name,
      email: userData.user_email,
      userPic: profilePic.user_name,
      profilePicData: profilePic.data,
      profilePicMimeType: profilePic.mime_type,
    });
  }
});

// logout
app.get('/logout', (req, res) => {
  req.session.destroy();

  res.clearCookie('connect.sid');
  res.redirect('/');
});
app.post('/check-Validity', (req, res) => {
  const mysqlConnection = createDbConnection();

  mysqlConnection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
  });

  const emailOrUserName = req.body.usernameOrEmail;
  console.log(emailOrUserName);

  mysqlConnection.query(
    'SELECT * FROM users WHERE user_name=? OR user_email=?',
    [emailOrUserName, emailOrUserName],
    (err, results) => {
      console.log(results);
      if (err) {
        res.send('invalid ');
      }

      const validity = results.length === 0;

      res.json({ isValidity: validity });
    }
  );
});

// app.post('/dashBoard', (req, res) => {});

// update profile info
app.post('/updateInfo', isAuthUser, (req, res) => {
  const username = req.body.uname;
  const email = req.body.email;
  console.log('name', username);
  console.log('email', email);

  //db connection
  const mysqlConnection = createDbConnection();

  mysqlConnection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
  });

  const userData = req.session.results;

  mysqlConnection.query(
    'UPDATE studentLoginInfo SET user_name=CASE WHEN ? IS NOT NULL THEN ? ELSE user_name END,user_email = CASE WHEN ? IS NOT NULL THEN ? ELSE user_email END WHERE user_name=?',
    [username, username, email, email, userData.user_name],
    (err, results) => {
      console.log(results);
      if (err) {
        console.log('Internal error occurs', err);
      }
      // const updatedUserData = results[0];
      // const UpdatedUserData = ;
      // console.log('user', userData);
      userData.user_name = username;
      userData.user_email = email;
      if (profilePic === 0) {
        res.render('settings', {
          username: userData.user_name,
          email: userData.user_email,
          profilePicData: 'no profile pic',
          profilePicMimeType: 'no profile pic',
        });
      } else {
        res.render('settings', {
          username: userData.user_name,
          email: userData.user_email,
          profilePicData: profilePic.data,
          profilePicMimeType: profilePic.mime_type,
        });
      }
    }
  );
  mysqlConnection.end();
  // res.send('updated success.');
});

// change password
app.post('/changePasswd', isAuthUser, async (req, res) => {
  const oldPassword = req.body.opasswd;
  const newPassword = req.body.npasswd;
  const userData = req.session.results;

  //db connection
  const mysqlConnection = createDbConnection();

  mysqlConnection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
  });

  const newHashedPassword = await bcrypt.hash(newPassword, 10);

  const passwordMatch = await bcrypt.compare(
    oldPassword,
    userData.hashedPassword
  );

  if (passwordMatch) {
    mysqlConnection.query(
      'UPDATE users SET hashedPassword=?',
      [newHashedPassword],
      (err, results) => {
        if (err) {
          console.log(err);
        }
        if (profilePic === 0) {
          res.render('settings', {
            username: userData.user_name,
            email: userData.user_email,
            profilePicData: 'no profile pic',
            profilePicMimeType: 'no profile pic',
          });
        } else {
          res.render('settings', {
            username: userData.user_name,
            email: userData.user_email,
            profilePicData: profilePic.data,
            profilePicMimeType: profilePic.mime_type,
          });
        }
      }
    );
  } else {
    res.send('wrong old password.Retry again!');
  }
});

// profile pic upload.
app.post(
  '/saveProfilePic',
  memoryUpload.single('pic'),
  isAuthUser,
  (req, res) => {
    console.log(req.file);
    const originalname = req.file.originalname;
    const buffer = req.file.buffer;
    const mimetype = req.file.mimetype;
    console.log(originalname, buffer, mimetype);

    //db connection
    const mysqlConnection = createDbConnection();

    mysqlConnection.connect(err => {
      if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
      }
      console.log('Connected to MySQL');
    });
    const userData = req.session.results;

    mysqlConnection.query(
      'INSERT INTO usersProfilePics VALUES (?,?,?,?)',
      [userData.user_name, originalname, mimetype, buffer],
      (err, results) => {
        console.log(results);

        if (err) {
          console.log(err);
        }

        mysqlConnection.query(
          'SELECT * FROM usersProfilePics where user_name=?',
          [userData.user_name],
          (err, results) => {
            profilePic = results[0];
            console.log('prifile pic data', profilePic);
          }
        );

        if (profilePic === 0) {
          res.render('settings', {
            username: userData.user_name,
            email: userData.user_email,
            profilePicData: 'no profile pic',
            profilePicMimeType: 'no profile pic',
          });
        } else {
          res.render('settings', {
            username: userData.user_name,
            email: userData.user_email,
            profilePicData: profilePic.data,
            profilePicMimeType: profilePic.mime_type,
          });
        }
      }
    );
    // res.send('uploaded.');
  }
);

// update profile pic

app.post(
  '/updateProfilePic',
  memoryUpload.single('pic'),
  isAuthUser,
  (req, res) => {
    const { originalname, buffer, mimetype } = req.file;
    console.log('file uploaded', req.file);
    // const latestUploadedFile = getlatestUploadedFile('uploads/');
    //db connection
    const mysqlConnection = createDbConnection();

    mysqlConnection.connect(err => {
      if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
      }
      console.log('Connected to MySQL');
    });

    const userData = req.session.results;
    console.log('session data in this route:', userData);
    mysqlConnection.query(
      'UPDATE usersProfilePics SET user_name=?,file_name=?,mime_type=?,data=? WHERE user_name=?',
      [userData.user_name, originalname, mimetype, buffer, userData.user_name],
      (err, results) => {
        if (err) {
          console.log(err);
        }

        mysqlConnection.query(
          'SELECT * FROM usersProfilePics where user_name=?',
          [userData.user_name],
          (err, results) => {
            profilePic = results[0];
            console.log(profilePic);
          }
        );

        if (profilePic === 0) {
          res.render('settings', {
            username: userData.user_name,
            email: userData.user_email,
            profilePicData: 'no profile pic',
            profilePicMimeType: 'no profile pic',
          });
        } else {
          res.redirect('/dashBoard');
        }
      }
    );
  }
);

app.post('/resetPassword', async (req, res) => {
  const email = req.body.email;
  const newPassword = req.body.npasswd;
  const newHashedPassword = await bcrypt.hash(newPassword, 10);
  //db connection
  const mysqlConnection = createDbConnection();

  mysqlConnection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
  });

  mysqlConnection.query(
    'UPDATE users SET hashedPassword=? WHERE user_email=?',
    [newHashedPassword, email],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.render('resetSuccess');
    }
  );
});

app.listen(port, '0.0.0.0', () => {
  console.log(`app listening on port ${port}`);
});
