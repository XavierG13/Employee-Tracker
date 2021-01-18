// Dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

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
          allEmployees();
          break;

        case "View All Employees by Department":
          employeeDepartment();
          break;

        case "View All Roles":
          employeeRole();
          break;

        case "View All Employees by Manager":
          //   employeeManager();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Remove Employee":
          //   removeEmployee();
          break;

        case "Update Employee Role":
          //   updateRole();
          break;

        case "Update Employee Manager":
          //   updateManager();
          break;
      }
    });
}

// view all employees
function allEmployees() {
  var query =
    "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;";
  connection.query(query, function (err, res) {
    if (err) throw err;
    runSearch();
  });
}

// add employee to db
function addEmployee() {
  inquirer.prompt([
    {
      name: "employee_first_name",
      type: "input",
      message: "Please enter employee's first name: ",
    },
    {
      name: "employee_last_name",
      type: "input",
      message: "Please enter employee's last name: ",
    },
    {
      name: "role",
      type: "input",
      // change to list when updateRole is created
      message: "Please select their role: ",
      // choices: updateRole();
    },
    {
      name: "manager",
      type: "input",
      // change to list when updateManager is created
      message: "Who is their Manager?",
      // choices: updateManager();
    },
  ]);
  // uncomment when ready to insert info in the database
  // .then(function (answer) {
  //   connection.query(
  //     "INSERT INTO employee SET ?",
  //     {
  //       first_name: answer.item,
  //       last_name: answer.item,
  //       role: answer.item,
  //       manager: answer.item,
  //     },
  //     function (err) {
  //       if (err) throw err;
  //     }
  //   );
  // });
}

// views all employees by department
function employeeDepartment() {
  var query =
    "SELECT employee.first_name, employee.last_name, department.employee_name AS Department FROM employee JOIN role ON employee.id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;";
  connect.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
  });
}

//view all employees by role
function employeeRole() {
  var query =
    "SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
  });
}

// function employeeManager() {
//   var query = "SELECT employee.first_name, employee.last_name, department.name AS Manager FROM employee JOIN role ON employee.manager_id = role.id JOIN . ";
// }
