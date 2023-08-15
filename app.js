const express = require("express");
const app = express();
const port = 8005;
const bodyParser = require("body-parser");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Db

const mysql = require("mysql");

const sqlDbCredentials = require("./db/sqlDbCredentials.json");

//Function to create db connection
function createDbConnection() {
  return mysql.createConnection(sqlDbCredentials);
}

app.get("/", (req, res) => {
  res.send();

  // connect to Db
  //const createDbConnection = require("./db/db.js").creatDbConnection;

  const mysqlConnection = createDbConnection();

  // excute query
  mysqlConnection.query();
  //End Connection
  mysqlConnection.end();
});

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
    "SELECT * FROM studentMarksDetails where semNo = ? AND registartionNo = ?",
    [body.semNo, body.registrationNo],
    (err, results) => {
      if (err) {
        console.log("Invalid query", err);
      } else {
        console.log(results);
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
    "SELECT * FROM studentDetails where semNo = ? AND registrationNo = ?",
    [body.semNo, body.registrationNo],
    (err, results) => {
      if (err) {
        console.log("Invalid query", err);
      } else {
        console.log(results);
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

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
