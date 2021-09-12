// const mysql = require('mysql2');
// const db = require('./db/connection');
// const cTable = require('console.table');
const inquirer = require('inquirer');
const figlet = require('figlet');

const showOptions = () => {
    inquirer.prompt({
        type: 'list',
        name: 'option',
        message: 'What would you like to do?',
        choices: [
            'View All Employees', 
            'View All Departments',
            'View All Roles',
            'Add An Employee',
            'Add A Department',
            'Add A Role',
            'Update An Employee Role'
        ]
    }).then((answer) => {
        switch(answer.option) {
            case 'View All Employees':
                viewEmployees();
                break;
            case 'View All Departments':
                viewDepartments();
                break;
            case 'View All Roles':
                viewRoles();
                break;
            case 'Add An Employee':
                addEmployee();
                break;
            case 'Add A Department':
                addDepartment();
                break;
            case 'Add A Role':
                addRole();
                break;
            case 'Update An Employee Role':
                updateEmployeeRole();
                break;
        }
    })
};

const init = async () => {
    await figlet('Employee', function(err, data) {
        if (err) {
            console.log('Ascii Art did not print...');
            console.dir(err);
            return;
        }
        console.log(data)
    });
    
    await figlet('Tracker', function(err, data) {
        if (err) {
            console.log('Ascii Art did not print...');
            console.dir(err);
            return;
        }
        console.log(data)
    });

    await console.log('Welcome to the Employee Tracker');
    await showOptions();
};

init();