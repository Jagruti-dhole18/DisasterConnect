import User from '../models/User.js';
import Message from '../models/Message.js';

export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ];
    }
    const users = await User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await User.countDocuments(filter);
    res.json({ success: true, count: users.length, total, page, pages: Math.ceil(total / limit), data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approveNGO = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'ngo') {
      return res.status(404).json({ success: false, message: 'NGO not found' });
    }
    user.ngoProfile.approved = true;
    user.isVerified = true;
    await user.save();
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPendingApprovals = async (req, res) => {
  try {
    const pendingNGOs = await User.find({ role: 'ngo', 'ngoProfile.approved': false });
    const pendingVolunteers = await User.find({ role: 'volunteer', 'volunteerProfile.verified': false });
    res.json({ success: true, data: { ngos: pendingNGOs, volunteers: pendingVolunteers } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const users = await User.find();
    const usersByRole = {
      citizen: users.filter((u) => u.role === 'citizen').length,
      volunteer: users.filter((u) => u.role === 'volunteer').length,
      ngo: users.filter((u) => u.role === 'ngo').length,
      admin: users.filter((u) => u.role === 'admin').length,
    };
    res.json({ success: true, data: { usersByRole, totalUsers: users.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const filter = {};
    
    // Filter by sender or recipient if specified
    if (req.query.userId) {
      filter.$or = [
        { sender: req.query.userId },
        { recipient: req.query.userId },
      ];
    }
    
    // Filter by read status if specified
    if (req.query.read !== undefined) {
      filter.read = req.query.read === 'true';
    }
    
    const messages = await Message.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sender', 'name email role')
      .populate('recipient', 'name email role');
    
    const total = await Message.countDocuments(filter);
    
    res.json({ 
      success: true, 
      count: messages.length, 
      total, 
      page, 
      pages: Math.ceil(total / limit), 
      data: messages 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
