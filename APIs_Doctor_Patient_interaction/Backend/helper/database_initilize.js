import {
  connectAppointMentDB,
  connectDoctorDB,
  connectUserDB,
} from "../config/Datebase_Connections.js";

const initializeAndGetDatabases = async () => {
  try {
    const appointmentDB = await connectAppointMentDB();
    const doctorDB = await connectDoctorDB();
    const userDB = await connectUserDB();

    return { userDB, doctorDB, appointmentDB };
  } catch (error) {
    console.error("Failed to initialize one or more databases", error);
    throw error; // Make sure caller can handle the failure
  }
};

export { initializeAndGetDatabases };