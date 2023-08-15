const express = require("express");
const app = express();
const port = 8005;

app.get("/", (req, res) => {
  res.send();

  // connect to Db
  const createDbConnection = require("./db/db.js").creatDbConnection;
  const mysqlConnection = createDbConnection();

  // excute query
  mysqlConnection.query();
  //End Connection
  mysqlConnection.end();
});

app.post("/", (req, res) => {
  res.send();

  // connect to Db
  const createDbConnection = require("./db/db.js").creatDbConnection;
  const mysqlConnection = createDbConnection();

  // excute query
  mysqlConnection.query();
  //End Connection
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
