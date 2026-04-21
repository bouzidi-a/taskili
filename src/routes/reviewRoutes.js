const express = require('express');
const router  = express.Router();
const {
  createReview,
  getFreelancerReviews,
  getWorkReview,
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../middlewares/auth');

router.post('/works/:workId',          protect, restrictTo('employer'), createReview);
router.get('/freelancer/:userId',                                        getFreelancerReviews);
router.get('/works/:workId',                                             getWorkReview);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Reviews and ratings
 */

/**
 * @swagger
 * /api/reviews/works/{workId}:
 *   post:
 *     summary: Leave a review (employer only, work must be completed)
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: workId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating, comment]
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review submitted
 *   get:
 *     summary: Get review for a work
 *     tags: [Reviews]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: workId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review details
 *
 * /api/reviews/freelancer/{userId}:
 *   get:
 *     summary: Get all reviews for a freelancer
 *     tags: [Reviews]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of reviews
 */