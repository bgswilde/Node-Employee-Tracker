const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'my_employees'
    },
    console.log('Connected to your employee database, "my_employees".')
);

module.exports = db;