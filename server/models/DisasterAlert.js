import mongoose from 'mongoose';

const disasterAlertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ['flood', 'earthquake', 'cyclone', 'fire', 'landslide', 'drought', 'other'],
    required: true,
  },
  severity: {
    type: String,
    enum: ['advisory', 'watch', 'warning', 'critical'],
    default: 'advisory',
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, required: true },
  },
  description: { type: String, required: true },
  affectedAreas: [{ type: String }],
  active: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('DisasterAlert', disasterAlertSchema);
