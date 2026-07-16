import mongoose from 'mongoose';

const reliefCampSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ngoName: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, required: true },
  },
  capacity: { type: Number, default: 100 },
  occupants: { type: Number, default: 0 },
  foodStock: { type: Number, default: 0 },
  waterStock: { type: Number, default: 0 },
  medicineStock: { type: Number, default: 0 },
  medicalSupport: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['active', 'full', 'closed'],
    default: 'active',
  },
}, { timestamps: true });

export default mongoose.model('ReliefCamp', reliefCampSchema);
