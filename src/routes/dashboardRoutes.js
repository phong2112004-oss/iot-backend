import express from 'express';
import { updateSettings } from '../controllers/dashboardController.js';
import { updateMonitorButtons } from '../controllers/dashboardController.js'; 

const router = express.Router();

router.post('/settings', updateSettings);
router.post('/monitor/buttons', updateMonitorButtons);

export default router;