import mongoose from "mongoose";
const appointmentDB = mongoose.createConnection(process.env.Appointment_URI);

const consultSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now,
    },
    appointmentId: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Doctor",
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    medicines: [{
        type: String,
        required: false
    }],
   
    suggestions: [{
        type: String,
        required: true
    }],

    status: {
        type: String,
        enum: ["followup", "completed", "cancelled"],
        default: "followup",
    }
});

const consult =  appointmentDB.model("Consult", consultSchema);
export default consult;
    
   