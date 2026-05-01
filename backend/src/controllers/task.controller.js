const Task = require('../models/Task');
const Project = require('../models/Project');
const { sendSuccess, AppError } = require('../utils/response');

const getMembership = async (userId, projectId) => {
  const project = await Project.findById(projectId);
  if (!project) return null;
  return project.members.find((m) => m.userId.toString() === userId.toString()) || null;
};

const getProjectTasks = async (req, res, next) => {
  try {
    const { status, priority, assigneeId } = req.query;
    const projectId = req.params.id;

    const membership = await getMembership(req.user.id, projectId);
    if (!membership) throw new AppError('You are not a member of this project', 403);

    const filter = { projectId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assigneeId) filter.assigneeId = assigneeId;

    const tasks = await Task.find(filter)
      .populate('assigneeId', 'fullName email')
      .sort({ createdAt: -1 });

    // Normalize field names so frontend gets 'assignee' not 'assigneeId'
    const normalized = tasks.map((t) => {
      const obj = t.toObject();
      return { ...obj, id: obj._id, assignee: obj.assigneeId, assigneeId: obj.assigneeId?._id };
    });

    return sendSuccess(res, { tasks: normalized }, 'Tasks fetched');
  } catch (err) {
    next(err);
  }
};

const createTask = async (req, res, next) => {
  try {
    const projectId = req.params.id;

    const membership = await getMembership(req.user.id, projectId);
    if (!membership) throw new AppError('You are not a member of this project', 403);
    if (membership.role !== 'ADMIN') throw new AppError('Only admins can create tasks', 403);

    const { title, description, dueDate, priority, assigneeId } = req.body;

    if (assigneeId) {
      const assigneeMembership = await getMembership(assigneeId, projectId);
      if (!assigneeMembership) throw new AppError('Assignee must be a project member', 400);
    }

    const task = await Task.create({
      title, description, dueDate, priority, assigneeId: assigneeId || null, projectId,
    });

    await task.populate('assigneeId', 'fullName email');
    const obj = task.toObject();

    return sendSuccess(
      res,
      { task: { ...obj, id: obj._id, assignee: obj.assigneeId, assigneeId: obj.assigneeId?._id } },
      'Task created',
      201
    );
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) throw new AppError('Task not found', 404);

    const membership = await getMembership(req.user.id, task.projectId);
    if (!membership) throw new AppError('You are not a member of this project', 403);

    const { title, description, dueDate, priority, status, assigneeId } = req.body;

    const isAdmin = membership.role === 'ADMIN';
    const isAssignee = task.assigneeId && task.assigneeId.toString() === req.user.id.toString();

    if (!isAdmin && !isAssignee) {
      throw new AppError('You can only update tasks assigned to you', 403);
    }

    if (!isAdmin) {
      const forbiddenFields = ['title', 'description', 'priority', 'assigneeId', 'dueDate'];
      const attempted = forbiddenFields.filter((f) => req.body[f] !== undefined);
      if (attempted.length > 0) {
        throw new AppError('Members can only update task status', 403);
      }
    }

    if (assigneeId && assigneeId !== task.assigneeId?.toString()) {
      const assigneeMembership = await getMembership(assigneeId, task.projectId);
      if (!assigneeMembership) throw new AppError('Assignee must be a project member', 400);
    }

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (dueDate !== undefined) updates.dueDate = dueDate;
    if (priority !== undefined) updates.priority = priority;
    if (status !== undefined) updates.status = status;
    if (assigneeId !== undefined) updates.assigneeId = assigneeId || null;

    const updated = await Task.findByIdAndUpdate(req.params.id, updates, { new: true }).populate(
      'assigneeId',
      'fullName email'
    );

    const obj = updated.toObject();
    return sendSuccess(
      res,
      { task: { ...obj, id: obj._id, assignee: obj.assigneeId, assigneeId: obj.assigneeId?._id } },
      'Task updated'
    );
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) throw new AppError('Task not found', 404);

    const membership = await getMembership(req.user.id, task.projectId);
    if (!membership) throw new AppError('You are not a member of this project', 403);
    if (membership.role !== 'ADMIN') throw new AppError('Only admins can delete tasks', 403);

    await task.deleteOne();
    return sendSuccess(res, {}, 'Task deleted');
  } catch (err) {
    next(err);
  }
};

module.exports = { getProjectTasks, createTask, updateTask, deleteTask };
