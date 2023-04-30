//Import inquirer and mySql
const inquirer = require("inquirer");
const mySql = require('mysql2');

let possiblePrompts =
    {
        name: 'selection',
        type: 'list',
        message: 'Enter desired shape (circle, square, or triangle)',
        choices: [
            'View All Employees',
            'View All Roles',
            'View All Departments',
            'Add Employee',
            'Add Role',
            'Add Department'
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
