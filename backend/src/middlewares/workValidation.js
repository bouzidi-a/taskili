const { body } = require('express-validator');

exports.createWorkRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 10, max: 100 }).withMessage('Title must be 10–100 chars'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 30, max: 5000 }).withMessage('Description must be 30–5000 chars'),

  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['web_development', 'mobile_development', 'design', 'writing',
           'marketing', 'video', 'audio', 'data', 'other'])
    .withMessage('Invalid category'),

  body('skills')
    .isArray({ min: 1, max: 10 }).withMessage('Skills must be an array of 1–10 items'),

  body('budget.type')
    .isIn(['fixed', 'hourly']).withMessage('Budget type must be fixed or hourly'),

  body('budget.min')
    .isFloat({ min: 1 }).withMessage('Budget min must be at least 1'),

  body('budget.max')
    .isFloat({ min: 1 }).withMessage('Budget max must be at least 1')
    .custom((max, { req }) => {
      if (parseFloat(max) < parseFloat(req.body.budget?.min)) {
        throw new Error('Budget max must be >= min');
      }
      return true;
    }),

  body('deadline')
    .isISO8601().withMessage('Deadline must be a valid date')
    .custom((date) => {
      if (new Date(date) <= new Date()) throw new Error('Deadline must be in the future');
      return true;
    }),

  body('experienceLevel')
    .isIn(['entry', 'intermediate', 'expert']).withMessage('Invalid experience level'),

  body('location')
    .optional()
    .isIn(['remote', 'onsite', 'hybrid']).withMessage('Invalid location type'),
];