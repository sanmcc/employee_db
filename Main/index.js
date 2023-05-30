const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const table = require('console.table');
const { response } = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

require('dotenv').config();


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Sn00pcat52$",
  database: "employee_db"
});

db.connect(function (err) {
    if (err) {
  console.log('errrrrrorrrr', err);
  return;
}
console.log('conected');
promptUser();
});

const promptUser = () => {
  inquirer.prompt([
      {
          name: 'choices',
          type: 'list',
          message: 'Please select how you would like to continue:',
          choices: [
              'View All Departments',
              'View All Employees',
              'View All Roles',
              'Add Department',
              'Add Role',
              'Add Employee',
              'Update Employee Role',
              'Delete Employee',
              'Exit'
          ]
      }
  ])
  .then((answers) => {
      const {choices} = answers;
      switch (choices) {
          case 'View All Departments':
              viewAllDepartments();
              break;
          case 'View All Roles':
              viewAllRoles();
              break;
          case 'View All Employees':
              viewAllEmployees();
              break;
          case 'Add Department':
              addDepartment();
              break;
          case 'Add Role':
              addRole();
              break;
          case 'Add Employee':
              addEmployee();
              break;
          case 'Update Employee Role':
              updateRole();
              break;
          case 'Delete Employee':
              deleteEmployee();
              break;
          case 'Exit':
              db.end();
              break;
      }
  });
};


const viewAllDepartments = () => {
  const dbQuery = `SELECT * FROM department`;
  db.query(dbQuery, (error, results) => {
      if (error) throw error;
      console.table(results);
      promptUser();
  });
};

const viewAllEmployees = () => {
    const dbQuery = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, employee.manager_id FROM employee JOIN role ON role.id = employee.role_id JOIN department ON department.id = role.department_id;`;
    db.query(dbQuery, (error, results) => {
        if (error) throw error;
        console.table(results);
        promptUser();
    });
  };

const viewAllRoles = () => {
  const dbQuery = `SELECT role.id, role.title,  department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id;`;
  db.query(dbQuery, (error, results) => {
      if (error) throw error;
      console.table(results);
      promptUser();
  });
};

const addDepartment = () => {
  inquirer.prompt([
      {
          type: 'input',
          name: 'name',
          message: 'What is the name of the department you would like to add?'
      }
  ])
  .then((answer) => {
      const dbQuery = `INSERT INTO department(name) VALUES(?)`;
      db.query(dbQuery, answer.name, (error, results) => {
          if (error) throw error;
          console.table(`${answer.name} has been added as a new department.`);
          promptUser();
      })
  });
};

const addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Title of new role:'
        },
        {
            type: 'input',
            name: 'department_id',
            message: 'Dept ID of new role:'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Salary of new role:'
        }
    ])
    .then((answers) => {
        const { title, department_id, salary } = answers; 
        const dbQuery = `INSERT INTO role (title, department_id, salary) VALUES ('${title}', ${department_id}, ${salary})`;
        db.query(dbQuery, (error, results) => {
            if (error) throw error;       
            console.table(`${answers.title} has been added as a new role.`);
            promptUser();
    })
  })};

const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Name of new employee:'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Last name of the new employee:'
        },
        {
            type: 'input',
            name: 'role_id',
            message: 'Role ID of the new employee:'
        },
        {
            type: 'input',
            name: 'manager_id',
            message: 'Manager ID of the new employee (leave blank if regular employee status):'
        }
    ])
    .then((answers) =>{
        const { first_name, last_name, role_id, manager_id } = answers;
        const dbQuery = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${first_name}', '${last_name}', ${role_id}, NULLIF('${manager_id}', ''))`;
        db.query(dbQuery, (error, results) => {
            if (error) throw error;
            console.table(`${first_name} ${last_name} has been added as a new employee.`);
            promptUser();
    });
  })};

const updateRole = () => {
  inquirer.prompt([
      {
          type: 'input',
          name: 'employee_id',
          message: 'ID of the employee:'
      },
      {
          type: 'input',
          name: 'new_role',
          message: "ID of the new role:"
      }
  ])
  .then((answers) => {
      const { employee_id, new_role } = answers;
      const dbQuery = `UPDATE employee SET role_id = ${new_role} WHERE id = ${employee_id}`;
      db.query(dbQuery, (error, results) => {
          if (error) throw error;
          console.table(results);
          promptUser();
  })});
};

const deleteEmployee = () => {
  const dbQuery = `SELECT employee.id, employee.first_name, employee.last_name FROM employee`;
  db.query(dbQuery, (error, results) => {
      if (error) throw error;
      console.table(results);
      deleteEmployeePrompt();
      });
  };
const deleteEmployeePrompt = () => {
  inquirer.prompt([
      {
          type: 'input',
          name: 'id',
          message: 'ID of the employee to be deleted:'
      }
  ])
  .then((answer) => {
      const { id } = answer;
      const dbQuery = `DELETE FROM employee WHERE employee.id = ${id}`;
          db.query(dbQuery, (error, results) => {
              if (error) throw error;
              console.table(`Employee has been deleted.`);
              promptUser();
      })
  })}