// importing modules

const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 8007;
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
app.set('view engine', 'html');

// sqlCredentials importing
const sqlDbCredentials = require('./db/sqlDbCredentials.js');

// Function to create db connection
function createDbConnection() {
  return mysql.createConnection(sqlDbCredentials);
}

// HANDLING HTTP REQUESTS
app.get('/forgotPassword', (req, res) => {
  const filePath = __dirname + '/public/forgotPassword.html';
  res.sendFile(filePath);
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

    for (let i = 1; i < mainData.length; i++) {
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

// user account details after account creation
app.post('/signUp', async (req, res) => {
  const mysqlConnection = createDbConnection();

  mysqlConnection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
  });

  const uname = req.body.uname;
  const email = req.body.email;
  const passwd = req.body.passwd;

  // Hash the password
  const hashedPassword = await bcrypt.hash(passwd, 10);

  console.log(hashedPassword);

  // Insert the user
  mysqlConnection.query(
    'INSERT INTO users VALUES (?, ?, ?)',
    [uname, email, hashedPassword],
    (err, results) => {
      if (err) {
        console.log('Error:', err);
        const message =
          "<script>alert('username or email id already in use.Choose diferrent username or email id'); window.location.href='signupform.html'</script>";
        res.status(500).send(message);
        return;
      }
      const message =
        "<script>alert('Sign up successful.'); window.location.href='signinform.html'</script>";
      res.send(message);
    }
  );
  // } .catch (error) {
  //   console.error('Error:', error);
  //   res.status(500).send('An error occurred while signing up.');
  // }
});

app.post('/check-Availability', (req, res) => {
  const { userName, email } = req.body;

  console.log({ email, userName });

  const mysqlConnection = createDbConnection();

  mysqlConnection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
    // Your code here
  });

  mysqlConnection.query(
    'SELECT COUNT(*) AS userNameCount FROM users WHERE user_name=?',
    [userName],
    (err, userNameResults) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error checking email availability');
        return;
      }

      mysqlConnection.query(
        'SELECT COUNT(*) AS emailCount FROM users WHERE user_email= ?',
        [email],
        (err, emailResults) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error checking email availability');
            return;
          }

          const emailExists = emailResults[0].emailCount > 0;
          const userNameExists = userNameResults[0].userNameCount > 0;

          res.json({
            email: emailExists,
            userName: userNameExists,
          });
        }
      );
    }
  );
});

app.post('/signIn', (req, res) => {
  const mysqlConnection = createDbConnection();

  mysqlConnection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
    // Your code here
  });

  const usernameOrEmail = req.body.unameOrEmail;
  const password = req.body.passwd;
  console.log(usernameOrEmail);

  // excute query

  mysqlConnection.query(
    'SELECT * FROM users WHERE  user_name=? OR user_email=?',
    [usernameOrEmail, usernameOrEmail],
    async (err, results) => {
      console.log(results);
      if (err) {
        console.log('Invalid query', err);
      }

      try {
        if (results.length === 0) {
          // res.render("check");
          res.json({ isInvalidDetails: true });
        } else if (results.length !== 0) {
          const passwordMatch = await bcrypt.compare(
            password,
            results[0].hashedPassword
          );

          if (passwordMatch) {
            res.json({ isLogged: true });
          } else {
            res.json({ isLogged: false });
            //   const message =
            //     "<script>alert('invalid password'); window.location.href='signinform.html'</script>";
            //   res.send(message);
          }
        }
        // console.log(results);
      } catch {
        res.json({ error: true });
      }
    }
  );
});
app.get('/dashBoard', (req, res) => {
  const filePath = __dirname + '/public/dashBoard.html';
  res.sendFile(filePath);
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

app.post('/dashBoard', (req, res) => {});

app.post('/updateInfo', (req, res) => {
  res.send('updated success.');
});
app.post('/changePasswd', (req, res) => {
  res.send('Password changed successfully');
});

app.post('/updateProfilePic', (req, res) => {
  res.send('uploaded.');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`app listening on port ${port}`);
});
