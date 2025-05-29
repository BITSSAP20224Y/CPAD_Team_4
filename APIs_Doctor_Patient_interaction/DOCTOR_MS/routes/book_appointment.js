import express from 'express';
import Appointment from '../models/appointment_model.js';
import DoctorAvailability from '../models/appointment_model.js';


const bookAppointmentRouter = express.Router();


/**
 * @swagger
 * /api/appointment/doctor/availability/{doctorId}/{date}:
 *   get:
 *     summary: Get doctor availability
 *     description: Retrieves the availability of a doctor on a specific date.
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         description: The unique ID of the doctor.
 *         schema:
 *           type: string
 *           example: 68145dab430a85b573504bc3
 *       - in: path
 *         name: date
 *         required: true
 *         description: The date for which availability is being checked.
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-05-03
 *     responses:
 *       200:
 *         description: Doctor availability retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 doctorId:
 *                   type: string
 *                   example: 68145dab430a85b573504bc3
 *                 date:
 *                   type: string
 *                   format: date
 *                   example: 2025-05-03
 *                 slots:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       time:
 *                         type: string
 *                         example: "09:00 AM - 09:30 AM"
 *                       isBooked:
 *                         type: boolean
 *                         example: false
 *       404:
 *         description: No availability found for this doctor on this date
 *       500:
 *         description: Internal server error
 */
bookAppointmentRouter.get('/availability/:doctorId/:date', async (req, res) => {
  const { doctorId, date } = req.params;

  try {
    const availability = await DoctorAvailability.findOne({ doctorId, date });

    if (!availability) {
      return res.status(404).json({ message: 'No availability found for this doctor on this date' });
    }

    return res.status(200).json(availability);
  } catch (error) {
    console.error('Error fetching availability:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});







/**
 * @swagger
 * /api/appointment/doctor/bookappointment:
 *   post:
 *     summary: Book an appointment
 *     description: Books an appointment for a patient based on the doctor's availability.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctorId:
 *                 type: string
 *                 example: 68145dab430a85b573504bc3
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-05-03
 *               time:
 *                 type: string
 *                 example: "11:00"
 *               patientId:
 *                 type: string
 *                 example: 681dd7a276cd7a1bd841e050
 *     responses:
 *       201:
 *         description: Appointment booked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 doctorId:
 *                   type: string
 *                   example: 68145dab430a85b573504bc3
 *                 date:
 *                   type: string
 *                   format: date
 *                   example: 2025-05-10
 *                 time:
 *                   type: string
 *                   example: "11:00"
 *                 patientId:
 *                   type: string
 *                   example: 681dd7a276cd7a1bd841e050
 *       400:
 *         description: Slot not available
 *       404:
 *         description: Doctor not available on this date
 *       500:
 *         description: Internal server error
 */
// Book an appointment based on the availability
bookAppointmentRouter.post('/bookappointment', async (req, res) => {
  const { doctorId, date, time, patientId} = req.body;

  try {
    // Check if the doctor is available on the given date and time
    const availability = await DoctorAvailability.findOne({ doctorId, date });

    if (!availability) {
      return res.status(404).json({ message: 'Doctor not available on this date' });
    }

    const slot = availability.slots.find(slot => slot.time === time && !slot.isBooked);

    if (!slot) {
      return res.status(400).json({ message: 'Slot not available' });
    }

    // Book the appointment
    const appointment = new Appointment({
      doctorId,
      date,
      time,
      patient:patientId,
    });

    await appointment.save();

    // Mark the slot as booked
    slot.isBooked = true;
    slot.patient = patientId;

    await availability.save();

    return res.status(201).json(appointment);
  } catch (error) {
    console.error('Error booking appointment:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});









//delete an appointment based on the slot ID
/**
 * @swagger
 * /api/appointment/doctor/deleteappointment/{doctorId}/{date}/{slotId}:
 *   delete:
 *     summary: Delete an appointment
 *     description: Deletes an appointment based on the slot ID.
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         description: The unique ID of the doctor.
 *         schema:
 *           type: string
 *           example: 6814650de5f65170faa4e96b
 *       - in: path
 *         name: date
 *         required: true
 *         description: The date of the appointment.
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-05-03
 *       - in: path
 *         name: slotId
 *         required: true
 *         description: The unique ID of the slot.
 *         schema:
 *           type: string
 *           example: 6814650de5f65170faa4e96b
 *     responses:
 *       200:
 *         description: Slot deleted successfully
 *       404:
 *         description: Slot not found or no availability found for this doctor on this date
 *       500:
 *         description: Internal server error
 */
bookAppointmentRouter.delete('/deleteappointment/:doctorId/:date/:slotId', async (req, res) => {
  const { doctorId, date, slotId } = req.params;

  try {
    const availability = await DoctorAvailability.findOne({ doctorId, date });

    if (!availability) {
      return res.status(404).json({ message: 'No availability found for this doctor on this date' });
    }

    const slot = availability.slots.id(slotId);

    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

   
    slot.isBooked = false;
    slot.patient = null; 

    await availability.save();

    return res.status(200).json({ message: 'Slot deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});




//Get my appointments
/**
 * @swagger
 * /api/appointment/doctor/myappointments/{patientId}:
 *   get:
 *     summary: Get patient appointments ((Needs other microservice inorder to get details))
 *     description: Retrieves all appointments for a specific patient.
 *     deprecated: true
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         description: The unique ID of the patient.
 *         schema:
 *           type: string
 *           example: 681dd7a276cd7a1bd841e050
 *     responses:
 *       200:
 *         description: Appointments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   doctorId:
 *                     type: string
 *                     example: 60d21b4667d0d8992e610c85
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: 2025-05-10
 *                   time:
 *                     type: string
 *                     example: "09:00 AM - 09:30 AM"
 *                   patientId:
 *                     type: string
 *                     example: 60d21b4667d0d8992e610c85
 *       404:
 *         description: No appointments found for this patient
 *       500:
 *         description: Internal server error
 */
bookAppointmentRouter.get('/myappointments/:patientId', async (req, res) => {
  const { patientId } = req.params;

  try {
    const appointments = await Appointment.find({ patient: patientId });
    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found for this patient' });
    }
    return res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
);

export default bookAppointmentRouter;
