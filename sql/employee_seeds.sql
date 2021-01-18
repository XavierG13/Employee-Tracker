-- will be used when view all employees is selected
SELECT employee.first_name,
    employee.last_name,
    role.title,
    role.salary,
    department.name,
    CONCAT(emp.first_name, ' ', emp.last_name) AS Manager
FROM employee
    INNER JOIN role on role.id = employee.role_id
    INNER JOIN department on department.id = role.department_id
    left join employee e on employee.manager_id = emp.id;
-- views all employees by department(role) --
SELECT employee.first_name,
    employee.last_name,
    department.name AS Department
FROM employee
    JOIN role ON employee.role_id = role.id;