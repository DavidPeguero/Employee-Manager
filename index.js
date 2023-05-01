//Import inquirer and mySql
const inquirer = require("inquirer");
const mySql = require('mysql2');

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
        'Update Employee',
        'Quit'
    ],
}


let departmentCreationPrompt = {
    name: 'departmentName',
    type: 'input',
    message: "What is the name of the department?",
}


async function init() {
    //Ask user what they would like to do
    let task = await askTask();
    //Check for the option selected by user
    switch (task) {
        case 'View All Employees':
            showTable(['employees']);
            break;
        case 'View All Departments':
            showTable(['departments']);
            break;
        case 'View All Roles':
            showTable(['roles']);
            break;
        case 'Add Employee':
            await addEmployee();
            break;
        case 'Add Role':
            await addRole();
            break;
        case 'Add Department':
            console.log(task);
            break;
        case 'Update Employee':
            console.log(task);
        case 'Quit':
            process.exit();
    }
}

async function askTask() {
    let task = await inquirer.prompt(possiblePrompts);
    return task.selection;
}

function showTable(parameters) {
    db.query('SELECT * FROM ??', parameters, (err, res) => {
        console.table(res);
    })
}

async function addRole() {
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
            err ? console.error('Could not add role') : console.log('Added role')
        });
    })
}

async function addEmployee() {
    db.query('SELECT * FROM roles', async (err, res) => {
        let roleNames = [];
        let roleIds = []

        //Extract the department names from the db
        for (const role of res) {
            roleNames.push(role.title);
            roleIds.push(role.id);
        }

        db.query('SELECT e.first_name, e.last_name, e.id FROM employees e  JOIN roles r ON e.role_id = r.id AND r.title = \'Manager\'', async (err, res) =>{
            
            let managerNames = [];
            let managerIds = []

        //Extract the department names from the db
        for (const manager of res) {
            managerNames.push(`${manager.first_name} ${manager.last_name}`);
            managerIds.push(manager.id);
        }
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
            db.query('INSERT INTO employees (first_name, last_name, role_id, manager_id)VALUES (?, ?, ?, ?)', newEmployee, (err, res) =>{
                err ? console.error('Could not add employee') : console.log('Added employee')
            })
        })




        
    })
}


init();