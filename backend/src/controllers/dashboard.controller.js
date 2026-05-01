const Task = require('../models/Task');
const Project = require('../models/Project');
const { sendSuccess, AppError } = require('../utils/response');

const getDashboard = async (req, res, next) => {
  try {
    const { projectId } = req.query;
    const now = new Date();

    let taskFilter = {};

    if (projectId) {
      const project = await Project.findById(projectId);
      if (!project) throw new AppError('Project not found', 404);
      const membership = project.members.find((m) => m.userId.toString() === req.user.id.toString());
      if (!membership) throw new AppError('You are not a member of this project', 403);
      taskFilter.projectId = projectId;
    } else {
      // Get all projects the user is a member of
      const projects = await Project.find({ 'members.userId': req.user.id }, '_id');
      taskFilter.projectId = { $in: projects.map((p) => p._id) };
    }

    const tasks = await Task.find(taskFilter)
      .populate('assigneeId', 'fullName email')
      .populate('projectId', 'name');

    const totalTasks = tasks.length;
    const byStatus = {
      TODO: tasks.filter((t) => t.status === 'TODO').length,
      IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
      DONE: tasks.filter((t) => t.status === 'DONE').length,
    };

    const overdueTasks = tasks
      .filter((t) => t.dueDate && t.dueDate < now && t.status !== 'DONE')
      .map((t) => {
        const obj = t.toObject();
        return { ...obj, assignee: obj.assigneeId, project: obj.projectId };
      });

    const byAssigneeMap = {};
    tasks.forEach((t) => {
      const key = t.assigneeId ? t.assigneeId._id.toString() : '__unassigned__';
      if (!byAssigneeMap[key]) {
        byAssigneeMap[key] = {
          assignee: t.assigneeId
            ? { id: t.assigneeId._id, fullName: t.assigneeId.fullName, email: t.assigneeId.email }
            : { id: null, fullName: 'Unassigned', email: null },
          tasks: [],
        };
      }
      const obj = t.toObject();
      byAssigneeMap[key].tasks.push({ ...obj, assignee: obj.assigneeId, project: obj.projectId });
    });

    const byPriority = {
      LOW: tasks.filter((t) => t.priority === 'LOW').length,
      MEDIUM: tasks.filter((t) => t.priority === 'MEDIUM').length,
      HIGH: tasks.filter((t) => t.priority === 'HIGH').length,
    };

    return sendSuccess(
      res,
      {
        totalTasks,
        byStatus,
        byPriority,
        overdueTasks,
        byAssignee: Object.values(byAssigneeMap),
        completionRate: totalTasks > 0 ? Math.round((byStatus.DONE / totalTasks) * 100) : 0,
      },
      'Dashboard data fetched'
    );
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboard };
