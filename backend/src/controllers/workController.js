const mongoose = require("mongoose");
const Work = require("../models/Work");
const Bid = require("../models/Bid");

const sanitizeQuery = (query) => {
  const sanitized = {};
  for (const key in query) {
    sanitized[key] = Array.isArray(query[key])
      ? query[key][query[key].length - 1]
      : query[key];
  }
  return sanitized;
};

// ─── Create Work ──────────────────────────────────────────
exports.createWork = async (req, res) => {
  try {
    const work = await Work.create({ ...req.body, employer: req.user._id });
    res.status(201).json({ message: "Work posted successfully", work });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Get All Works (with aggregation) ────────────────────
exports.getWorks = async (req, res) => {
  try {
    const query = sanitizeQuery(req.query);
    const {
      search,
      category,
      skills,
      level,
      location,
      budgetMin,
      budgetMax,
      budgetType,
      status = "open",
      sort = "newest",
      page = 1,
      limit = 10,
    } = query;

    const matchStage = {};
    matchStage.status = status;

    if (search) matchStage.$text = { $search: search };
    if (category) matchStage.category = category;
    if (skills) {
      const skillsArr = skills.split(",").map((s) => s.trim());
      matchStage.skills = { $in: skillsArr };
    }
    if (level) matchStage.experienceLevel = level;
    if (location) matchStage.location = location;
    if (budgetType) matchStage["budget.type"] = budgetType;
    if (budgetMin) matchStage["budget.min"] = { $gte: parseFloat(budgetMin) };
    if (budgetMax) matchStage["budget.max"] = { $lte: parseFloat(budgetMax) };

    const sortOptions = {
      newest:      { createdAt: -1 },
      oldest:      { createdAt: 1 },
      budget_high: { "budget.max": -1 },
      budget_low:  { "budget.min": 1 },
      most_viewed: { views: -1 },
    };
    const sortStage = sortOptions[sort] || sortOptions.newest;

    const pageNum  = Math.max(parseInt(page), 1);
    const limitNum = Math.min(parseInt(limit), 50);
    const skip     = (pageNum - 1) * limitNum;

    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: "users",
          localField: "employer",
          foreignField: "_id",
          as: "employer",
        },
      },
      { $unwind: "$employer" },
      {
        $addFields: {
          employer: {
            _id:      "$employer._id",
            fullName: "$employer.fullName",
            avatar:   "$employer.avatar",
          },
        },
      },

      // ✅ Join bids count
      {
        $lookup: {
          from: "bids",
          localField: "_id",
          foreignField: "work",
          as: "bids",
        },
      },
      {
        $addFields: {
          totalBids: { $size: "$bids" },
        },
      },
      { $project: { bids: 0 } },

      { $sort: sortStage },
      {
        $facet: {
          data:  [{ $skip: skip }, { $limit: limitNum }],
          total: [{ $count: "count" }],
        },
      },
    ];

    const [result] = await Work.aggregate(pipeline);
    const works = result.data;
    const total = result.total[0]?.count || 0;

    res.status(200).json({
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      works,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Get Single Work ──────────────────────────────────────
exports.getWork = async (req, res) => {
  try {
    const work = await Work.findById(req.params.id)
      .populate("employer", "fullName avatar"); // ✅ fixed: was "name avatar"

    if (!work) return res.status(404).json({ message: "Work not found" });

    // ✅ Get bids count for this work
    const totalBids = await Bid.countDocuments({ work: work._id });

    work.views += 1;
    await work.save();

    res.status(200).json({ work, totalBids });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Get My Works (employer) ──────────────────────────────
exports.getMyWorks = async (req, res) => {
  try {
    const works = await Work.find({ employer: req.user._id })
      .sort({ createdAt: -1 });

    // ✅ Add bids count to each work
    const worksWithBids = await Promise.all(
      works.map(async (work) => {
        const totalBids = await Bid.countDocuments({ work: work._id });
        return { ...work.toObject(), totalBids };
      })
    );

    res.status(200).json({ total: works.length, works: worksWithBids });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Update Work ──────────────────────────────────────────
exports.updateWork = async (req, res) => {
  try {
    const work = await Work.findById(req.params.id);
    if (!work) return res.status(404).json({ message: "Work not found" });

    if (work.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (req.body.status && req.body.status === "completed" && work.status !== "in_progress") {
      return res.status(400).json({ message: "Work must be in_progress to mark as completed" });
    }
    if (work.status === "completed" || work.status === "cancelled") {
      return res.status(400).json({ message: `Cannot edit a work that is ${work.status}` });
    }
    if (req.body.status === "in_progress") {
      return res.status(400).json({ message: "Cannot manually set status to in_progress" });
    }

    const updated = await Work.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ message: "Work updated", work: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Delete Work ──────────────────────────────────────────
exports.deleteWork = async (req, res) => {
  try {
    const work = await Work.findById(req.params.id);
    if (!work) return res.status(404).json({ message: "Work not found" });

    if (work.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // ✅ Delete all bids for this work too
    await Bid.deleteMany({ work: work._id });
    await work.deleteOne();

    res.status(200).json({ message: "Work deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};