//Import inquirer and mySql
const inquirer = require("inquirer");
const mySql = require('mysql2');
const cTable = require('console.table');
const util = require('util');
const { resolve } = require("path");

const db = mySql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'rootroot',
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);



let possiblePrompts =
{
    name: 'selection',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
        'View All Employees',
        'View All Roles',
        'View All Departments',
        'Add Employee',
        'Add Role',
        'Add Department',
        'Update Employee Role',
        'Quit'
    ],
}


let departmentCreationPrompt = {
    name: 'departmentName',
    type: 'input',
    message: "What is the name of the department?",
}


async function showMenu() {
    //Ask user what they would like to do
    let task = await askTask();
    //Check for the option selected by user
    switch (task) {
        case 'View All Employees':
            await showEmployees()
            break;
        case 'View All Departments':
            await showDepartments()
            break;
        case 'View All Roles':
            await showRoles();
            break;
        case 'Add Employee':
            await addEmployee();
            break;
        case 'Add Role':
            await addRole()
            break;
        case 'Add Department':
            await addDepartment()
            break;
        case 'Update Employee Role':
            await updateEmployeeRole()
            break;
        case 'Quit':
            process.exit();
    }
    setTimeout(showMenu, 1000)
}

//Asks through inquirer the task to be performed
async function askTask() {
    let task = await inquirer.prompt(possiblePrompts);
    return task.selection;
}

async function showRoles() {
    new Promise((resolve, reject) => {
        db.query('SELECT r.id, r.title, d.name, r.salary FROM roles r JOIN departments d ON r.department_id = d.id', (err, res) => {
            console.table(res);
            resolve('resolved');
        });
    })
}

async function showEmployees() {
    return new Promise((resolve, reject) => {
        db.query('SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name, CONCAT(e2.first_name, " ", e2.last_name) AS Manager FROM employees e LEFT JOIN employees e2 ON e2.id = e.manager_id JOIN roles r ON r.id = e.role_id JOIN departments d ON r.department_id = d.id', (err, res) => {
            console.table(res)
            resolve('resolved');
        });
    });
}

async function showDepartments() {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM departments', (err, res) => {
            console.table(res);
            resolve('resolved');
        });
    })
}

//Function to add Role
async function addRole() {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM departments', async (err, res) => {
            let deptNames = [];
            let deptIds = []

            //Extract the department names from the db
            for (const dept of res) {
                deptNames.push(dept.name);
                deptIds.push(dept.id);
            }

            //Create prompts to ask based of department info
            let roleCreationPrompts = [
                {
                    name: 'roleName',
                    type: 'input',
                    message: "What is the the name of the role?",
                },
                {
                    name: 'roleSalary',
                    type: 'input',
                    message: "What is the salary of the role?",
                },
                {
                    name: 'roleDepartment',
                    type: 'list',
                    message: 'What would you like to do?',
                    choices: deptNames
                }
            ]

            //Ask prompts to the user
            let roleAns = await inquirer.prompt(roleCreationPrompts);

            //Create values for the new role to add
            let newRole = [roleAns.roleName, roleAns.roleSalary, deptIds[deptNames.indexOf(roleAns.roleDepartment)]];

            //Query db with info about new roles as a parameter
            db.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', newRole, (err, res) => {
                err ? console.error('Could not add role') : console.log('Added role');
            });
            resolve('resolve')
        })
    })
}

async function addEmployee() {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM roles', async (err, res) => {
            let roleNames = [];
            let roleIds = []

            //Extract the department names from the db
            for (const role of res) {
                roleNames.push(role.title);
                roleIds.push(role.id);
            }

            db.query('SELECT e.first_name, e.last_name, e.id FROM employees e  JOIN roles r ON e.role_id = r.id AND r.title = \'Manager\'', async (err, res) => {

                let managerNames = [];
                let managerIds = []

                //Extract the department names from the db
                for (const manager of res) {
                    managerNames.push(`${manager.first_name} ${manager.last_name}`);
                    managerIds.push(manager.id);
                }
                managerNames.unshift('None');
                managerIds.unshift(null);
                //Create prompts to ask based of department info
                let employeeCreationPrompts = [
                    {
                        name: 'firstName',
                        type: 'input',
                        message: "What is the employee's first name?",
                    },
                    {
                        name: 'lastName',
                        type: 'input',
                        message: "What is the employee's last name?",
                    },
                    {
                        name: 'role',
                        type: 'list',
                        message: 'What is the employee\'s role?',
                        choices: roleNames
                    },
                    {
                        name: 'manager',
                        type: 'list',
                        message: 'Who is the employee\'s manager?',
                        choices: managerNames
                    },
                ]

                //Ask prompts to the user
                let empAns = await inquirer.prompt(employeeCreationPrompts);

                //New employee data to add
                let newEmployee = [
                    empAns.firstName,
                    empAns.lastName,
                    roleIds[roleNames.indexOf(empAns.role)],
                    empAns.role === 'None' ? null : managerIds[managerNames.indexOf(empAns.manager)]
                ]
                db.query('INSERT INTO employees (first_name, last_name, role_id, manager_id)VALUES (?, ?, ?, ?)', newEmployee, (err, res) => {
                    err ? console.error('Could not add employee') : console.log('Added employee');
                    resolve('resovled');
                })
            })
        })
    })
}


async function addDepartment() {
    return new Promise(async (resolve, reject) => {
        depName = await inquirer.prompt(departmentCreationPrompt);
        db.query('INSERT INTO departments (name) VALUES (?)', depName.departmentName, (err, res) => {
            err ? console.error('Could not add department') : console.log('Added department');
            return res;
        })
        resolve('resolved');
    });
}


async function updateEmployeeRole() {

    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM employees', async (err, res) => {
            let empNames = [];
            let empIds = []

            //Extract the employee names from the db
            for (const emp of res) {
                empNames.push(`${emp.first_name} ${emp.last_name}`);
                empIds.push(emp.id);
            }

            //Query for roles
            db.query('SELECT * FROM roles', async (err, res) => {
                let roleNames = [];
                let roleIds = []

                //Extract the roles names from the db
                for (const role of res) {
                    roleNames.push(role.title);
                    roleIds.push(role.id);
                }

                let employeeUpdatePrompts = [
                    {
                        name: 'empName',
                        type: 'list',
                        message: 'Which employee\'s role do you want to update?',
                        choices: empNames
                    },
                    {
                        name: 'role',
                        type: 'list',
                        message: 'Which role do you want to assign to the selected employee?',
                        choices: roleNames
                    },
                ]

                let updateAns = await inquirer.prompt(employeeUpdatePrompts);
                let updatedEmp = [
                    roleIds[roleNames.indexOf(updateAns.role)],
                    empIds[empNames.indexOf(updateAns.empName)]
                ];

                db.query('UPDATE employees SET role_id = ? WHERE id = ?', updatedEmp, (err, res) => {
                    err ? console.error('Could not update employee') : console.log('Successfully update employee');
                    resolve('resolve')
                });
            });
        });
    });
}

showMenu();