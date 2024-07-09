// routes/userRoute.js

import express from 'express';
import { identifyUser, register } from '../controllers/userController.js';

const router = express.Router();

// POST /identify route
router.post('/identify', identifyUser);
router.post('/register', register);
export default router;
