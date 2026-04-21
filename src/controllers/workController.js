const mongoose = require("mongoose");
const Work = require("../models/Work");


const sanitizeQuery = (query) => {
  const sanitized = {};
  for (const key in query) {
    sanitized[key] = Array.isArray(query[key])
      ? query[key][query[key].length - 1] // ← array? take last value
      : query[key]; // ← string? keep as is
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

    // Status
    matchStage.status = status;

    // Search in title & description
    if (search) {
      matchStage.$text = { $search: search };
    }

    // Category
    if (category) matchStage.category = category;

    // Skills (comma separated: ?skills=react,node)
    if (skills) {
      const skillsArr = skills.split(",").map((s) => s.trim());
      matchStage.skills = { $in: skillsArr };
    }

    // Experience level
    if (level) matchStage.experienceLevel = level;

    // Location
    if (location) matchStage.location = location;

    // Budget type
    if (budgetType) matchStage["budget.type"] = budgetType;

    // Budget range
    if (budgetMin) matchStage["budget.min"] = { $gte: parseFloat(budgetMin) };
    if (budgetMax) matchStage["budget.max"] = { $lte: parseFloat(budgetMax) };

    // Sort
    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      budget_high: { "budget.max": -1 },
      budget_low: { "budget.min": 1 },
      most_viewed: { views: -1 },
    };
    const sortStage = sortOptions[sort] || sortOptions.newest;

    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.min(parseInt(limit), 50);
    const skip = (pageNum - 1) * limitNum;

    // Aggregation pipeline
    const pipeline = [
      { $match: matchStage },

      // Join employer info
      {
        $lookup: {
          from: "users",
          localField: "employer",
          foreignField: "_id",
          as: "employer",
        },
      },
      { $unwind: "$employer" },

      // Clean up employer (only expose safe fields)
      {
        $addFields: {
          employer: {
            _id: "$employer._id",
            fullName: "$employer.fullName",
            avatar: "$employer.avatar",
          },
        },
      },
      {
        $project: {
          "employer.password": 0,
          "employer.email": 0,
          "employer.role": 0,
          "employer.createdAt": 0,
          "employer.__v": 0,
        },
      },

      { $sort: sortStage },

      // Pagination with total count
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limitNum }],
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
    const work = await Work.findById(req.params.id).populate(
      "employer",
      "name avatar",
    );
    if (!work) return res.status(404).json({ message: "Work not found" });

    // Increment views
    work.views += 1;
    await work.save();

    res.status(200).json({ work });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Update Work ──────────────────────────────────────────
exports.updateWork = async (req, res) => {
  try {
    const work = await Work.findById(req.params.id);
    if (!work) return res.status(404).json({ message: "Work not found" });

    // Only owner can update
    if (work.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (
      req.body.status &&
      req.body.status === "completed" &&
      work.status !== "in_progress"
    ) {
      return res
        .status(400)
        .json({ message: "Work must be in_progress to mark as completed" });
    }

    // Can't edit if already in progress
    if (work.status === "completed" || work.status === "cancelled") {
      return res
        .status(400)
        .json({ message: `Cannot edit a work that is ${work.status}` });
    }
    if (req.body.status === "in_progress") {
      return res
        .status(400)
        .json({ message: "Cannot manually set status to in_progress" });
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

    await work.deleteOne();
    res.status(200).json({ message: "Work deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
