const express = require('express');
const router  = express.Router();
const {
  getOrCreateConversation,
  getMyConversations,
  getMessages,
  sendMessage,
} = require('../controllers/chatController');
const { protect } = require('../middlewares/auth');

router.get('/conversations',                    protect, getMyConversations);
router.get('/conversations/:workId/start',      protect, getOrCreateConversation);
router.get('/conversations/:conversationId/messages', protect, getMessages);
router.post('/conversations/:conversationId/messages', protect, sendMessage);

module.exports = router;
/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Real-time chat
 */

/**
 * @swagger
 * /api/chat/conversations:
 *   get:
 *     summary: Get my conversations
 *     tags: [Chat]
 *     responses:
 *       200:
 *         description: List of conversations
 *
 * /api/chat/conversations/{workId}/start:
 *   get:
 *     summary: Start or get a conversation for a work
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: workId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conversation object
 *
 * /api/chat/conversations/{conversationId}/messages:
 *   get:
 *     summary: Get messages in a conversation
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of messages
 *   post:
 *     summary: Send a message
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent
 */