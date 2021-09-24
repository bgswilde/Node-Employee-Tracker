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
            'Update An Employee Role/Manager'
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
            case 'Update An Employee Role/Manager':
                updateEmployee();
                break;
        }
    })
};

// takes the mysql query and displays table
const displayTable = sql => {
    db.query(sql, (err, results) => {
        if (err) {
            console.log(err)
        }
        // empty console logs surrounding table for command line readability
        console.log(``);
        console.table(results);
        console.log(`
        `);
    })
};

// function to display all employees
const viewEmployees = () => {
    // query the database to get all desired fields for the employee, including data from other tables
    const sql = `SELECT e.id, e.first_name, e.last_name, r.title AS role, r.salary, d.name AS department, CONCAT(m.first_name, ' ', m.last_name) AS manager 
    FROM employees e 
    LEFT JOIN roles AS r ON e.role_id = r.id 
    LEFT JOIN departments AS d ON r.department_id = d.id
    LEFT JOIN employees AS m ON m.id = e.manager_id;`

    displayTable(sql);
    // start menu again, delayed for display purposes
    setTimeout(showOptions, 300); 
}

// function to display all departments
const viewDepartments = () => {
    // query the database to get all desired department fields
    const sql = `SELECT id AS department_id, name AS department_name FROM departments;`

    displayTable(sql);
    // start menu again, delayed for display purposes
    setTimeout(showOptions, 300);
}

// function to display all roles
const viewRoles = () => {
    // query the database to get all desired role information, including name from department table
    const sql = `SELECT r.id AS role_id, r.title, r.salary, d.name AS department
    FROM roles r 
    LEFT JOIN departments AS d ON r.department_id = d.id;`

    displayTable(sql);
    // start menu again, delayed for display purposes
    setTimeout(showOptions, 300);
}

// function to add an employee to the employees table
const addEmployee = () => {
    // empty arrays to hold query data on current roles and managers
    const roleOptions = [];
    const managerOptions = [];

    // query to get the current roles, running a for loop for data on each
    db.promise().query("SELECT * FROM roles").then((roles) => {
        for (let i = 0; i < roles[0].length; i++) {
            const rolesList = roles[0]
            // push role title/id objects into empty array for inquirer prompt list
            roleOptions.push({
                name: rolesList[i].title,
                value: rolesList[i].id
            });
        };
        // query to get the current manager name/id, running a for loop for data on each (nested to allow all arrays to populate before inquirer prompt)
        db.promise().query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employees WHERE manager_id IS NULL").then((managers) => {
            for (let i = 0; i < managers[0].length; i++) {
                const managerList = managers[0]
                // push manager name/id objects into empty array for inquirer prompt list
                managerOptions.push({
                    name: managerList[i].name,
                    value: managerList[i].id
                });
            };

            // prompt user for employee information, using arrays populated by queries above where needed
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
                        message: 'Which MANAGER does this employee report to?',
                        choices: managerOptions
                    }
                ]
            ).then((answers) =>{
                // query to add a new employee to the database using input from inquirer prompt
                const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                VALUES ('${answers.first_name}', '${answers.last_name}', '${answers.role}', '${answers.manager}');`

                db.query(sql, (err) => {
                    if (err) {
                        console.log(err)
                    }
                    // empty console log and space surrounding message for command line readability
                    console.log(``);
                    console.log(`Successfully added ${answers.first_name} ${answers.last_name} to the employee database!
                    
                    `);
                    // start menu again
                    showOptions();
                })
            })
        })
    })
};

// function to add a department to the departments table
const addDepartment = () => {
    // prompt user for department information
    inquirer.prompt({
        type: 'input',
        name: 'department',
        message: 'What is the NAME of the department you would like to add?',
        validate: department => {
            if (department) {
                return true;
            } else {
                console.log('Please enter a valid response.');
                return false;
            }
        } 
    }).then(({ department }) => {
        // query to add a department, passing in user input from inquirer prompt
        const sql = `INSERT INTO departments (name)
        VALUE ('${department}');`

        db.query(sql, (err) => {
            if (err) {
                console.log(err)
            }
            // empty console log and space surrounding message for command line readability
            console.log(``);
            console.log(`Successfully added the ${department} department!
            
            `);
            // start menu again 
            showOptions();
        })
    })
}

// function to add a role to the roles table
const addRole = () => {
    // empty array to hold query data on current departments
    const departmentOptions = [];
    // query the database for current departments, running a for loop for data on each
    db.promise().query("SELECT name, id FROM departments").then((departments) => {
        for (let i = 0; i < departments[0].length; i++) {
            const departmentList = departments[0]
            // push department name/id objects into empty array for inquirer prompt list
            departmentOptions.push({
                name: departmentList[i].name,
                value: departmentList[i].id
            });
        };
        // prompt user for role information, using array populated by query above where needed
        inquirer.prompt(
            [
                {
                    type: 'input',
                    name: 'title',
                    message: 'What is the NAME of the role you would like to add?',
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
                    message: 'What is the ANNUAL SALARY of the role you would like to add?',
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
                    message: 'What DEPARTMENT is this role a part of?',
                    choices: departmentOptions
                }
            ]
        ).then((answers) =>{
            // query to add role, passing in user input from inquirer prompt
            const sql = `INSERT INTO roles (title, salary, department_id)
            VALUES ('${answers.title}', '${answers.salary}', '${answers.option}');`

            db.query(sql, (err) => {
                if (err) {
                    console.log(err)
                }
                // empty console log and space surrounding message for command line readability
                console.log(``);
                console.log(`Successfully added the ${answers.title} role!
                
                `);
                // start menu again
                showOptions();
            })
        })
    })
}

// function to update the Role and Manager of a selected Employee
const updateEmployee = () => {
    // empty arrays to hold query data on current employees, roles, and managers
    const employeeOptions = [];
    const roleOptions = [];
    const managerOptions = [];
    // query to get the names of current employees, running a for loop for data on each employee
    db.promise().query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employees").then((employees) => {
        for (let i = 0; i < employees[0].length; i++) {
            const employeeList = employees[0]
            // push employee name/id objects into empty array for inquirer prompt list
            employeeOptions.push({
                name: employeeList[i].name,
                value: employeeList[i].id
            });
        };
        
        // query to get the current roles, running a for loop for data on each (nested to allow all arrays to populate before inquirer prompt)
        db.promise().query("SELECT * FROM roles").then((roles) => {
            for (let i = 0; i < roles[0].length; i++) {
                const rolesList = roles[0]
                // push role title/id objects into empty array for inquirer prompt list
                roleOptions.push({
                    name: rolesList[i].title,
                    value: rolesList[i].id
                });
            };
            // query to get the current managers, running a for loop for data on each (nested to allow all arrays to populate before inquirer prompt)
            db.promise().query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employees WHERE manager_id IS NULL").then((managers) => {
                for (let i = 0; i < managers[0].length; i++) {
                    const managerList = managers[0]
                    // push manager name/id objects into empty array for inquirer prompt list
                    managerOptions.push({
                        name: managerList[i].name,
                        value: managerList[i].id
                    });
                };
                // prompt user for what to update, using arrays populated by queries above
                inquirer.prompt(
                    [
                        {
                            type: 'list',
                            name: 'employee',
                            message: 'Which EMPLOYEE would you like to update?',
                            choices: employeeOptions
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
                            message: 'Which MANAGER does this employee report to?',
                            choices: managerOptions
                        }
                    ]
                ).then((answers) =>{
                    // update query, passing in the id value from inquirer prompt selections
                    const sql = `UPDATE employees SET role_id = ${answers.role}, manager_id = ${answers.manager}
                                WHERE id = ${answers.employee};`

                    db.query(sql, (err) => {
                        if (err) {
                            console.log(err)
                        }
                        // empty console log and space surrounding message for command line readability
                        console.log(``);
                        console.log(`Role and Manager Successfully Updated!
                        
                        `);
                        // start menu again
                        showOptions();
                    })
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