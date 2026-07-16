import ReliefCamp from '../models/ReliefCamp.js';

export const getReliefCamps = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.ngo) filter.ngo = req.query.ngo;
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { 'location.address': { $regex: req.query.search, $options: 'i' } },
      ];
    }
    const camps = await ReliefCamp.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await ReliefCamp.countDocuments(filter);
    res.json({ success: true, count: camps.length, total, page, pages: Math.ceil(total / limit), data: camps });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReliefCamp = async (req, res) => {
  try {
    const camp = await ReliefCamp.findById(req.params.id);
    if (!camp) return res.status(404).json({ success: false, message: 'Relief camp not found' });
    res.json({ success: true, data: camp });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createReliefCamp = async (req, res) => {
  try {
    const { name, location, capacity, foodStock, waterStock, medicineStock, medicalSupport } = req.body;
    const camp = await ReliefCamp.create({
      name, location, capacity, foodStock, waterStock, medicineStock, medicalSupport,
      ngo: req.user._id,
      ngoName: req.user.ngoProfile?.organizationName || req.user.name,
    });
    res.status(201).json({ success: true, data: camp });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateReliefCamp = async (req, res) => {
  try {
    const camp = await ReliefCamp.findById(req.params.id);
    if (!camp) return res.status(404).json({ success: false, message: 'Relief camp not found' });
    if (camp.ngo.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this camp' });
    }
    Object.assign(camp, req.body);
    if (camp.occupants >= camp.capacity) camp.status = 'full';
    await camp.save();
    res.json({ success: true, data: camp });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteReliefCamp = async (req, res) => {
  try {
    const camp = await ReliefCamp.findById(req.params.id);
    if (!camp) return res.status(404).json({ success: false, message: 'Relief camp not found' });
    if (camp.ngo.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await camp.deleteOne();
    res.json({ success: true, message: 'Relief camp deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
