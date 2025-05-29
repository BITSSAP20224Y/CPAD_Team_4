import express from 'express';
import mongoose from 'mongoose';
const appointmentDataRouter = express.Router();


import { userDB, doctorDB } from '../backend.js';
import consult from '../schema/consult.js';




/**
 * @swagger
 * /api/appointment/consult:
 *   post:
 *     summary: Book a consultation
 *     description: Books a consultation appointment for a patient with a doctor.
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
 *               doctorId:
 *                 type: string
 *                 description: The unique ID of the doctor.
 *                 example: 60d21b4667d0d8992e610c85
 *               appointmentId:
 *                 type: string
 *                 description: The unique ID of the appointment slot.
 *                 example: 60d21b4667d0d8992e610c85
 *               date:
 *                 type: string
 *                 format: date
 *                 description: The date of the appointment.
 *                 example: 2025-05-10
 *               medicines:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of prescribed medicines.
 *                 example: ["Paracetamol", "Cough Syrup"]
 *               suggestions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of doctor suggestions.
 *                 example: ["Drink more water", "Take rest"]
 *               status:
 *                 type: string
 *                 description: The status of the consultation.
 *                 example: followup
 *     responses:
 *       201:
 *         description: Consultation booked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Appointment booked successfully
 *                 consult:
 *                   type: object
 *                   properties:
 *                     appointmentId:
 *                       type: string
 *                       example: 60d21b4667d0d8992e610c85
 *                     doctorId:
 *                       type: string
 *                       example: 60d21b4667d0d8992e610c85
 *                     patientId:
 *                       type: string
 *                       example: 60d21b4667d0d8992e610c85
 *                     medicines:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Paracetamol", "Cough Syrup"]
 *                     suggestions:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Drink more water", "Take rest"]
 *                     status:
 *                       type: string
 *                       example: followup
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
 *         description: Resource not found (e.g., patient, doctor, or appointment)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Patient not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
appointmentDataRouter.post("/consult", async (req, res) => {
    try {
        const { patientId, doctorId, appointmentId, date, medicines, suggestions, status } = req.body;
        console.log("Received data:", patientId, doctorId, appointmentId, date);

        if (!patientId || !doctorId || !appointmentId || !date) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const patientObjectId = new mongoose.Types.ObjectId(patientId);
        const doctorObjectId = new mongoose.Types.ObjectId(doctorId);
        const appointmentObjectId = new mongoose.Types.ObjectId(appointmentId);

        const patientDetails = await userDB.collection('patients').findOne({ _id: patientObjectId });
        const doctorDetails = await doctorDB.collection('doctors').findOne({ _id: doctorObjectId });
        const appointmentDetails = await doctorDB.collection('doctoravailabilities').findOne(
            {
                doctorId: doctorObjectId,
                date: date,
                "slots._id": appointmentObjectId
            },
            {
                projection: {
                    slots: { $elemMatch: { _id: appointmentObjectId } }
                }
            }
        );

        if (!patientDetails) {
            return res.status(404).json({ error: "Patient not found" });
        }
        if (!doctorDetails) {
            return res.status(404).json({ error: "Doctor not found" });
        }
        if (!appointmentDetails) {
            return res.status(404).json({ error: "Appointment not found" });
        }

    
        const newConsult = new consult({
            appointmentId: appointmentObjectId,
            doctorId: doctorObjectId,
            patientId: patientObjectId,
            medicines: medicines || [],
            suggestions: suggestions || [],
            status: status || "followup",
        });

        await newConsult.save();

        res.status(201).json({ message: "Appointment booked successfully", consult: newConsult });

        console.log("Booked appointment details:", newConsult);

    } catch (err) {
        console.error("Error booking appointment:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default appointmentDataRouter;
