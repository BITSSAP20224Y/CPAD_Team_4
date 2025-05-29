import express from 'express';
import backupLogin from '../middleware/backupAuth.js';

const backupRouter = express.Router();

backupRouter.post('/login', backupLogin);

export default backupRouter;