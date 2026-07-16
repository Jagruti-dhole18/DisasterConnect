import Donation from '../models/Donation.js';
import Notification from '../models/Notification.js';

export const getDonations = async (req, res) => {
  try {
    const filter = {};
    if (req.query.ngo) filter.ngo = req.query.ngo;
    const donations = await Donation.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: donations.length, data: donations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDonation = async (req, res) => {
  try {
    const { donorName, amount, purpose, ngo } = req.body;
    const donation = await Donation.create({
      donor: req.user?._id,
      donorName,
      amount,
      purpose,
      ngo,
      ngoName: req.body.ngoName || 'NGO',
    });
    await Notification.create({
      user: ngo,
      title: 'New Donation Received',
      message: `You received a donation of ₹${amount} from ${donorName}.`,
      type: 'donation',
    });
    res.status(201).json({ success: true, data: donation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
