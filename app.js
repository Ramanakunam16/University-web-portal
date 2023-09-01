// importing
const express = require('express');
const app = express();
const port = 8007;
const bodyParser = require('body-parser');
const lodash = require('lodash');
const { exec } = require('child_process');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const bcrypt = require('bcrypt');

// import express from "express";

// import bodyParser from "body-parser";
// import lodash from "lodash";
// import { exec } from "child_process";
// import node_xlsx from "node-xlsx";
// import fileUpload from "express-fileupload";
// import mysql from "mysql";
// import fs from "fs";

// express middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
const node_xlsx = require('node-xlsx').default;
app.use(fileUpload());
app.use(express.json());

// sqlCredentials importing

const mysql = require('mysql');
// import sqlDbCredentialsjson from "./db/sqlDbCredentials.json";
const sqlDbCredentials = require('./db/sqlDbCredentials.json');

// const fileUpload = require("express-fileupload");

// Function to create db connection
function createDbConnection() {
  return mysql.createConnection(sqlDbCredentials);
}

// app.get("/", (req, res) => {
//   res.send();

//   // connect to Db
//   //const createDbConnection = require("./db/db.js").creatDbConnection;

//   const mysqlConnection = createDbConnection();

//   // excute query
//   mysqlConnection.query();
//   //End Connection
//   mysqlConnection.end();
// });

// app.get("/hello", (req, res) => res.send("hello world"));

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

  res.send({});

  // connect to Db
  //const createDbConnection = require("./db/db.js").creatDbConnection;
  const mysqlConnection = createDbConnection();

  // excute query
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
  // connect to Db
  //const createDbConnection = require("./db/db.js").creatDbConnection;

  const mysqlConnection = createDbConnection();

  // excute query
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
  // //   studentMarksDetails: [
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
  // connect to Db
  //const createDbConnection = require("./db/db.js").creatDbConnection;

  const mysqlConnection = createDbConnection();

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

app.post('/resultsFileUploadData', (req, res) => {
  // Read excel file
  const workBook = node_xlsx.parse(req.files.resultsFileUpload.data);
  const sheetData = workBook[0].data;
  console.log(req.files.resultsFileUpload.data);
  // const sheetDataColumns = sheetData[0];
  // sheetDataRows = sheetData.slice(1, sheetData.length);
  // excel conversion
  const sheetDataLength = sheetData.length;
  let studentMarksDetails = [];
  console.log(studentMarksDetails);
  // let oneStudentMarksDetails = {};
  // for (var k = 0; k < sheetData[0].lengthength; k++) {

  // }
  for (var i = 1; i < sheetDataLength; i++) {
    let oneStudentMarksDetails = {};
    for (var j = 0; j < sheetData[i].length; j++) {
      oneStudentMarksDetails[lodash.camelCase(sheetData[0][j])] =
        sheetData[i][j];
    }
    studentMarksDetails.push(oneStudentMarksDetails);
  }
  //console.log(sheetData[0]);
  console.log(studentMarksDetails[0]);
  res.send('success');

  var studentResults = [];
  var studentDetails = [];

  for (let i = 0; i < studentMarksDetails.length; i++) {
    Object.keys(studentMarksDetails[i]).forEach(key => {
      if (key.slice(0, 2) == 'cs') {
        studentResults.push([
          studentMarksDetails[i].registrationNumber,
          studentMarksDetails[i].sem,
          key,
          studentMarksDetails[i][key],
        ]);
      }
    });

    studentDetails.push([
      studentMarksDetails[i].registrationNumber,
      studentMarksDetails[i].studentName,
      studentMarksDetails[i].sem,
      studentMarksDetails[i].totalResult,
    ]);
  }
  console.log(studentDetails);
  console.log(studentResults);

  // connect to Db
  //const createDbConnection = require("./db/db.js").creatDbConnection;

  const mysqlConnection = createDbConnection();

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
    'INSERT INTO studentMarksDetails values ? ',
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

app.post('/convert', (req, res) => {
  if (!req.files) {
    res.status(400).send('No file uploaded');
    return;
  }

  const mdbFile = req.files.file;
  // if (mdbFile.type !== "application/x-mdb") {
  //   res.status(400).send("Invalid file ");
  //   return;
  // }
  const mdbFileData = mdbFile.data;

  console.log(req.files.file);
  const nonNullMdbFileData = mdbFileData.filter(byte => byte !== 0x00);
  fs.writeFileSync(mdbFile.name, nonNullMdbFileData);
  console.log(mdbFile.name);

  // const nonNullMdbFileData = mdbFileData.filter((byte) => byte !== 0x00);
  // fs.writeFileSync(mdbFileData, nonNullMdbFileData);
  // console.log(nonNullMdbFileData);

  const csvFilePath = `${mdbFile.name}.csv`;
  const tableName = 'excel_data';

  // Convert MDB to CSV
  const mdbToCsvCommand = `mdb-export "${mdbFile.name}" "${tableName}" > "${csvFilePath}"`;
  console.log('Executing command:', mdbToCsvCommand);
  exec(mdbToCsvCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error extracting data: ${error.message}`);
      res.status(500).send('Error extracting data');
      return;
    }
    console.log('Data extracted successfully');
    // Convert CSV to Excel
    const csvData = fs.readFileSync(csvFilePath, 'utf-8');
    const csvRows = csvData.split('\n');
    const xlsxData = csvRows.map(row => [row.split(',')]);
    console.log(xlsxData);
    const xlsxBuffer = xlsx.build([{ name: 'Sheet 1', data: xlsxData }]);
    console.log(xlsxData);
    console.log(xlsxBuffer);

    // Send the xlsx data as a response
    res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
    res.type(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.send(xlsxBuffer);
  });
});

// user account details after account creation
app.post('/signUp', async (req, res) => {
  const mysqlConnection = createDbConnection();
  const uname = req.body.uname;
  const email = req.body.email;
  const passwd = req.body.passwd;

  // console.log(body);

  // //checking for exiting user and emails
  // try {
  //   // Check if username or email already exists
  //   const existingUser = await new Promise((resolve, reject) => {
  //     mysqlConnection.query(
  //       'SELECT user_name, user_email FROM users WHERE user_name = ? OR user_email = ?',
  //       [uname, email],
  //       (err, results) => {
  //         if (err) {
  //           reject(err);
  //           return;
  //         }
  //         resolve(results[0]);
  //         console.log('results:', results);
  //       }
  //     );
  //   });

  //   if (existingUser) {
  //     if (existingUser.user_name === uname) {
  //       console.log('Username already exists. Please select a new username.');
  //     } else if (existingUser.user_email === email) {
  //       console.log('Email already exists. Please use a different email.');
  //     }
  //     const message =
  //       "<script>alert('Username or email already exists.'); window.location.href='signupform.html'</script>";
  //     res.status(400).send(message);
  //     return;
  //   }
  // console.log(existingUser, existingUser.user_name);

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
        res.status(500).send('An error occurred while signing up.');
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

  // excute query
});

app.post('/check-Availability', (req, res) => {
  const { userName, email } = req.body;

  console.log({ email, userName });

  const mysqlConnection = createDbConnection();

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
  const uname = req.body.uname;
  const password = req.body.passwd;
  // console.log(uname, password);

  // excute query

  mysqlConnection.query(
    'SELECT * FROM users WHERE user_name=?',
    [uname],
    async (err, results) => {
      // console.log(results);
      if (err) {
        console.log('Invalid query', err);
      } else {
        if (results.length === 0 || results[0].user_name !== uname) {
          // res.render("check");
          res.send('invalid user');
        }
        const passwordMatch = await bcrypt.compare(
          password,
          results[0].hashedPassword
        );
        if (passwordMatch) {
          res.send('login successfully');
        } else {
          res.send('INVALID PASSWORD RETRY AGAIN!');
          //   const message =
          //     "<script>alert('invalid password'); window.location.href='signinform.html'</script>";
          //   res.send(message);
        }

        // console.log(results);
      }
    }
  );
});

// app.post("/convert", (req, res) => {
//   const mdbFileData = req.files.file.data;
//   const tableName = "results";

//   fs.readFile(mdbFileData, (err, data) => {
//     if (err) {
//       console.log("error reading file", err);
//     } else {
//       console.log("");
//     }
//     const mdb = new mdbReader(data);
//     const tableData = mdb.table(tableName);
//     console.log(tableData);
//   });
// });

app.listen(port, 'localhost', () => {
  console.log(`app listening on port ${port}`);
});
