const mongoose = require('mongoose');

const BidSchema = new mongoose.Schema({
  workId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Work',
    required: true,
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bidAmount: { type: Number, required: true },
  message:   { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Bid', BidSchema);