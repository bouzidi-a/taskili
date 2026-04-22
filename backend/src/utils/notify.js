const Notification = require('../models/Notification');

const notify = async ({ recipient, type, message, link }) => {
  try {
    await Notification.create({ recipient, type, message, link });
  } catch (err) {
    console.error('Notification error:', err.message);
  }
};

module.exports = notify;