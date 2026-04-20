const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema(
  {
    work: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Work',
      required: true,
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    coverLetter: {
      type: String,
      required: [true, 'Cover letter is required'],
      minlength: 20,
      maxlength: 2000,
    },
    bidAmount: {
      type: Number,
      required: [true, 'Bid amount is required'],
      min: 1,
    },
    deliveryTime: {
      type: Number,
      required: [true, 'Delivery time is required'],
      min: 1,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Prevent duplicate bids
bidSchema.index({ work: 1, freelancer: 1 }, { unique: true });

module.exports = mongoose.models.Bid || mongoose.model('Bid', bidSchema);