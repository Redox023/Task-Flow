const Joi = require('joi');

const objectId = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .message('Must be a valid ID');

const signupSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).max(72).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().required(),
});

const createProjectSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(500).optional().allow(''),
});

const updateMembersSchema = Joi.object({
  action: Joi.string().valid('add', 'remove').required(),
  userId: objectId.required(),
  role: Joi.string().valid('ADMIN', 'MEMBER').optional(),
});

const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().max(2000).optional().allow(''),
  dueDate: Joi.date().iso().optional().allow(null),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH').optional(),
  assigneeId: objectId.optional().allow(null, ''),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200).optional(),
  description: Joi.string().max(2000).optional().allow(''),
  dueDate: Joi.date().iso().optional().allow(null),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH').optional(),
  status: Joi.string().valid('TODO', 'IN_PROGRESS', 'DONE').optional(),
  assigneeId: objectId.optional().allow(null, ''),
});

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    const details = error.details.map((d) => d.message).join(', ');
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      error: details,
      data: {},
    });
  }
  req.body = value;
  next();
};

module.exports = {
  validate,
  signupSchema,
  loginSchema,
  createProjectSchema,
  updateMembersSchema,
  createTaskSchema,
  updateTaskSchema,
};
