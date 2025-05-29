import express from 'express';
import cors from 'cors';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { initializeAndGetDatabases } from './helper/database_initilize.js';

import appointmentDataRouter from './routes/appointmentData.js';

import getConsultDetaisRouter from './routes/getConsultDetails.js';

const { userDB, doctorDB, appointmentDB } = await initializeAndGetDatabases();

export { userDB, doctorDB, appointmentDB };

import promBundle from 'express-prom-bundle';

const metricsMiddleware = promBundle({ includeMethod: true, includePath: true });
app.use(metricsMiddleware);

import backupRouter from './routes/backupRoute.js';



// Swagger Configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Backend Service Documentation',
      version: '1.0.0',
      description: 'Backend Service API',
      contact: {
        name: 'Developer',
        email: 'developer@example.com',
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
    return res.status(200).json({
        message: "Backend is running",
    });
}
);

app.use('/api/appointment', appointmentDataRouter);
app.use('/api/getconsultdetails/', getConsultDetaisRouter);
app.use('/api/backup', backupRouter);





app.listen(port, () => {
    console.log(`Backend is running on port: ${port}`);
});


