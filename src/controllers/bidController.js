const Bid = require("../models/Bid");
const Work = require("../models/Work");
const notify = require('../utils/notify');

// ─── Create Bid ───────────────────────────────────────────
exports.createBid = async (req, res) => {
  try {
    const work = await Work.findById(req.params.workId);
    if (!work) return res.status(404).json({ message: "Work not found" });

    if (work.status !== "open") {
      return res.status(400).json({ message: "This work is no longer open for bids" });
    }

    if (work.employer.toString() === req.user._id.toString()) {
      return res.status(403).json({ message: "You can't bid on your own work" });
    }

    const existing = await Bid.findOne({ work: req.params.workId, freelancer: req.user._id });
    if (existing) {
      return res.status(400).json({ message: "You already bid on this work" });
    }

    const bid = await Bid.create({
      work:         req.params.workId,
      freelancer:   req.user._id,
      coverLetter:  req.body.coverLetter,
      bidAmount:    req.body.bidAmount,
      deliveryTime: req.body.deliveryTime,
    });

    // ← notify employer
    await notify({
      recipient: work.employer,
      type:      'new_bid',
      message:   `${req.user.fullName} submitted a bid on your work "${work.title}"`,
      link:      `/works/${work._id}`,
    });

    res.status(201).json({ message: "Bid submitted successfully", bid });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Get Bids for a Work (employer only) ─────────────────
exports.getWorkBids = async (req, res) => {
  try {
    const work = await Work.findById(req.params.workId);
    if (!work) return res.status(404).json({ message: "Work not found" });

    if (work.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const bids = await Bid.find({ work: req.params.workId })
      .populate("freelancer", "fullName avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({ total: bids.length, bids });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Get My Bids (freelancer) ─────────────────────────────
exports.getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ freelancer: req.user._id })
      .populate("work", "title status budget")
      .sort({ createdAt: -1 });

    res.status(200).json({ total: bids.length, bids });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Accept or Reject Bid (employer only) ────────────────
exports.updateBidStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be accepted or rejected" });
    }

    const bid = await Bid.findById(req.params.bidId).populate("work");
    if (!bid) return res.status(404).json({ message: "Bid not found" });

    if (bid.work.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    bid.status = status;
    await bid.save();

    if (status === "accepted") {
      await Work.findByIdAndUpdate(bid.work._id, { status: "in_progress" });
      await Bid.updateMany(
        { work: bid.work._id, _id: { $ne: bid._id } },
        { status: "rejected" }
      );
    }

    // ← notify freelancer
    await notify({
      recipient: bid.freelancer,
      type:      status === 'accepted' ? 'bid_accepted' : 'bid_rejected',
      message:   status === 'accepted'
        ? `Your bid on "${bid.work.title}" was accepted!`
        : `Your bid on "${bid.work.title}" was rejected.`,
      link: `/works/${bid.work._id}`,
    });

    res.status(200).json({ message: `Bid ${status}`, bid });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Delete Bid (freelancer only) ────────────────────────
exports.deleteBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.bidId);
    if (!bid) return res.status(404).json({ message: "Bid not found" });

    if (bid.freelancer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (bid.status !== "pending") {
      return res.status(400).json({ message: "Can't delete a bid that's already been reviewed" });
    }

    await bid.deleteOne();
    res.status(200).json({ message: "Bid deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};