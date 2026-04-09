const Bid = require('../models/bid');
const Work = require('../models/Work');

const createBid = async (req, res) => {
  try {
    if (req.user.role !== 'freelancer')
      return res.status(403).json({ error: 'Only freelancers can apply' });

    const newBid = new Bid({ ...req.body, freelancerId: req.user.id });
    await newBid.save();
    res.status(201).json({ message: 'Bid sent!' });
  } catch (err) {
    res.status(500).json({ error: 'Bidding failed' });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user.id })
      .populate('workId')
      .sort({ createdAt: -1 });
    res.json(bids);
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed' });
  }
};

const getIncomingBids = async (req, res) => {
  try {
    const myWorks = await Work.find({ owner: req.user.id });
    const bids = await Bid.find({
      workId: { $in: myWorks.map((w) => w._id) },
    }).populate('workId freelancerId', 'title fullName email');
    res.json(bids);
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed' });
  }
};

const updateBidStatus = async (req, res) => {
  try {
    const updatedBid = await Bid.findByIdAndUpdate(
      req.params.bidId,
      { status: req.body.status },
      { new: true },
    );
    res.json(updatedBid);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
};

module.exports = { createBid, getMyApplications, getIncomingBids, updateBidStatus };