import express from 'express';
import { getPatStatus, setPat } from '../controllers/patController.js';

const router = express.Router();

// Get PAT status
router.get('/status', getPatStatus);

// Set PAT
router.post('/', setPat);

export default router;
