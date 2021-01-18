// Dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
const { allowedNodeEnvironmentFlags } = require("process");

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
      type: "list",
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

        // case "View All Employees by Department":
        //   employeeDepartment();
        //   break;

        // case "View All Roles":
        //   employeeRole();
        //   break;

        // case "View All Employees by Manager":
        //   //   employeeManager();
        //   break;

        case "Add Employee":
          createEmployee();
          break;

        case "Add Role":
          createRole();
          break;

        case "Add Department":
          addDepartment();
          break;

        // case "Remove Employee":
        //   //   removeEmployee();
        //   break;

        case "Update Employee Role":
          updateRole();
          break;

        // case "Update Employee Manager":
        //   //   updateManager();
        //   break;
      }
    });
}

// add employee to db
function createEmployee() {
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
      type: "list",
      message: "Please select their role: ",
      choices: updateRole(),
    },
    {
      name: "manager",
      type: "list",
      message: "Who is their Manager?",
      choices: createManager(),
    },
  ]);
  // .then(function (answer) {
  //   var query = "INSERT INTO employee SET ?";
  //   var roleId = createRole().indexOf(answer.role) + 1;
  //   var managersId = createManager().indexOf(answer.role) + 1
  //   connection.query(
  //     query,
  //     {
  //       first_name: answer.item,
  //       last_name: answer.item,
  //       role: answer.item,
  //       role_id: answer.item,
  //     },
  //     function (err) {
  //       if (err) throw err;
  //       console.table(res);
  //       runSearch();
  //     }
  //   );
  // });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        name: "department_name",
        type: "input",
        message: "Please enter Department you would like to add: ",
      },
    ])
    .then(function (res) {
      var query = "INSERT INTO department SET ?";
      connection.query(
        query,
        {
          department_name: res.name,
        },
        function (err) {
          if (err) throw err;
          console.table(res);
          runSearch();
        }
      );
    });
}

// view all employees/ employees by department/ employees by role
function allEmployees() {
  var query =
    "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    runSearch();
  });
}

// **UNCOMMENT functions employeeDepartment and employeeRole when functions to create role and
// // views all employees by department
// function employeeDepartment() {
//   var query =
//     "SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;";
//   connect.query(query, function (err, res) {
//     if (err) throw err;
//     console.table(res);
// runSearch();
//   });
// }

// //view all employees by role
// function employeeRole() {
//   var query =
//     "SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;";
//   connection.query(query, function (err, res) {
//     if (err) throw err;
//     console.table(res);
//     runSearch();
//   });
// }

// function for selecting a manager when prompted who is their manager
var managersArray = [];
function createManager() {
  var query =
    "SELECT first_name, last_name FROM employee WHERE manager_id IS NULL";
  connection.query(query, function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      managersArray.push(res[i].first_name);
    }
  });
  return managersArray;
}

// functions for selecting a role and adding a role
var rolesArray = [];
function updateRole() {
  var query = "SELECT * FROM role";
  connection.query(query, function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      rolesArray.push(res[i].title);
    }
  });
  return rolesArray;
}

function createRole() {
  var query = "SELECT role.title AS Title, role.salary AS Salary FROM role;";
  connection.query(query, function (req, res) {
    inquirer
      .prompt([
        {
          name: "Title",
          type: "input",
          message: "Please input the Title of the role: ",
        },
        {
          name: "Salary",
          type: "input",
          message: "Please input the Salary of the role: ",
        },
      ])
      .then(function (res) {
        var query = "INSERT INTO role SET ?";
        connection.query(
          query,
          {
            title: res.Title,
            salary: res.Salary,
          },
          function (err) {
            if (err) throw err;
            console.table(res);
            runSearch();
          }
        );
      });
  });
}
