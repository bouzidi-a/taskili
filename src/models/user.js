const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName:  { type: String, required: [true, "your fullname is required"] },
  email:     { type: String, required: [true, "email is required"], unique: true },
  password:  { type: String, required: [true, "password is required"] },
  role: {
    type: String,
    enum: ['freelancer', 'employer'],
    default: 'employer',
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);