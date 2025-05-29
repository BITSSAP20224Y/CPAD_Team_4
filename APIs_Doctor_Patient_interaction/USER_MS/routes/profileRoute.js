import express from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const profileRoute = express.Router();

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get user profile data (Internal Route)
 *     description: Retrieves the user profile data from the `user-data` header. This is an internal route and requires the user to be logged in. The `user-data` header is populated by the authentication middleware.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: user-data
 *         required: true
 *         description: JSON string containing user profile data, populated by the authentication middleware.
 *         schema:
 *           type: string
 *           example: '{"id": "12345", "name": "John Doe", "email": "johndoe@example.com"}'
 *     responses:
 *       200:
 *         description: User profile data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User profile data
 *                 userData:
 *                   type: object
 *                   additionalProperties: true
 *                   example:
 *                     id: 12345
 *                     name: John Doe
 *                     email: johndoe@example.com
 *       401:
 *         description: User data not found in headers (unauthorized access)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User data not found
 */
profileRoute.get("/profile",(req, res)=>{
    console.log("Request headers are:", req.headers);
    //the user data is already attached to the request headers by the middleware
    // console.log("User data attached to request headers:", req.headers["user-data"]);
    const userData = JSON.parse(req.headers["user-data"]);

    if(!userData) {
        return res.status(401).json({ message: "User data not found" });
    }
    
    return res.status(200).json({
        message: "User profile data",
        userData: userData
    });
}
);




/**
 * @swagger
 * /history:
 *   get:
 *     summary: Get user consultation history
 *     description: Retrieves the consultation history of the user by making a request to an external service. This is an internal route and requires the user to be logged in. The `user-data` header is populated by the authentication middleware.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: user-data
 *         required: true
 *         description: JSON string containing user profile data, populated by the authentication middleware.
 *         schema:
 *           type: string
 *           example: '{"patient": {"id": "6807ea5c1e1cd469bf3846ab", "name": "John Doe", "email": "johndoe@example.com"}}'
 *     responses:
 *       200:
 *         description: Consultation history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Consultation history retrieved successfully
 *                 history:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Appointment details fetched successfully
 *                     appointmentDetails:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "681c6895792a5322a376f869"
 *                           appointmentId:
 *                             type: string
 *                             example: "6814650de5f65170faa4e96a"
 *                           doctorId:
 *                             type: string
 *                             example: "68145dab430a85b573504bc3"
 *                           patientId:
 *                             type: string
 *                             example: "6807ea5c1e1cd469bf3846ab"
 *                           medicines:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ["Paracetamol", "cough Syrup"]
 *                           suggestions:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ["drink more water"]
 *                           status:
 *                             type: string
 *                             example: "completed"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-05-08T08:17:25.703Z"
 *                           __v:
 *                             type: integer
 *                             example: 0
 *       401:
 *         description: User data not found in headers (unauthorized access)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User data not found in headers
 *       500:
 *         description: Failed to retrieve consultation history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to retrieve consultation history
 */
profileRoute.get("/history", async (req, res) => {
    console.log("Inside /history route");
    try {
        console.log("Request headers are:", req.headers);

        // Ensure user-data header exists
        const userDataHeader = req.headers["user-data"];
        if (!userDataHeader) {
            return res.status(401).json({ message: "User data not found in headers" });
        }

        const userData = JSON.parse(userDataHeader);
        console.log("User data:", userData.patient.id);

        // Make the request to the external service
        const response = await axios.post(
            "http://backend:4500/api/getconsultdetails/patient",
            { patientId: userData.patient.id }, // Data payload
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Response from getconsultdetails service:", response.data);

        return res.status(200).json({
            message: "Consultation history retrieved successfully",
            history: response.data,
        });
    } catch (error) {
        console.error("Error in /history route:", error);
        res.status(500).json({ message: `Failed to retrieve consultation history: ${error.message}` });
    }
});


export default profileRoute;    
    
    