import Volunteer from '../models/Volunteer.js';
import User from '../models/User.js';

export const getVolunteers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const filter = {};
    if (req.query.availability) filter.availability = req.query.availability === 'true';
    if (req.query.verified) filter.verified = req.query.verified === 'true';

    const volunteers = await Volunteer.find(filter).skip(skip).limit(limit).sort({ rewardPoints: -1 });
    const total = await Volunteer.countDocuments(filter);
    res.json({ success: true, count: volunteers.length, total, page, pages: Math.ceil(total / limit), data: volunteers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) return res.status(404).json({ success: false, message: 'Volunteer not found' });
    res.json({ success: true, data: volunteer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateVolunteer = async (req, res) => {
  try {
    const { availability, skills } = req.body;
    const volunteer = await Volunteer.findOneAndUpdate(
      { user: req.user._id },
      { $set: { availability, skills } },
      { new: true }
    );
    if (!volunteer) return res.status(404).json({ success: false, message: 'Volunteer profile not found' });
    res.json({ success: true, data: volunteer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { verified: true },
      { new: true }
    );
    if (!volunteer) return res.status(404).json({ success: false, message: 'Volunteer not found' });
    await User.findByIdAndUpdate(volunteer.user, { $set: { 'volunteerProfile.verified': true }, isVerified: true });
    res.json({ success: true, data: volunteer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
