import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, required: true },
  skills: [{ type: String }],
  availability: { type: Boolean, default: true },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  rewardPoints: { type: Number, default: 0 },
  missionsCompleted: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
}, { timestamps: true });

volunteerSchema.index({ availability: 1, location: '2dsphere' });

export default mongoose.model('Volunteer', volunteerSchema);
