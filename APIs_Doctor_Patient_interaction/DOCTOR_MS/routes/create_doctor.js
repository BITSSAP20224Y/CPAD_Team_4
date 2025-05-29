import express from "express";
import createDoctorAvailabilitySlots from "../helper/slot_generator.js";

const createDoctorRouter = express.Router();
import Doctor from "../models/Doctor_model.js";
import Department from "../models/Department_model.js";



/**
 * @swagger
 * /api/doctor/register:
 *   post:
 *     summary: Register a doctor
 *     description: Add a new doctor to the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               specialization:
 *                 type: string
 *               departmentName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Doctor registered successfully
 *       400:
 *         description: Bad request
 */
createDoctorRouter.post("/register", async (req, res) => {
const { name, specialization, departmentName } = req.body;

try {
    
    const department = await Department.findOne({ name: departmentName });
    if (!department) {
    return res.status(404).json({ message: "Department not found" });
    }

    const isDoctorExists = await Doctor.findOne({ name, specialization });
    if (isDoctorExists) {
    return res.status(400).json({ message: "Doctor already exists, if name is exactly same, please add some receding number to make it unique. Example Washim_1" });
    }
    
    const newDoctor = new Doctor({
    name,
    specialization,
    departmentName, // saving departmentName only (not the ID)
    });

    const savedDoctor = await newDoctor.save();

    
    await Department.findByIdAndUpdate(department._id, {
    $addToSet: { doctors: savedDoctor._id },
    });

    return res.status(201).json(savedDoctor);
} catch (error) {
    console.error("Error creating doctor:", error);
    return res.status(500).json({ message: "Internal server error" });
}
});





/**
 * @swagger
 * /api/doctor/getall:
 *   get:
 *     summary: Get all doctors
 *     description: Fetches a list of all registered doctors.
 *     responses:
 *       200:
 *         description: List of doctors retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 60d21b4667d0d8992e610c85
 *                   name:
 *                     type: string
 *                     example: Dr. John Doe
 *                   specialization:
 *                     type: string
 *                     example: Cardiology
 *                   departmentName:
 *                     type: string
 *                     example: Cardiology Department
 *       500:
 *         description: Internal server error
 */
createDoctorRouter.get("/getall", async (req, res) => {
    try {
        console.log("Fetching all doctors...");
        const doctors = await Doctor.find();
        console.log("All doctors fetched successfully:", doctors);
        return res.status(200).json(doctors);
    } catch (error) {
        console.error("Error fetching all doctors:", error);
        return res.status(500).json({ message: "Internal server error: Error fetching all doctors" });
    }
});


/**
 * @swagger
 * /api/doctor/{id}:
 *   get:
 *     summary: Get doctor by ID
 *     description: Fetches a doctor's details using their unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the doctor.
 *         schema:
 *           type: string
 *           example: 68145dab430a85b573504bc3
 *     responses:
 *       200:
 *         description: Doctor details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 68145dab430a85b573504bc3
 *                 name:
 *                   type: string
 *                   example: Dr. John Doe
 *                 specialization:
 *                   type: string
 *                   example: Cardiology
 *                 departmentName:
 *                   type: string
 *                   example: Cardiology Department
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Internal server error
 */

createDoctorRouter.get("/:id", async (req, res) => {
const { id } = req.params;
try {
    const doctor = await Doctor.findById(id);
    if(!doctor){
        return res.status(404).json({ message: "Doctor not found" });
    }
    return res.status(200).json(doctor);
    
} catch (error) {
    console.error("Error fetching doctor:", error);
    return res.status(500).json({ message: "Internal server error" });
}
});





/**
 * @swagger
 * /api/doctor/checkin:
 *   post:
 *     summary: Create doctor availability slots
 *     description: Creates availability slots for a doctor on a specific date.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctorId:
 *                 type: string
 *                 example: 68145e09430a85b573504bc8
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-05-10
 *     responses:
 *       201:
 *         description: Availability slots created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 slots:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "09:00 AM - 09:30 AM"
 *       400:
 *         description: Availability already exists for this doctor on this date
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Internal server error
 */
createDoctorRouter.post("/checkin", async (req, res) => {
const { doctorId, date } = req.body;
console.log("Doctor ID:", doctorId);
console.log("Date:", date);
try {
    const doctor = await Doctor.findById(doctorId); 
    if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
    }

    try{

        const availability = await createDoctorAvailabilitySlots(doctorId, date);
        return res.status(201).json(availability);
    }catch (error) {
        if (error.message === "Availability already exists for this doctor on this date.") {
            return res.status(400).json({ message: error.message });
        }
        console.error("Error creating doctor availability:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
} catch (error) {
    console.error("Error creating doctor availability:", error);
    return res.status(500).json({ message: "Internal server error" });
}
});

export default createDoctorRouter;