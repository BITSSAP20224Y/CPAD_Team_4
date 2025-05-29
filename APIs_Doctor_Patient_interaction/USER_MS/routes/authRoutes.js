import express from 'express';
import { register, login } from '../controller/AuthController.js';
import bodyParser from 'body-parser';

const authRouter = express.Router();
authRouter.use(bodyParser.json());
authRouter.use(bodyParser.urlencoded({ extended: true }));

/**
 * @swagger
 * /userauth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user and return a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
authRouter.post('/login', login);

/**
 * @swagger
 * /userauth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               age:
 *                 type: integer
 *               gender:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       500:
 *         description: Failed to register the user
 */
authRouter.post('/register', register);
authRouter.get("/",(req, res)=>{
  console.log("this is working")
  res.status(200).json({"message":"working"})
})

/**
 * @swagger
 * /userauth/test-post:
 *   post:
 *     summary: Test POST route
 *     description: Verifies that POST data is being received correctly and returns the received data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *             example:
 *               key1: value1
 *               key2: value2
 *     responses:
 *       200:
 *         description: POST data received successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Received POST data
 *                 receivedData:
 *                   type: object
 *                   additionalProperties: true
 *                   example:
 *                     key1: value1
 *                     key2: value2
 */
authRouter.post("/test-post", (req, res) => {
  console.log("Received body:", req.body);
  res.json({
    message: "Received POST data",
    receivedData: req.body
  });
});


export default authRouter;