const Work = require("../models/Work");

const getWorks = async (req, res) => {
  try {
    const { category, city, minPrice, maxPrice, search } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (city) filter.location = { $regex: city, $options: "i" };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const works = await Work.find(filter)
      .populate("owner", "fullName email")
      .sort({ createdAt: -1 });

    res.json(works);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
};

const createWork = async (req, res) => {
  try {
    if (req.user.role !== "employer")
      return res.status(403).json({ error: "Only employers can post works" });

    const newWork = new Work({
      ...req.body,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      owner: req.user.id,
    });

    await newWork.save();
    res.status(201).json(newWork);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getWorks, createWork };
