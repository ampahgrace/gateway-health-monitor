import express from 'express';
import { getHealthStatus } from '../controllers/healthController.js';

const router = express.Router();

// GET /api/health — returns the current status of all monitored endpoints
router.get('/health', getHealthStatus);

export default router;
