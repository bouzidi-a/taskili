const express = require('express');
const router = express.Router();
const { getMe, updateMe, deleteMe } = require('../controllers/userController');
const { protect } = require('../middlewares/auth');

router.get('/me',     protect, getMe);     // Get my user info
router.put('/me',     protect, updateMe);  // Update my user info
router.delete('/me',  protect, deleteMe);  // Delete my account

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get my user info
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User info
 *       404:
 *         description: User not found
 *   put:
 *     summary: Update my user info
 *     tags: [Users]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *   delete:
 *     summary: Delete my account
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Account deleted successfully
 */