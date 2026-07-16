import Request from '../models/Request.js';
import Notification from '../models/Notification.js';
import Volunteer from '../models/Volunteer.js';

// @desc    Create a new request (SOS, food, water, medicine)
// @route   POST /api/requests
// @access  Private (citizen)
export const createRequest = async (req, res) => {
  try {
    const { type, description, priority, location, peopleCount, image } = req.body;
    const request = await Request.create({
      type, description, priority, location, peopleCount, image,
      citizen: req.user._id, citizenName: req.user.name,
    });

    // Notify nearby available volunteers
    if (type === 'sos' || priority === 'critical' || priority === 'high') {
      const volunteers = await Volunteer.find({ availability: true }).populate('user');
      const notifications = volunteers.filter((v) => v.user?._id).map((v) => ({
        user: v.user._id,
        title: type === 'sos' ? 'New SOS Alert' : 'New Request',
        message: `${type === 'sos' ? 'Critical SOS' : `A ${type} request`} from ${req.user.name}. ${peopleCount} people affected.`,
        type: type === 'sos' ? 'sos' : 'request',
        link: '/app/volunteer/missions',
      }));
      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
        req.io?.emit('new-request', request);
      }
    }

    res.status(201).json({ success: true, data: request });
  } catch (error) {
    const statusCode = error.name === 'ValidationError' ? 400 : 500;
    res.status(statusCode).json({ success: false, message: error.message });
  }
};

// @desc    Get all requests with filtering, searching, pagination
// @route   GET /api/requests
// @access  Private
export const getRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.citizen) filter.citizen = req.query.citizen;
    if (req.query.volunteer) filter.assignedVolunteer = req.query.volunteer;
    if (req.query.search) {
      filter.description = { $regex: req.query.search, $options: 'i' };
    }

    const requests = await Request.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Request.countDocuments(filter);

    res.json({
      success: true,
      count: requests.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: requests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single request
// @route   GET /api/requests/:id
// @access  Private
export const getRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update request status / assign volunteer
// @route   PUT /api/requests/:id
// @access  Private
export const updateRequest = async (req, res) => {
  try {
    const { status, assignedVolunteer, assignedVolunteerName } = req.body;
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    request.status = status || request.status;
    if (assignedVolunteer) {
      request.assignedVolunteer = assignedVolunteer;
      request.assignedVolunteerName = assignedVolunteerName;
    }
    if (status === 'resolved') {
      request.resolvedAt = new Date();
      // Award volunteer
      if (request.assignedVolunteer) {
        await Volunteer.findOneAndUpdate(
          { user: request.assignedVolunteer },
          { $inc: { missionsCompleted: 1, rewardPoints: 40 } }
        );
      }
    }
    await request.save();

    // Notify citizen
    await Notification.create({
      user: request.citizen,
      title: `Request ${status === 'resolved' ? 'Resolved' : 'Updated'}`,
      message: status === 'resolved'
        ? `${request.assignedVolunteerName || 'A volunteer'} has resolved your request.`
        : `Your ${request.type} request status is now: ${status}`,
      type: 'mission',
    });

    req.io?.emit('request-updated', request);
    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get requests by citizen
// @route   GET /api/requests/citizen/me
// @access  Private (citizen)
export const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ citizen: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get requests assigned to volunteer
// @route   GET /api/requests/volunteer/me
// @access  Private (volunteer)
export const getMyMissions = async (req, res) => {
  try {
    const requests = await Request.find({ assignedVolunteer: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
