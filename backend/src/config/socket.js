const jwt          = require('jsonwebtoken');
const User         = require('../models/user');
const Message      = require('../models/Message');
const Conversation = require('../models/Conversation');
const notify       = require('../utils/notify');

module.exports = (io) => {
  // Auth middleware for socket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('No token'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user   = await User.findById(decoded.id).select('-password');
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 ${socket.user.fullName} connected`);

    // Join conversation room
    socket.on('join_conversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`${socket.user.fullName} joined room ${conversationId}`);
    });

    // Send message via socket
    socket.on('send_message', async ({ conversationId, content }) => {
      try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return;

        const isParticipant =
          conversation.employer.toString()   === socket.user._id.toString() ||
          conversation.freelancer.toString() === socket.user._id.toString();

        if (!isParticipant) return;

        const message = await Message.create({
          conversation: conversationId,
          sender:       socket.user._id,
          content,
        });

        await message.populate('sender', 'fullName avatar');

        // Update conversation
        const unreadField = conversation.employer.toString() === socket.user._id.toString()
          ? 'unreadFreelancer'
          : 'unreadEmployer';

        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage:   content,
          lastMessageAt: new Date(),
          $inc: { [unreadField]: 1 },
        });

        // Emit to all in room
        io.to(conversationId).emit('new_message', message);

        // Notify the other participant
        const recipient = conversation.employer.toString() === socket.user._id.toString()
          ? conversation.freelancer
          : conversation.employer;

        await notify({
          recipient,
          type:    'new_bid', // reuse as new_message type or add to enum
          message: `New message from ${socket.user.fullName}`,
          link:    `/conversations/${conversationId}`,
        });

      } catch (err) {
        socket.emit('error', { message: err.message });
      }
    });

    socket.on('disconnect', () => {
      console.log(`❌ ${socket.user.fullName} disconnected`);
    });
  });
};