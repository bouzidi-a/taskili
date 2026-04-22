const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Fullname is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false,
    minlength: [8, "minimun password length is 8 characters"],
  },
  phoneNumber: { type: String, unique: true, trim: true },
  role: {
    type: String,
    enum: ["freelancer", "employer"],
    default: "employer",
  },

  // ✅ Email verification
  isVerified:             { type: Boolean, default: false },
  verificationCode:       { type: String,  default: null },
  verificationCodeExpiry: { type: Date,    default: null },

  // OAuth fields
  googleId:   { type: String },
  facebookId: { type: String },
  avatar:     { type: String },
  createdAt:  { type: Date, default: Date.now },
});

// ✅ Fixed: Removed 'next' entirely to work properly with 'async/await'
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);