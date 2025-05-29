import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/connect_mongo.js';
import authRouter from './routes/authRoutes.js';
import profileRoute from './routes/profileRoute.js';

import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import axios from 'axios';

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3001;

import promBundle from 'express-prom-bundle';

const metricsMiddleware = promBundle({ includeMethod: true, includePath: true });
app.use(metricsMiddleware);


const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'User Microservice Documentation',
      version: '1.0.0',
      description: 'User Microservice API',
      contact: {
        name: 'Developer',
        email: 'developer@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Local server',
      },
    ],
  },
  apis: ['./routes/*.js'], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));





connectDB();

app.use("/userauth",authRouter);
app.use("/patient", profileRoute);

app.get("/yes",(req, res)=>{
    res.status(200).json({"message":"yes"})
}
);

app.post("/test-post", (req, res) => {
  console.log("Received body:", req.body);
  res.json({
    message: "Received POST data",
    receivedData: req.body
  });
});

app.get("/", (req, res) => {
    res.send("Welcome to the User Microservice");
});


app.listen(PORT, "0.0.0.0",() => {
  console.log(`Server is running on port ${PORT}`);
}
);