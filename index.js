const mysql = require('mysql2/promise');
const db = require('./db/connection');
const cTable = require('console.table');
const inquirer = require('inquirer');

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

const addDepartment = () => {
    inquirer.prompt({
        type: 'input',
        name: 'department',
        message: 'What is the name of the department you would like to add?',
        validate: department => {
            if (department) {
                return true;
            } else {
                console.log('Please enter a valid response.');
                return false;
            }
        } 
    }).then(({ department }) => {
        const sql = `INSERT INTO departments (name)
        VALUE ('${department}');`

        db.query(sql, (err) => {
            if (err) {
                console.log(err)
            }
            console.log(`Successfully added the ${department} department.`);
            setTimeout(showOptions, 300);
        })
    })
}

const addRole = () => {
    
    const departmentOptions = [];
    
    db.promise().query("SELECT name, id FROM departments").then((departments) => {
        for (let i = 0; i < departments[0].length; i++) {
            const departmentList = departments[0]
            departmentOptions.push({
                name: departmentList[i].name,
                value: departmentList[i].id
            });
        };

        inquirer.prompt(
            [
                {
                    type: 'input',
                    name: 'title',
                    message: 'What is the name of the role you would like to add?',
                    validate: title => {
                        if (title) {
                            return true;
                        } else {
                            console.log('Please enter a valid response.');
                            return false;
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'What is the salary of the role you would like to add?',
                    validate: salary => {
                        if (salary) {
                            return true;
                        } else {
                            console.log('Please enter a valid response.');
                            return false;
                        }
                    }
                },
                {
                    type: 'list',
                    name: 'option',
                    message: 'What department is this role a part of?',
                    choices: departmentOptions
                }
            ]
        ).then((answers) =>{

            const sql = `INSERT INTO roles (title, salary, department_id)
            VALUES ('${answers.title}', '${answers.salary}', '${answers.option}');`

            db.query(sql, (err) => {
                if (err) {
                    console.log(err)
                }
                console.log(`Successfully added the ${answers.title} role.`);
                showOptions();
            })
        })
    })
}


const addEmployee = () => {
    
    const roleOptions = [];
    const managerOptions = [];

    db.promise().query("SELECT * FROM roles").then((roles) => {
        for (let i = 0; i < roles[0].length; i++) {
            const rolesList = roles[0]
            roleOptions.push({
                name: rolesList[i].title,
                value: rolesList[i].id
            });
        };

        db.promise().query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employees WHERE manager_id IS NULL").then((managers) => {
            for (let i = 0; i < managers[0].length; i++) {
                const managerList = managers[0]
                managerOptions.push({
                    name: managerList[i].name,
                    value: managerList[i].id
                });
            };


            inquirer.prompt(
                [
                    {
                        type: 'input',
                        name: 'first_name',
                        message: 'What is the FIRST NAME of the employee you would like to add?',
                        validate: first_name => {
                            if (first_name) {
                                return true;
                            } else {
                                console.log('Please enter a valid response.');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'input',
                        name: 'last_name',
                        message: 'What is the LAST NAME of the employee you would like to add?',
                        validate: last_name => {
                            if (last_name) {
                                return true;
                            } else {
                                console.log('Please enter a valid response.');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What ROLE does this employee have?',
                        choices: roleOptions
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'Which manager does this employee report to?',
                        choices: managerOptions
                    }
                ]
            ).then((answers) =>{

                const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                VALUES ('${answers.first_name}', '${answers.last_name}', '${answers.role}', '${answers.manager}');`

                db.query(sql, (err) => {
                    if (err) {
                        console.log(err)
                    }
                    console.log(`Successfully added ${answers.first_name} ${answers.last_name} to the employee database!`);
                    showOptions();
                })
            })
        })
    })
};

// initializing the application by displaying ascii art and initial option prompt
const init = () => {
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

process.on('unhandledRejection', (e) => {
    console.error(e);
    // close the database connection
    process.exit(1);
})

init();