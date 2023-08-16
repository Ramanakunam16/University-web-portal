const express = require("express");
const app = express();
const port = 8005;
const bodyParser = require("body-parser");
const lodash = require("lodash");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
const node_xlsx = require("node-xlsx").default;
app.use(require("express-fileupload")());

// Db

const mysql = require("mysql");

const sqlDbCredentials = require("./db/sqlDbCredentials.json");

//Function to create db connection
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

app.post("/addResults", (req, res) => {
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
  Object.keys(body).forEach((key) => {
    if (key.slice(0, 2) == "cs") {
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
    "INSERT INTO studentDetails values(?,?,?,?)",
    [body.RegistrationNumber, body.StudentName, body.semNo, body.sgpa],
    (err, results) => {
      if (err) {
        console.log("Invalid query", err);
      } else {
        console.log(results);
      }
    }
  );
  mysqlConnection.query(
    "INSERT INTO studentMarksDetails values ? ",
    [student_marks_details],
    (err, results) => {
      if (err) {
        console.log("Invalid query", err);
      } else {
        console.log(results);
      }
    }
  );
  // End Connection
  mysqlConnection.end();
});
app.post("/studentMarksDetails", (req, res) => {
  const body = req.body;
  // connect to Db
  //const createDbConnection = require("./db/db.js").creatDbConnection;

  const mysqlConnection = createDbConnection();

  // excute query
  mysqlConnection.query(
    "SELECT * FROM studentMarksDetails where sem = ? AND registrationNumber = ?",
    [body.sem, body.registrationNumber],
    (err, results) => {
      if (err) {
        console.log("Invalid query", err);
      } else {
        console.log("smd:", results);
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
app.post("/studentDetails", (req, res) => {
  const body = req.body;
  // connect to Db
  //const createDbConnection = require("./db/db.js").creatDbConnection;

  const mysqlConnection = createDbConnection();

  // excute query
  mysqlConnection.query(
    "SELECT * FROM studentDetails where sem = ? AND registrationNumber = ?",
    [body.sem, body.registrationNumber],
    (err, results) => {
      if (err) {
        console.log("Invalid query", err);
      } else {
        console.log("sd:", results);
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

app.post("/resultsFileUploadData", (req, res) => {
  // Read excel file
  const workBook = node_xlsx.parse(req.files.resultsFileUpload.data);
  const sheetData = workBook[0].data;
  // const sheetDataColumns = sheetData[0];
  // sheetDataRows = sheetData.slice(1, sheetData.length);
  // excel conversion
  const sheetDataLength = sheetData.length;
  let studentMarksDetails = [];
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
  res.send("success");

  var studentResults = [];
  var studentDetails = [];
  for (let i = 0; i < studentMarksDetails.length; i++) {
    Object.keys(studentMarksDetails[i]).forEach((key) => {
      if (key.slice(0, 2) == "cs") {
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
    "INSERT INTO studentDetails values ?",
    [studentDetails],
    (err, results) => {
      if (err) {
        console.log("Invalid query", err);
      } else {
        console.log(results);
      }
    }
  );
  mysqlConnection.query(
    "INSERT INTO studentMarksDetails values ? ",
    [studentResults],
    (err, results) => {
      if (err) {
        console.log("Invalid query", err);
      } else {
        console.log(results);
      }
    }
  );
  //End Connection
  mysqlConnection.end();
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
