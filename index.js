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
            'Update Employee'
        ],
    }

let employeeCreationPrompts = [
        {
            name: 'employeeFirstName',
            type: 'input',
            message: "What is the employee's first name?",
        },
        {
            name: 'employeeLastName',
            type: 'input',
            message: "What is the employee's last name?",
        },
        {
            name: 'employeeRole',
            type: 'input',
            message: "What is the employee's role?",
        },
        {
            name: 'employeeManager',
            type: 'input',
            message: "Who is the employee's manager?",
        },
    ]

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
        type: 'input',
        message: "Which department does the role belong to?",
    },
]

let departmentCreationPrompt = {
    name: 'departmentName',
    type: 'input',
    message: "What is the name of the department?",
}


async function init(){
    //Ask user what they would like to do
    let task =  await askTask();
    //Check for the option selected by user
    switch (task){
        case'View All Employees':
            console.log(task);
            break;
        case'View All Departments':
            console.log(task);
            break;
        case'View All Roles':
            console.log(task);
            break;
        case'Add Employee':
            console.log(task);
            break;
        case'Add Role':
            console.log(task);
            break;
        case'Add Department':
            console.log(task);
            break;
        case'Update Employee':
            console.log(task);     
    }
}

async function askTask(){
    let task = await inquirer.prompt(possiblePrompts);
    return task.selection;
}

init();