const Review = require('../models/Review');
const Work   = require('../models/Work');
const Bid    = require('../models/Bid');
const notify = require('../utils/notify');

// ─── Create Review ────────────────────────────────────────
exports.createReview = async (req, res) => {
  try {
    const work = await Work.findById(req.params.workId);
    if (!work) return res.status(404).json({ message: 'Work not found' });

    if (work.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (work.status !== 'completed') {
      return res.status(400).json({ message: 'Work must be completed before reviewing' });
    }

    const existing = await Review.findOne({ work: req.params.workId });
    if (existing) return res.status(400).json({ message: 'You already reviewed this work' });

    const acceptedBid = await Bid.findOne({ work: req.params.workId, status: 'accepted' });
    if (!acceptedBid) return res.status(404).json({ message: 'No accepted bid found' });

    const review = await Review.create({
      work:       req.params.workId,
      employer:   req.user._id,
      freelancer: acceptedBid.freelancer,
      rating:     req.body.rating,
      comment:    req.body.comment,
    });

    // ← notify freelancer
    await notify({
      recipient: acceptedBid.freelancer,
      type:      'new_review',
      message:   `You received a ${req.body.rating}★ review for "${work.title}"`,
      link:      `/works/${work._id}`,
    });

    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Get Reviews for a Freelancer ────────────────────────
exports.getFreelancerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ freelancer: req.params.userId })
      .populate('employer', 'fullName avatar')
      .populate('work', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({ total: reviews.length, reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Get Review for a Work ────────────────────────────────
exports.getWorkReview = async (req, res) => {
  try {
    const review = await Review.findOne({ work: req.params.workId })
      .populate('employer',   'fullName avatar')
      .populate('freelancer', 'fullName avatar');

    if (!review) return res.status(404).json({ message: 'No review yet' });

    res.status(200).json({ review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};