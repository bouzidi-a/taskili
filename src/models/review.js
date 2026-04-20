const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    work: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Work',
      required: true,
      unique: true, // one review per work
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
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      minlength: 10,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

// Auto-update average rating on Profile after save
reviewSchema.post('save', async function () {
  const Profile = require('./Profile');
  const reviews = await this.constructor.find({ freelancer: this.freelancer });
  const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  await Profile.findOneAndUpdate(
    { user: this.freelancer },
    { averageRating: Math.round(avg * 10) / 10, totalReviews: reviews.length }
  );
});

module.exports = mongoose.models.Review || mongoose.model('Review', reviewSchema);