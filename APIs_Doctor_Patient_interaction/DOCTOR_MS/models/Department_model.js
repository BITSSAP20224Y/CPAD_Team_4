import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String , required: true},
  doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }]
});

export default mongoose.model('Department', departmentSchema);