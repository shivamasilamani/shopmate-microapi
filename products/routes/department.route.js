const express = require('express');
const departmentController = require('../controllers/department.controller');

const route = express.Router();

route.get('/', (req, res) => {
  departmentController.getDepartments(req, res);
});

route.get('/:id', (req, res) => {
  departmentController.getDepartmentDetail(req, res);
});

route.post('/', (req, res) => {
  departmentController.createDepartment(req, res);
});

route.put('/:id', (req, res) => {
  departmentController.updateDepartment(req, res);
});

route.delete('/:id', (req, res) => {
  departmentController.deleteDepartment(req, res);
});

module.exports = route;
