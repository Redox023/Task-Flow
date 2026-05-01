const express = require('express');
const { getProjects, getProject, createProject, updateMembers, deleteProject } = require('../controllers/project.controller');
const { getProjectTasks, createTask } = require('../controllers/task.controller');
const { authenticate, requireProjectRole } = require('../middleware/auth.middleware');
const { validate, createProjectSchema, updateMembersSchema, createTaskSchema } = require('../utils/validators');

const router = express.Router();

router.use(authenticate);

router.get('/', getProjects);
router.post('/', validate(createProjectSchema), createProject);

router.get('/:id', getProject);
router.delete('/:id', requireProjectRole(), deleteProject);
router.patch('/:id/members', requireProjectRole(), validate(updateMembersSchema), updateMembers);

router.get('/:id/tasks', getProjectTasks);
router.post('/:id/tasks', validate(createTaskSchema), createTask);

module.exports = router;
