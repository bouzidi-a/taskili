const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['new_bid', 'bid_accepted', 'bid_rejected', 'new_review', 'work_completed', 'new_message'],
      required: true,
    },
    message: { type: String, required: true },
    link:    { type: String }, // e.g. /works/:id
    read:    { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);