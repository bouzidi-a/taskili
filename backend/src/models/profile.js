const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    bio: { type: String, maxlength: 500, default: "" },
    skills: { type: [String], default: [] },
    portfolio: [
      {
        title:       { type: String, required: true },
        description: { type: String },
        link:        { type: String },
      },
    ],

    
    experiences: [
      {
        title:   { type: String, required: true },
        company: { type: String },
        years:   { type: String },
      },
    ],
    education: [
      {
        degree: { type: String, required: true },
        school: { type: String },
        years:  { type: String },
      },
    ],
    qualifications: [
      {
        title:  { type: String, required: true },
        issuer: { type: String },
        year:   { type: String },
      },
    ],
    cv: {
      name: { type: String, default: "" },
      url:  { type: String, default: "" },
    },

    hourlyRate:    { type: Number, min: 0, default: 0 },
    location:      { type: String, default: "" },
    website:       { type: String, default: "" },
    social: {
      linkedin: { type: String, default: "" },
      github:   { type: String, default: "" },
      twitter:  { type: String, default: "" },
    },
    averageRating: { type: Number, default: 0 },
    totalReviews:  { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.models.Profile || mongoose.model("Profile", profileSchema);