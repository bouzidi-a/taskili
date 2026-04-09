const express = require('express');
const router = express.Router();
const {
  createBid,
  getMyApplications,
  getIncomingBids,
  updateBidStatus,
} = require('../controllers/bidController');
const verifyToken = require('../middlewares/auth');

router.post('/', verifyToken, createBid);
router.get('/my-applications', verifyToken, getMyApplications);
router.get('/incoming', verifyToken, getIncomingBids);
router.patch('/:bidId/status', verifyToken, updateBidStatus);

module.exports = router;