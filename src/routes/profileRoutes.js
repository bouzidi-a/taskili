const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  getProfile,
  updateMyProfile,
  addPortfolioItem,
  deletePortfolioItem,
} = require('../controllers/profileController');
const { protect } = require('../middlewares/auth');

router.get('/me',                    protect, getMyProfile);      // my profile
router.get('/:userId',                        getProfile);        // public
router.put('/me',                    protect, updateMyProfile);   // update
router.post('/me/portfolio',         protect, addPortfolioItem);  // add portfolio
router.delete('/me/portfolio/:itemId', protect, deletePortfolioItem); // delete portfolio item

module.exports = router;
/**
 * @swagger
 * tags:
 *   name: Profiles
 *   description: User profile management
 */

/**
 * @swagger
 * /api/profiles/me:
 *   get:
 *     summary: Get my profile
 *     tags: [Profiles]
 *     responses:
 *       200:
 *         description: My profile
 *   put:
 *     summary: Update my profile
 *     tags: [Profiles]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               hourlyRate:
 *                 type: number
 *               location:
 *                 type: string
 *               website:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *
 * /api/profiles/{userId}:
 *   get:
 *     summary: Get public profile
 *     tags: [Profiles]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Public profile
 *
 * /api/profiles/me/portfolio:
 *   post:
 *     summary: Add portfolio item
 *     tags: [Profiles]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               link:
 *                 type: string
 *     responses:
 *       201:
 *         description: Portfolio item added
 */