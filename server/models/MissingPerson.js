import mongoose from 'mongoose';

const missingPersonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  lastSeenLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, required: true },
  },
  lastSeenDate: { type: Date, required: true },
  description: { type: String, required: true },
  photo: { type: String },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reportedByName: { type: String, required: true },
  status: {
    type: String,
    enum: ['missing', 'found', 'safe'],
    default: 'missing',
  },
}, { timestamps: true });

export default mongoose.model('MissingPerson', missingPersonSchema);
