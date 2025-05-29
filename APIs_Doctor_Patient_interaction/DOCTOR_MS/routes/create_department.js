import express from "express";
import mongoose from "mongoose";


const createDepartmentRouter = express.Router();
import Department from "../models/Department_model.js";
import Doctor from "../models/Doctor_model.js";


/**
 * @swagger
 * /api/department/registerdepartment:
 *   post:
 *     summary: Create a new department
 *     description: Creates a new department with the provided name and description.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Cardiology
 *               description:
 *                 type: string
 *                 example: Department specializing in heart-related treatments.
 *     responses:
 *       201:
 *         description: Department created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 60d21b4667d0d8992e610c85
 *                 name:
 *                   type: string
 *                   example: Cardiology
 *                 description:
 *                   type: string
 *                   example: Department specializing in heart-related treatments.
 *       400:
 *         description: Department already exists
 *       500:
 *         description: Internal server error
 */
createDepartmentRouter.post("/registerdepartment", async (req, res) => {
  const { name, description } = req.body;

  try {
    // Check if the department already exists
    const existingDepartment = await Department.find({ name });
    if (existingDepartment.length > 0) {
      return res.status(400).json({ message: "Department already exists" });
    }
    // Create a new department
    const newDepartment = new Department({
      name,
      description
    });
    const savedDepartment = await newDepartment.save();
    return res.status(201).json(savedDepartment);
  } catch (error) {
    console.error("Error creating department:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
);




/**
 * @swagger
 * /api/department/getdepartmentdetails:
 *   get:
 *     summary: Get all departments
 *     description: Fetches a list of all departments, including the doctors associated with each department.
 *     responses:
 *       200:
 *         description: List of departments retrieved successfully
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
 *                     example: Cardiology
 *                   description:
 *                     type: string
 *                     example: Department specializing in heart-related treatments.
 *                   doctors:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 60d21b4667d0d8992e610c85
 *                         name:
 *                           type: string
 *                           example: Dr. John Doe
 *                         specialization:
 *                           type: string
 *                           example: Cardiology
 *       500:
 *         description: Internal server error
 */
createDepartmentRouter.get("/getdepartmentdetails", async (req, res) => {
  try {
    const departments = await Department.find().populate("doctors");
    return res.status(200).json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
);







/**
 * @swagger
 * /api/department/getdepartmentdetails/{id}:
 *   get:
 *     summary: Get a department by ID
 *     description: Fetches a department by its ID, including the doctors associated with it.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the department.
 *         schema:
 *           type: string
 *           example: 6814594b7a64838e541318c6
 *     responses:
 *       200:
 *         description: Department retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 6814594b7a64838e541318c6
 *                 name:
 *                   type: string
 *                   example: Cardiology
 *                 description:
 *                   type: string
 *                   example: Department specializing in heart-related treatments.
 *                 doctors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 6814594b7a64838e541318c6
 *                       name:
 *                         type: string
 *                         example: Dr. John Doe
 *                       specialization:
 *                         type: string
 *                         example: Cardiology
 *       404:
 *         description: Department not found
 *       500:
 *         description: Internal server error
 */
createDepartmentRouter.get("/getdepartmentdetails/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const department = await Department.findById(id).populate("doctors");
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    return res.status(200).json(department);
  } catch (error) {
    console.error("Error fetching department:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
); 

export default createDepartmentRouter;