const express = require('express');
const router = express.Router({ mergeParams: true }); // ← mergeParams for nested routes
const {
  createBid,
  getWorkBids,
  getMyBids,
  updateBidStatus,
  deleteBid,
} = require('../controllers/bidController');
const { protect, restrictTo } = require('../middlewares/auth');

router.post('/', protect, restrictTo('freelancer'), createBid);       // submit bid
router.get('/', protect, restrictTo('employer'),   getWorkBids);     // see bids on a work
router.get('/mine', protect, restrictTo('freelancer'), getMyBids);       // my bids
router.patch('/:bidId/status', protect, restrictTo('employer'), updateBidStatus); // accept/reject
router.delete('/:bidId', protect, restrictTo('freelancer'), deleteBid);     // delete bid

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Bids
 *   description: Bid management
 */

/**
 * @swagger
 * /api/works/{workId}/bids:
 *   post:
 *     summary: Submit a bid (freelancers only)
 *     tags: [Bids]
 *     parameters:
 *       - in: path
 *         name: workId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [coverLetter, bidAmount, deliveryTime]
 *             properties:
 *               coverLetter:
 *                 type: string
 *               bidAmount:
 *                 type: number
 *               deliveryTime:
 *                 type: number
 *     responses:
 *       201:
 *         description: Bid submitted
 *   get:
 *     summary: Get all bids on a work (employer only)
 *     tags: [Bids]
 *     parameters:
 *       - in: path
 *         name: workId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of bids
 *
 * /api/works/{workId}/bids/mine:
 *   get:
 *     summary: Get my bids (freelancer only)
 *     tags: [Bids]
 *     parameters:
 *       - in: path
 *         name: workId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: My bids
 *
 * /api/works/{workId}/bids/{bidId}/status:
 *   patch:
 *     summary: Accept or reject a bid (employer only)
 *     tags: [Bids]
 *     parameters:
 *       - in: path
 *         name: workId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: bidId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [accepted, rejected]
 *     responses:
 *       200:
 *         description: Bid status updated
 */