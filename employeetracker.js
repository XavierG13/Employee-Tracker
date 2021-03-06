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
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees by Department",
        "View All Employees by Manager",
        "View All Employees by Roles",
        "View Total Utilized Budgets for Departments",
        "Add Employee",
        "Add Role",
        "Add Department",
        "Remove Employee",
        "Remove Role",
        "Remove Department",
        "Update Employee Role",
        // "Update Employee Manager",
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

        case "View All Employees by Roles":
          employeeRole();
          break;

        case "View All Employees by Manager":
          employeeManager();
          break;

        case "View Total Utilized Budgets for Departments":
          viewUtilizedBudget();
          break;

        case "Add Employee":
          createEmployee();
          break;

        case "Add Role":
          createRole();
          break;

        case "Add Department":
          createDepartment();
          break;

        // case "Remove Employee":
        //   //   deleteEmployee();
        //   break;

        //case "Remove Role":
        // // deleteRole();
        // break;

        // case "Remove Department":
        //   deleteDepartment();
        //   break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;

        // case "Update Employee Manager":
        //   updateManager();
        //   break;
      }
    });
}

// add employee to db
function createEmployee() {
  inquirer
    .prompt([
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
        choices: getRoles(),
      },
      {
        name: "manager",
        type: "list",
        message: "Who is their Manager?",
        choices: createManager(),
      },
    ])
    .then(function (value) {
      var query = "INSERT INTO employee SET ?";
      var roleId = getRoles().indexOf(value.role) + 1;
      var managersId = createManager().indexOf(value.manager) + 1;
      connection.query(
        query,
        {
          first_name: value.employee_first_name,
          last_name: value.employee_last_name,
          manager_id: managersId,
          role_id: roleId,
        },
        function (err) {
          if (err) throw err;
          console.table(value);
          runSearch();
        }
      );
    });
}

// function to create a new department for employees
function createDepartment() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "Please enter Department you would like to add: ",
      },
    ])
    .then(function (res) {
      var query = "INSERT INTO department SET ?";
      connection.query(
        query,
        {
          name: res.name,
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
    "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(emp.first_name, ' ' ,emp.last_name) AS Manager FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = role.department_id LEFT JOIN employee emp ON employee.manager_id = emp.id";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    runSearch();
  });
}

// views all employees by department
function employeeDepartment() {
  var query =
    "SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    runSearch();
  });
}

//view all employees by role
function employeeRole() {
  var query =
    "SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    runSearch();
  });
}

// view all employee manager
function employeeManager() {
  var query =
    "SELECT employee.first_name, employee.last_name, role.title AS Manager FROM employee JOIN role ON employee.manager_id = role.id";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    runSearch();
  });
}

// function for selecting a manager when prompted who is their manager
var managersArray = [];
function createManager() {
  var query =
    "SELECT first_name, last_name FROM employee WHERE manager_id IS NULL";
  connection.query(query, function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      managersArray.push(res[i].first_name + " " + res[i].last_name);
    }
  });
  return managersArray;
}

// function will update the employees role
function updateEmployeeRole() {
  var query =
    "SELECT employee.first_name, employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id";
  connection.query(query, function (err, res) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "employee_first_name",
          type: "list",
          choices: function () {
            var firstName = [];
            for (var i = 0; i < res.length; i++) {
              firstName.push(res[i].first_name);
            }
            return firstName;
          },
          message: "Employee First Name: ",
        },
        {
          name: "employee_last_name",
          type: "list",
          choices: function () {
            var lastName = [];
            for (var i = 0; i < res.length; i++) {
              lastName.push(res[i].last_name);
            }
            return lastName;
          },
          message: "Employee Last Name: ",
        },
        {
          name: "role",
          type: "list",
          message: "Please select a new role: ",
          choices: getRoles(),
        },
      ])
      .then(function (val) {
        console.log(val);
        if (err) throw err;
        var newRoleId = getRoles().indexOf(val.role) + 1;
        console.log(newRoleId);
        var query =
          "UPDATE employee SET first_name = ?, last_name = ?, role_id = ? WHERE last_name = ?";
        connection.query(
          query,
          [
            val.employee_first_name,
            val.employee_last_name,
            newRoleId,
            val.employee_last_name,
          ],
          function (err) {
            if (err) throw err;
            console.table(val);
            runSearch();
          }
        );
      });
  });
}
// function will update the employee managers
// function updateManager() {
//   var query =
//     "";
//   connection.query(query, function (err, res) {
//     if (err) throw err;
//     // return console.log(res);
//     inquirer
//       .prompt([
//         {
//           name: "employee_first_name",
//           type: "list",
//           choices: function () {
//             var firstName = [];
//             for (var i = 0; i < res.length; i++) {
//               firstName.push(res[i].first_name);
//             }
//             return firstName;
//           },
//           message: "What is the employee's first name?",
//         },
//         {
//           name: "employee_last_name",
//           type: "list",
//           choices: function () {
//             var lastName = [];
//             for (var i = 0; i < res.length; i++) {
//               lastName.push(res[i].last_name);
//             }
//             return lastName;
//           },
//           message: "What is the employee's last name?",
//         },
//         {
//           name: "manager",
//           type: "list",
//           message: "Who is the new Manager?",
//           choices: createManager(),
//         },
//       ])
//       .then(function (value) {
//         var managersId = createManager().indexOf(value.employee) + 1;
//         var query = "UPDATE employee SET WHERE ?;";
//         connection.query(
//           query,
//           {
//             first_name: value.employee_first_name,
//           },
//           {
//             last_name: value.employee_last_name,
//           },
//           {
//             manager_id: managersId,
//           },
//           function (err) {
//             if (err) throw err;
//             console.table(value);
//             runSearch();
//           }
//         );
//       });
//   });
// }

// functions for selecting a role and adding a role
var rolesArray = [];
function getRoles() {
  var query = "SELECT * FROM role";
  connection.query(query, function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      rolesArray.push(res[i].title);
    }
  });
  return rolesArray;
}
// function will create a new role for employee placement
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

function viewUtilizedBudget() {
  var query =
    "SELECT department_id AS id, department.name AS Department, SUM(salary) as Budget FROM role INNER JOIN Department ON role.department_id = department.id GROUP BY role.department_id";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    runSearch();
  });
}

// function will delete employee user selected
// function deleteEmployee() {
//   var query = "DELETE ";
// }

// // function will delete department user selected
// function deleteDepartment() {}

// // function will delete role user selected
// function deleteRole() {}
