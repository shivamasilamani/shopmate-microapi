const express = require('express');
const departmentController = require('../controllers/department.controller');

const route = express.Router();

route.get('/', (req, res) => {
  departmentController.getDepartments(req, res);
});

route.get('/:id', (req, res) => {
  departmentController.getDepartmentDetail(req, res);
});

route.post('/', departmentController.isAdmin, (req, res) => {
  departmentController.createDepartment(req, res);
});

route.put('/:id', departmentController.isAdmin, (req, res) => {
  departmentController.updateDepartment(req, res);
});

route.delete('/:id', departmentController.isAdmin, (req, res) => {
  departmentController.deleteDepartment(req, res);
});

module.exports = route;
