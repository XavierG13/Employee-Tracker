var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Creature13X!",
  database: "employee_trackerDB",
});

connection.connect(function (err) {
  if (err) throw err;
  runSearch();
});

function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees by Department",
        "View All Employees by Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View All Employees":
          //   allEmployees();
          break;

        case "View All Employees by Department":
          //   employeeDepartment();
          break;

        case "View All Employees by Manager":
          //   employeeManager();
          break;

        case "Add Employee":
          //   addEmployee();
          break;

        case "Remove Employee":
          //   removeEmployee();
          break;

        case "Update Employee Role":
          //   updateEmployee();
          break;

        case "Update Employee Manager":
          //   updateManager();
          break;
      }
    });
}
