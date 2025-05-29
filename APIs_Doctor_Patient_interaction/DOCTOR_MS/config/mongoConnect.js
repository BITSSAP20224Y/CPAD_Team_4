import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully to the Doctor_MS DB");
  } catch (error) {
    console.error("MongoDB Failed to connect Doctor_MS DB:", error);
    process.exit(1);
  }
}
export default connectDB;