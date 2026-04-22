const Work   = require('../models/Work');
const Bid    = require('../models/Bid');
const Review = require('../models/Review');

exports.getStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const role   = req.user.role;

    if (role === 'employer') {
      const [workStats, bidsReceived, spent] = await Promise.all([
        // Works by status
        Work.aggregate([
          { $match: { employer: userId } },
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),

        // Total bids received on all works
        Bid.aggregate([
          {
            $lookup: {
              from: 'works',
              localField: 'work',
              foreignField: '_id',
              as: 'work',
            },
          },
          { $unwind: '$work' },
          { $match: { 'work.employer': userId } },
          { $count: 'total' },
        ]),

        // Total spent (accepted bids)
        Bid.aggregate([
          {
            $lookup: {
              from: 'works',
              localField: 'work',
              foreignField: '_id',
              as: 'work',
            },
          },
          { $unwind: '$work' },
          {
            $match: {
              'work.employer': userId,
              status: 'accepted',
            },
          },
          { $group: { _id: null, total: { $sum: '$bidAmount' } } },
        ]),
      ]);

      // Format works by status
      const works = { total: 0, open: 0, in_progress: 0, completed: 0, cancelled: 0 };
      workStats.forEach(({ _id, count }) => {
        works[_id] = count;
        works.total += count;
      });

      return res.status(200).json({
        role: 'employer',
        works,
        bidsReceived: bidsReceived[0]?.total || 0,
        totalSpent:   spent[0]?.total || 0,
      });
    }

    if (role === 'freelancer') {
      const [bidStats, completedWorks, earned, reviewStats] = await Promise.all([
        // Bids by status
        Bid.aggregate([
          { $match: { freelancer: userId } },
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),

        // Completed works
        Bid.countDocuments({ freelancer: userId, status: 'accepted' }),

        // Total earned (accepted bids)
        Bid.aggregate([
          { $match: { freelancer: userId, status: 'accepted' } },
          { $group: { _id: null, total: { $sum: '$bidAmount' } } },
        ]),

        // Average rating
        Review.aggregate([
          { $match: { freelancer: userId } },
          {
            $group: {
              _id: null,
              averageRating: { $avg: '$rating' },
              totalReviews:  { $sum: 1 },
            },
          },
        ]),
      ]);

      // Format bids by status
      const bids = { total: 0, pending: 0, accepted: 0, rejected: 0 };
      bidStats.forEach(({ _id, count }) => {
        bids[_id] = count;
        bids.total += count;
      });

      return res.status(200).json({
        role: 'freelancer',
        bids,
        completedWorks,
        totalEarned:   earned[0]?.total || 0,
        averageRating: reviewStats[0]?.averageRating || 0,
        totalReviews:  reviewStats[0]?.totalReviews  || 0,
      });
    }

    res.status(400).json({ message: 'Invalid role' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};