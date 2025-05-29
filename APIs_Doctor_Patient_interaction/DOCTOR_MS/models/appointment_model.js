
import { Schema,mongoose } from "mongoose";


const slotSchema = new mongoose.Schema({
  time: { type: String, required: true }, // e.g., "10:30"
  isBooked: { type: Boolean, default: false },
  patient: { type: Schema.Types.Mixed, default: null },
});

const doctorAvailabilitySchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: String, required: true }, // e.g., "2025-05-02"
  slots: [slotSchema]
});


//book appointment based on the

export default mongoose.model('DoctorAvailability', doctorAvailabilitySchema);