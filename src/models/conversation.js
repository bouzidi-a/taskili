const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    work: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Work',
      required: true,
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastMessage: {
      type: String,
      default: '',
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    unreadEmployer:   { type: Number, default: 0 },
    unreadFreelancer: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// One conversation per work per pair
conversationSchema.index({ work: 1, employer: 1, freelancer: 1 }, { unique: true });

module.exports = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);