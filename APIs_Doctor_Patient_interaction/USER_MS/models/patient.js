import mongoose from "mongoose";
const patientSchema = new mongoose.Schema({
  entity: {
    type: String,
    enum: ["patient", "doctor", "admin"],
    required: true,
    default: "patient",
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum:["Male", "Female", "Other"],
    required: true,
},
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});
const patient = mongoose.model("patient", patientSchema);
export default patient;