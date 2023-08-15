const mysql = require("mysql");

const sqlDbCredentials = require("./sqlDbCredentials.json");

//Function to ccreate db connection

export function creatDbConnection() {
  return mysql.createConnection(sqlDbCredentials);
}
