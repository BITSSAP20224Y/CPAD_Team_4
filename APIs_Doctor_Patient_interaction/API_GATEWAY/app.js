import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit'; 
import promBundle from 'express-prom-bundle'; 
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import authenticate from './middleware/auth.js';
import dotenv from 'dotenv';
dotenv.config();  

import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import axios from 'axios';


const app = express();
const PORT = process.env.PORT || 3000;


const metricsMiddleware = promBundle({ includeMethod: true, includePath: true });
app.use(metricsMiddleware);

app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());


const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Gateway Documentation',
      version: '1.0.0',
      description: 'API Gateway for Microservices',
      
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Local server',
      },
    ],
  },
  apis: ['./routes/*.js', './app.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.get("/", (req, res) => {
  res.json({ "message": "API Gateway is running" });
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);



/**
 * @swagger
 * /auth:
 *   get:
 *     summary: Authenticate user
 *     description: Proxy to the user authentication service.
 *     responses:
 *       200:
 *         description: Successful authentication
 *       401:
 *         description: Unauthorized
 */
// app.use("/auth", 
//   createProxyMiddleware({
//     target: process.env.USER_MS,   
//     changeOrigin: true,
//     pathRewrite: {
//       "^auth": "userauth",
//     },
//     // onProxyReq: fixRequestBody,
//     onProxyReq: (proxyReq, req) => {
//       console.log(`the req is ${req}`);
//       if (req.headers["authorization"]) {
//           proxyReq.setHeader("authorization", req.headers["authorization"]);
//           console.log("Authorization header set in proxy request");
//       }
//   }
//   })
// );

app.use("/auth", async (req, res, next) => {
  try {
      // Check if user_ms is available
      await axios.get(`${process.env.USER_MS}/`);
      console.log("user_ms is available, forwarding request...");
      
      // Proxy the request to user_ms
      createProxyMiddleware({
          target: process.env.USER_MS,
          changeOrigin: true,
          pathRewrite: {
              "^/auth": "/userauth",
          },
          onProxyReq: (proxyReq, req) => {
              if (req.headers["authorization"]) {
                  proxyReq.setHeader("authorization", req.headers["authorization"]);
              }
          },
      })(req, res, next);
  } catch (error) {
      console.error("user_ms is unavailable, redirecting to backend... ", error.message);
      
      // Proxy the request to backend as a fallback
      createProxyMiddleware({
          target: process.env.APPOINTMENT_MS,
          changeOrigin: true,
          pathRewrite: {
            "^/auth": "/api/backup/login",
          },
          onProxyReq: (proxyReq, req) => {
              if (req.headers["authorization"]) {
                  proxyReq.setHeader("authorization", req.headers["authorization"]);
              }
          },
      })(req, res, next);
  }
});


app.use("/api/users/",
  authenticate,
  createProxyMiddleware({
    target: process.env.USER_MS,   
    changeOrigin: true,
    onProxyReq: fixRequestBody,

  })
);

app.use("/doctors/",
  authenticate,
  createProxyMiddleware({
    target: process.env.DOCTOR_MS,   
    changeOrigin: true,
    onProxyReq: fixRequestBody,
  })
);


app.use("/consult",
  createProxyMiddleware({
    target: process.env.APPOINTMENT_MS,
    changeOrigin: true,
    onProxyReq: fixRequestBody
  })
);

app.listen(PORT, () => {
  console.log(`The API Gateway is running on port ${PORT}`);
});