import express from 'express';
import { getProjects } from '../controllers/projectController.js';

const router = express.Router();

// Get all projects for a particular organization
router.get('/', getProjects);

export default router;
