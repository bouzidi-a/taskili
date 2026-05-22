const mongoose = require('mongoose');

const workSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: 10,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: 30,
      maxlength: 5000,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'web_development',
        'mobile_development',
        'design',
        'writing',
        'marketing',
        'video',
        'audio',
        'data',
        'other',
      ],
    },
    skills: {
      type: [String],
      required: [true, 'At least one skill is required'],
      validate: {
        validator: (arr) => arr.length >= 1 && arr.length <= 10,
        message: 'Skills must be between 1 and 10',
      },
    },
    budget: {
      type: {
        type: String,
        enum: ['fixed', 'hourly'],
        required: true,
      },
      min: { type: Number, required: true, min: 1 },
      max: { type: Number, required: true },
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
      validate: {
        validator: (date) => date > Date.now(),
        message: 'Deadline must be in the future',
      },
    },
    experienceLevel: {
      type: String,
      enum: ['entry', 'intermediate', 'expert'],
      required: true,
    },
    location: {
      type: String,
      enum: ['remote', 'onsite', 'hybrid'],
      default: 'remote',
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'completed', 'cancelled'],
      default: 'open',
    },
    wilaya: {
  type: String,
  required: [true, 'Wilaya is required'],
  trim: true,
},
city: {
  type: String,
  required: [true, 'City is required'],
  trim: true,
},
phone: {
  type: String,
  required: [true, 'Phone is required'],
  trim: true,
  match: [/^\+?[\d\s\-()]{7,15}$/, 'Invalid phone number'],
},
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Index for fast filtering & searching
workSchema.index({ category: 1, status: 1 });
workSchema.index({ 'budget.min': 1, 'budget.max': 1 });
workSchema.index({ skills: 1 });
workSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.models.Work || mongoose.model('Work', workSchema);