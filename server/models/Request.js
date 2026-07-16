import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  address: { type: String },
});

const requestSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['sos', 'food', 'water', 'medicine'],
    required: true,
  },
  citizen: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  citizenName: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in_progress', 'resolved', 'cancelled'],
    default: 'pending',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  description: { type: String, required: true },
  location: { type: locationSchema, required: true },
  peopleCount: { type: Number, default: 1 },
  assignedVolunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedVolunteerName: { type: String },
  image: { type: String },
  resolvedAt: { type: Date },
}, { timestamps: true });

requestSchema.index({ status: 1, type: 1, createdAt: -1 });
requestSchema.index({ citizen: 1 });
requestSchema.index({ assignedVolunteer: 1 });

export default mongoose.model('Request', requestSchema);
