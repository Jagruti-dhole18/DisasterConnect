import Message from '../models/Message.js';
import User from '../models/User.js';

export const sendContactMessage = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      return res.status(503).json({ success: false, message: 'Support is not available right now' });
    }

    const saved = await Message.create({
      sender: req.user._id,
      senderName: req.user.name,
      recipient: admin._id,
      content: content.trim(),
    });
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { sender, senderName, recipient, content } = req.body;
    if (!sender || !recipient || !content) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const message = new Message({ sender, senderName, recipient, content });
    const saved = await message.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { userId, otherId } = req.query;
    if (!userId || !otherId) {
      return res.status(400).json({ success: false, message: 'Missing userId or otherId' });
    }
    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: otherId },
        { sender: otherId, recipient: userId },
      ],
    }).sort({ createdAt: 1 });
    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ['$sender', userId] }, '$recipient', '$sender'],
          },
          lastMessage: { $last: '$content' },
          lastMessageTime: { $last: '$createdAt' },
          unreadCount: {
            $sum: { $cond: [{ $and: [{ $ne: ['$sender', userId] }, { $eq: ['$read', false] }] }, 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'otherUser',
        },
      },
      {
        $set: {
          senderName: { $ifNull: [{ $arrayElemAt: ['$otherUser.name', 0] }, 'Unknown User'] },
        },
      },
      { $project: { otherUser: 0 } },
      { $sort: { lastMessageTime: -1 } },
    ]);
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markMessageRead = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
