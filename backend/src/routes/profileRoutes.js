const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  getProfile,
  updateMyProfile,
  addPortfolioItem,
  deletePortfolioItem,
  addExperience,
  deleteExperience,
  addEducation,
  deleteEducation,
  addQualification,
  deleteQualification,
  saveCV,
} = require('../controllers/profileController');
const { protect } = require('../middlewares/auth');

router.get('/me',                             protect, getMyProfile);       // my profile
router.get('/:userId',                                 getProfile);         // public
router.put('/me',                             protect, updateMyProfile);    // update

// ─── Portfolio ────────────────────────────────────────────
router.post('/me/portfolio',                  protect, addPortfolioItem);   // add portfolio item
router.delete('/me/portfolio/:itemId',        protect, deletePortfolioItem);// delete portfolio item

// ─── Experiences ──────────────────────────────────────────
router.post('/me/experiences',                protect, addExperience);      // add experience
router.delete('/me/experiences/:itemId',      protect, deleteExperience);   // delete experience

// ─── Education ────────────────────────────────────────────
router.post('/me/education',                  protect, addEducation);       // add education
router.delete('/me/education/:itemId',        protect, deleteEducation);    // delete education

// ─── Qualifications ───────────────────────────────────────
router.post('/me/qualifications',             protect, addQualification);   // add qualification
router.delete('/me/qualifications/:itemId',   protect, deleteQualification);// delete qualification

// ─── CV ───────────────────────────────────────────────────
router.post('/me/cv',                         protect, saveCV);             // save cv info

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
 *
 * /api/profiles/me/experiences:
 *   post:
 *     summary: Add experience
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
 *               company:
 *                 type: string
 *               years:
 *                 type: string
 *     responses:
 *       201:
 *         description: Experience added
 *
 * /api/profiles/me/education:
 *   post:
 *     summary: Add education
 *     tags: [Profiles]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [degree]
 *             properties:
 *               degree:
 *                 type: string
 *               school:
 *                 type: string
 *               years:
 *                 type: string
 *     responses:
 *       201:
 *         description: Education added
 *
 * /api/profiles/me/qualifications:
 *   post:
 *     summary: Add qualification
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
 *               issuer:
 *                 type: string
 *               year:
 *                 type: string
 *     responses:
 *       201:
 *         description: Qualification added
 */