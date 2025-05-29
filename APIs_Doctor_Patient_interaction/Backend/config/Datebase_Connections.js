import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectAppointMentDB =  () => {
  try {
    const appointmentConnection =  mongoose.createConnection(process.env.Appointment_URI);
    console.log("Connected to Appointment database");
    return appointmentConnection;
  } catch (error) {
    console.error("Error connecting to Appointment database:", error);
  }
};

const connectDoctorDB =  () => {
  try {
    const doctorConnection =  mongoose.createConnection(process.env.Doctor_URI);
    console.log("Connected to Doctor database");
    return doctorConnection;
  } catch (error) {
    console.error("Error connecting to Doctor database:", error);
  }
};

const connectUserDB =  () => {
  try {
    const userConnection =  mongoose.createConnection(process.env.User_URI);
    console.log("Connected to User database");
    return userConnection;
  } catch (error) {
    console.error("Error connecting to User database:", error);
  }
};

export { connectAppointMentDB, connectDoctorDB, connectUserDB };
