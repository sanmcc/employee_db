use employee_db;

INSERT INTO department (name)
VALUES
    ('Manager'),
    ('Sales'),
    ('Sales'),
    ('HR'),
    ('HR'),
    ('Customer Service'),
    ('Customer Service');
    
INSERT INTO role (title, department_id, salary)
VALUES
    ('Manager', 1, 1873725),
    ('Salesperson', 2, 70000),
    ('Sales Supervisor', 3, 100000),
    ('HR Supervisor', 4, 65000),
    ('HR Team Member', 5, 42000),
    ('Customer Service Team Member', 6, 32000),
    ('Customer Service Supervisor', 7, 37000);
   

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Mac', 'Miller', 1, 1),
    ('Jamie', 'Johnson', 2, NULL),
    ('Tod', 'Smith', 3, NULL),
    ('John', 'Slate', 4, NULL),
    ('Nick ', 'Miller', 5, NULL),
    ('Don', 'Julio', 6, 2),
    ('Stay', 'Golden', 7, NULL);