const mysql = require('mysql2');
const db = require('./db/connection');
const cTable = require('console.table');
const inquirer = require('inquirer');
const figlet = require('figlet');

// Options prompt, displaying at the beginning of app launch and after each table display
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

const displayTable = sql => {
    db.query(sql, (err, results) => {
        if (err) {
            console.log(err)
        }
        console.table(results);
    })
};

const viewEmployees = () => {
    const sql = `SELECT e.id, e.first_name, e.last_name, r.title AS role, r.salary, d.name AS department, CONCAT(m.first_name, ' ', m.last_name) AS manager 
    FROM employees e 
    LEFT JOIN roles AS r ON e.role_id = r.id 
    LEFT JOIN departments AS d ON r.department_id = d.id
    LEFT JOIN employees AS m ON m.id = e.manager_id;`

    displayTable(sql);
    setTimeout(showOptions, 300); 
}

const viewDepartments = () => {
    const sql = `SELECT id AS department_id, name AS department_name FROM departments;`

    displayTable(sql);
    setTimeout(showOptions, 300);
}

const viewRoles = () => {
    const sql = `SELECT r.id AS role_id, r.title, r.salary, d.name AS department
    FROM roles r 
    LEFT JOIN departments AS d ON r.department_id = d.id;`

    displayTable(sql);
    setTimeout(showOptions, 300);
}

// initializing the application by displaying ascii art and initial option prompt
const init = () => {
    // figlet('Employee', function(err, data) {
    //     if (err) {
    //         console.log('Ascii Art did not print...');
    //         console.dir(err);
    //         return;
    //     }
    //     console.log(data)
    // });
    
    // setTimout(figlet('Tracker', function(err, data) {
    //     if (err) {
    //         console.log('Ascii Art did not print...');
    //         console.dir(err);
    //         return;
    //     }
    //     console.log(data)
    // }), 100);
    console.log(
    `
    =========================

    ┏━━━┓╋╋╋╋╋┏┓
    ┃┏━━┛╋╋╋╋╋┃┃
    ┃┗━━┳┓┏┳━━┫┃┏━━┳┓╋┏┳━━┳━━┓
    ┃┏━━┫┗┛┃┏┓┃┃┃┏┓┃┃╋┃┃┃━┫┃━┫
    ┃┗━━┫┃┃┃┗┛┃┗┫┗┛┃┗━┛┃┃━┫┃━┫
    ┗━━━┻┻┻┫┏━┻━┻━━┻━┓┏┻━━┻━━┛
    ╋╋╋╋╋╋╋┃┃╋╋╋╋╋╋┏━┛┃
    ╋╋╋╋╋╋╋┗┛╋╋╋╋╋╋┗━━┛
    ┏━━━━┓╋╋╋╋╋╋┏┓
    ┃┏┓┏┓┃╋╋╋╋╋╋┃┃
    ┗┛┃┃┣┻┳━━┳━━┫┃┏┳━━┳━┓
    ╋╋┃┃┃┏┫┏┓┃┏━┫┗┛┫┃━┫┏┛
    ╋╋┃┃┃┃┃┏┓┃┗━┫┏┓┫┃━┫┃
    ╋╋┗┛┗┛┗┛┗┻━━┻┛┗┻━━┻┛
    
    =========================
    
    `
    );
    setTimeout(showOptions, 400);
};

// begin connection and start app
db.connect(err => {
    if (err) throw err;
    console.log('Database connected! We are ready to roll!');
})

init();