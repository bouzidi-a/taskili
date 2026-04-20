const express = require("express");
const router = express.Router();
const {
  createWork,
  getWorks,
  getWork,
  updateWork,
  deleteWork,
} = require("../controllers/workController");
const { protect, restrictTo } = require("../middlewares/auth");
const { createWorkRules } = require("../middlewares/workValidation");
const validate = require("../middlewares/validate");

router.get("/", getWorks); // public
router.get("/:id", getWork); // public
router.post(
  "/",
  protect,
  restrictTo("employer"),
  createWorkRules,
  validate,
  createWork,
); // employers only
router.put("/:id", protect, restrictTo("employer"), updateWork); // owner only
router.delete("/:id", protect, restrictTo("employer"), deleteWork); // owner only

module.exports = router;
/**
 * @swagger
 * tags:
 *   name: Works
 *   description: Work posting and management
 */

/**
 * @swagger
 * /api/works:
 *   get:
 *     summary: Get all works with filtering and sorting
 *     tags: [Works]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: skills
 *         schema:
 *           type: string
 *         description: Comma separated skills e.g. nodejs,react
 *       - in: query
 *         name: budgetMin
 *         schema:
 *           type: number
 *       - in: query
 *         name: budgetMax
 *         schema:
 *           type: number
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [entry, intermediate, expert]
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, oldest, budget_high, budget_low, most_viewed]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of works
 *   post:
 *     summary: Post a new work (employers only)
 *     tags: [Works]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, category, skills, budget, deadline, experienceLevel]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               budget:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [fixed, hourly]
 *                   min:
 *                     type: number
 *                   max:
 *                     type: number
 *               deadline:
 *                 type: string
 *                 format: date
 *               experienceLevel:
 *                 type: string
 *                 enum: [entry, intermediate, expert]
 *               location:
 *                 type: string
 *                 enum: [remote, onsite, hybrid]
 *     responses:
 *       201:
 *         description: Work posted successfully
 *       403:
 *         description: Only employers can post works
 */

/**
 * @swagger
 * /api/works/{id}:
 *   get:
 *     summary: Get a single work
 *     tags: [Works]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Work details
 *       404:
 *         description: Work not found
 *   put:
 *     summary: Update a work (owner only)
 *     tags: [Works]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Work updated
 *   delete:
 *     summary: Delete a work (owner only)
 *     tags: [Works]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Work deleted
 */