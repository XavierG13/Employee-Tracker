var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 8080
  port: 8080,

  // Your username
  user: "root",

  // Your password
  password: "Creature13X!",
  database: "employee_trackerDB",
});

connection.connect(function (err) {
  if (err) throw err;
});
