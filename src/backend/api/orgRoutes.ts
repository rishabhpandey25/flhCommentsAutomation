import express from 'express';
import { getAllOrgs, setNeededOrgs } from '../controllers/orgController.js';

const router = express.Router();

// Get all organizations
router.get('/', getAllOrgs);

// Set needed organizations
router.patch('/', setNeededOrgs);

export default router;
