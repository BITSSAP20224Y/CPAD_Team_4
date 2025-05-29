import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/mongoConnect.js';
import cors from 'cors';
import createDoctorRouter from './routes/create_doctor.js';
import createDepartmentRouter from './routes/create_department.js';
import bookAppointmentRouter from './routes/book_appointment.js';
import gethistoryRouter from './routes/getHistory.js';
dotenv.config();

import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';



const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3002;

import promBundle from 'express-prom-bundle';

const metricsMiddleware = promBundle({ includeMethod: true, includePath: true });
app.use(metricsMiddleware);

connectDB();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Doctor Microservice Documentation',
      version: '1.0.0',
      description: 'Doctor Microservice API',
      contact: {
        name: 'Developer',
        email: 'wakkhan75@gmail.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Local server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));





app.get('/', (req, res) => {
    return res.
    status(200).
    json({
        message: "Doctor service is running",
    });
}
);

app.use('/api/doctor', createDoctorRouter);
app.use('/api/department', createDepartmentRouter);
app.use('/api/appointment/doctor', bookAppointmentRouter);
app.use('/api/doctor/appointment', gethistoryRouter);
app.get("/",(req, res) => {
    res
    .status(200)
    .json({ "message": "Doctor service is running" });
  }
);


app.listen(port,"0.0.0.0" ,() => {
  console.log(`Doctor service is running on port ${port}`);
});