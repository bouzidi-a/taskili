const Conversation = require('../models/Conversation');
const Message      = require('../models/Message');
const Bid          = require('../models/Bid');
const Work         = require('../models/Work');

// ─── Get or Create Conversation ──────────────────────────
exports.getOrCreateConversation = async (req, res) => {
  try {
    const { workId } = req.params;

    const work = await Work.findById(workId);
    if (!work) return res.status(404).json({ message: 'Work not found' });

    // Only employer or accepted freelancer can chat
    const isEmployer   = work.employer.toString() === req.user._id.toString();
    const acceptedBid  = await Bid.findOne({ work: workId, status: 'accepted' });

    const isFreelancer = acceptedBid &&
      acceptedBid.freelancer.toString() === req.user._id.toString();

    if (!isEmployer && !isFreelancer) {
      return res.status(403).json({ message: 'Not authorized to chat on this work' });
    }

    if (!acceptedBid) {
      return res.status(400).json({ message: 'No accepted bid yet — chat not available' });
    }

    let conversation = await Conversation.findOne({
      work:       workId,
      employer:   work.employer,
      freelancer: acceptedBid.freelancer,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        work:       workId,
        employer:   work.employer,
        freelancer: acceptedBid.freelancer,
      });
    }

    res.status(200).json({ conversation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Get My Conversations ─────────────────────────────────
exports.getMyConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const role   = req.user.role;

    const filter = role === 'employer'
      ? { employer: userId }
      : { freelancer: userId };

    const conversations = await Conversation.find(filter)
      .populate('work',       'title status')
      .populate('employer',   'fullName avatar')
      .populate('freelancer', 'fullName avatar')
      .sort({ lastMessageAt: -1 });

    res.status(200).json({ total: conversations.length, conversations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Get Messages ─────────────────────────────────────────
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

    // Only participants can read messages
    const isParticipant =
      conversation.employer.toString()   === req.user._id.toString() ||
      conversation.freelancer.toString() === req.user._id.toString();

    if (!isParticipant) return res.status(403).json({ message: 'Not authorized' });

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'fullName avatar')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { conversation: conversationId, sender: { $ne: req.user._id }, read: false },
      { read: true }
    );

    // Reset unread count
    const unreadField = conversation.employer.toString() === req.user._id.toString()
      ? 'unreadEmployer'
      : 'unreadFreelancer';

    await Conversation.findByIdAndUpdate(conversationId, { [unreadField]: 0 });

    res.status(200).json({ total: messages.length, messages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Send Message (REST fallback) ────────────────────────
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;

    if (!content) return res.status(400).json({ message: 'Content is required' });

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

    const isParticipant =
      conversation.employer.toString()   === req.user._id.toString() ||
      conversation.freelancer.toString() === req.user._id.toString();

    if (!isParticipant) return res.status(403).json({ message: 'Not authorized' });

    const message = await Message.create({
      conversation: conversationId,
      sender:       req.user._id,
      content,
    });

    // Update conversation last message
    const unreadField = conversation.employer.toString() === req.user._id.toString()
      ? 'unreadFreelancer'
      : 'unreadEmployer';

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage:   content,
      lastMessageAt: new Date(),
      $inc: { [unreadField]: 1 },
    });

    await message.populate('sender', 'fullName avatar');

    res.status(201).json({ message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};