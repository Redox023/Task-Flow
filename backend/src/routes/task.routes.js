const express = require('express');
const { updateTask, deleteTask } = require('../controllers/task.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate, updateTaskSchema } = require('../utils/validators');

const router = express.Router();

router.use(authenticate);

router.patch('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
