import MissingPerson from '../models/MissingPerson.js';

export const getMissingPersons = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { 'lastSeenLocation.address': { $regex: req.query.search, $options: 'i' } },
      ];
    }
    const persons = await MissingPerson.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await MissingPerson.countDocuments(filter);
    res.json({ success: true, count: persons.length, total, page, pages: Math.ceil(total / limit), data: persons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMissingPerson = async (req, res) => {
  try {
    const person = await MissingPerson.findById(req.params.id);
    if (!person) return res.status(404).json({ success: false, message: 'Record not found' });
    res.json({ success: true, data: person });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createMissingPerson = async (req, res) => {
  try {
    const person = await MissingPerson.create({
      ...req.body,
      reportedBy: req.user._id,
      reportedByName: req.user.name,
    });
    res.status(201).json({ success: true, data: person });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMissingPerson = async (req, res) => {
  try {
    const person = await MissingPerson.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!person) return res.status(404).json({ success: false, message: 'Record not found' });
    res.json({ success: true, data: person });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
