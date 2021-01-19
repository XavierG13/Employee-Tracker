-- === will be used when view all employees is selected === --
SELECT employee.first_name,
    employee.last_name,
    role.title,
    role.salary,
    department.name,
    CONCAT(emp.first_name, ' ', emp.last_name) AS Manager
FROM employee
    INNER JOIN role on role.id = employee.role_id
    INNER JOIN department on department.id = role.department_id
    left join employee emp on employee.manager_id = emp.id;
-- ======= Roles ======= --
SELECT employee.first_name,
    employee.last_name,
    role.title AS Title
FROM employee
    JOIN role ON employee.role_id = role.id;
-- ======= Departments ======= --
SELECT employee.first_name,
    employee.last_name,
    department.name AS Department
FROM employee
    JOIN role ON employee.id = deparmtnet.id
    JOIN department ON role.department_id = role.department.id
ORDER BY employee.id;
-- ======= Employees ======= --
SELECT employee.first_name,
    employee.last_name,
    department.name AS Department
FROM employee
    JOIN role ON employee.id = role.id
    JOIN department ON role.department_id = department.id
ORDER BY employee.id;
-- ======= Managers ======= --
SELECT employee.first_name,
    employee.last_name,
    role.title AS Manager
FROM employee
    JOIN role ON employee.manager_id = role.id;
-- ======= Department Seeds ======= --
INSERT INTO department (name) VALUE ("Sales");
INSERT INTO department (name) VALUE ("Engineering");
INSERT INTO department (name) VALUE ("Finance");
INSERT INTO department (name) VALUE ("Legal");
-- ======= Employee Role Seeds ====== --
INSERT INTO role (title, salary, department_id) VALUE ("Lead Engineer", 150000, 2);
INSERT INTO role (title, salary, department_id) VALUE ("Legal Team Lead", 250000, 4);
INSERT INTO role (title, salary, department_id) VALUE ("Accountant", 125000, 3);
INSERT INTO role (title, salary, department_id) VALUE ("Sales Lead", 100000, 1);
INSERT INTO role (title, salary, department_id) VALUE ("Salesperson", 80000, 1);
INSERT INTO role (title, salary, department_id) VALUE ("Software Engineer", 120000, 2);
INSERT INTO role (title, salary, department_id) VALUE ("Lawyer", 190000, 4);
-- ======= Employee Seeds ======= --
INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUE ("Peter", "Parker", null, 1);
INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUE ("Wanda", "Maximoff", null, 2);
INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUE ("Natasha", "Romanoff", null, 3);
INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUE ("Tony", "Stark", 1, 4);
INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUE ("Stever", "Rogers", 4, 5);
INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUE ("Bruce", "Banner", 1, 6);
INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUE ("Thor", "Son of Odin", 2, 7);