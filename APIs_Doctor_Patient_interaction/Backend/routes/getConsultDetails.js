import express from 'express';
import mongoose from 'mongoose';


import { appointmentDB } from '../backend.js';

const getConsultDetaisRouter = express.Router();


/**
 * @swagger
 * /api/getconsultdetails/patient:
 *   post:
 *     summary: Get consultation details for a patient
 *     description: Retrieves all consultation appointment details for a specific patient.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: string
 *                 description: The unique ID of the patient.
 *                 example: 60d21b4667d0d8992e610c85
 *     responses:
 *       200:
 *         description: Appointment details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Appointment details fetched successfully
 *                 appointmentDetails:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 60d21b4667d0d8992e610c85
 *                       doctorId:
 *                         type: string
 *                         example: 60d21b4667d0d8992e610c85
 *                       patientId:
 *                         type: string
 *                         example: 60d21b4667d0d8992e610c85
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: 2025-05-10
 *                       status:
 *                         type: string
 *                         example: completed
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: All fields are required
 *       404:
 *         description: Appointment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Appointment not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
getConsultDetaisRouter.post("/patient", async (req, res) => {
    const { patientId } = req.body;
    console.log(" req.body :", req.body);
    console.log("Received data:", patientId);
    if (!patientId) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const patientObjectId = new mongoose.Types.ObjectId(patientId);
        const appointmentDetails = await appointmentDB.collection('consults').find({ patientId: patientObjectId }).toArray();

        if (!appointmentDetails) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        res.status(200).json({ message: "Appointment details fetched successfully", appointmentDetails });
    } catch (error) {
        console.error("Error fetching appointment details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
);







/**
 * @swagger
 * /api/getconsultdetails/doctor:
 *   post:
 *     summary: Get consultation details for a doctor
 *     description: Retrieves all consultation appointment details for a specific doctor.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctorId:
 *                 type: string
 *                 description: The unique ID of the doctor.
 *                 example: 68145dab430a85b573504bc3
 *     responses:
 *       200:
 *         description: Appointment details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Appointment details fetched successfully
 *                 appointmentDetails:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 60d21b4667d0d8992e610c85
 *                       doctorId:
 *                         type: string
 *                         example: 68145dab430a85b573504bc3
 *                       patientId:
 *                         type: string
 *                         example: 60d21b4667d0d8992e610c85
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: 2025-05-10
 *                       status:
 *                         type: string
 *                         example: completed
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: All fields are required
 *       404:
 *         description: Appointment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Appointment not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
getConsultDetaisRouter.post("/doctor", async (req, res) => {
    const { doctorId } = req.body;
    console.log("Received data:", doctorId);
    if (!doctorId) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const doctorObjectId = new mongoose.Types.ObjectId(doctorId);
        const appointmentDetails = await appointmentDB.collection('consults').find({ doctorId: doctorObjectId }).toArray();

        if (!appointmentDetails) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        res.status(200).json({ message: "Appointment details fetched successfully", appointmentDetails });
    } catch (error) {
        console.error("Error fetching appointment details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
);

export default getConsultDetaisRouter;
