const mysql = require('mysql');

const sqlDbCredentials = require('./sqlDbCredentials.json');

//Function to ccreate db connection
const sqlDbConnection = function creatDbConnection() {
  return mysql.createConnection(sqlDbCredentials);
};

module.exports = sqlDbConnection;
