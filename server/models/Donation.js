import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  donorName: { type: String, required: true },
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ngoName: { type: String, required: true },
  amount: { type: Number, required: true },
  purpose: { type: String, default: 'General relief' },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'completed',
  },
}, { timestamps: true });

export default mongoose.model('Donation', donationSchema);
