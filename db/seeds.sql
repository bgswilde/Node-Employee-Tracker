INSERT INTO departments (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Human Resources'),
    ('Administration');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Sales Lead', 100000, 1),
    ('Salesperson', 70000, 1),
    ('Sales Intern', 50000, 1),
    ('Sr. Engineer', 125000, 2),
    ('Software Engineer', 90000, 2),
    ('Software Intern', 50000, 2),
    ('HR Manager', 110000, 3),
    ('HR Associate', 80000, 3),
    ('HR Intern', 50000, 3),
    ('Owner/President', 140000, 4),
    ('Administrative Assistant', 65000, 4),
    ('Financial Director', 85000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
    ('Rebecca', 'Welton', 10, NULL),
    ('Leslie', 'Higgins', 12, 1),
    ('Ted', 'Lasso', 7, NULL),
    ('Keeley', 'Jones', 1, NULL),
    ('Nathan', 'Shelley', 8, 3),
    ('Roy', 'Kent', 4, NULL),
    ('Jamie', 'Tartt', 2, 4),
    ('Sam', 'Obisanya', 5, 6),
    ('Coach', 'Beard', 8, 3),
    ('Isaac', 'McAdoo', 5, 6),
    ('Trent', 'Crimm', 2, 4);
