import express from 'express';
import mongoose from 'mongoose';
import axios from 'axios';
const gethistoryRouter = express.Router();

gethistoryRouter.get("/history", async (req, res) => {
    try {
        const { doctorId } = req.body;
        console.log("Received data:", doctorId);

        
        if (!doctorId) {
            return res.status(400).json({ error: "Doctor ID is required" });
        }

        
        if (!mongoose.Types.ObjectId.isValid(doctorId)) {
            return res.status(400).json({ error: "Invalid Doctor ID format" });
        }

        const response = await axios.post(
            "http://localhost:3000/consult/api/getconsultdetails/doctor",
            { doctorId }, // Data payload
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        
        if (response.status !== 200) {
            return res.status(response.status).json({ message: "Failed to retrieve consultation history" });
        }

        console.log("Response from getconsultdetails service:", response.data);

        
        return res.status(200).json({
            message: "Consultation history retrieved successfully",
            history: response.data.appointmentDetails, // Align with the external service response structure
        });
    } catch (error) {
        console.error("Error in /history route:", error);
        res.status(500).json({ error: "Failed to retrieve consultation history" });
    }
});
export default gethistoryRouter;
