const User = require('../models/user');
const Work = require('../models/Work');

const getStats = async (req, res) => {
  try {
    const freelancers = await User.countDocuments({ role: 'freelancer' });
    const works = await Work.countDocuments();
    res.json({ freelancers, works });
  } catch (err) {
    res.status(500).json({ error: 'Stats failed' });
  }
};

module.exports = { getStats };