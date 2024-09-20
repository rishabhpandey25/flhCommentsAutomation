// src/backend/api/pat.ts
import { Request, Response } from 'express';
import axios from 'axios';
import { PatModel } from '../data/models/patModel.js';
import { Pat } from '../data/types.js';
import { error } from 'console';

const ADO_PAT_URL = 'https://dev.azure.com/office/_apis/projects?api-version=6.0';

// Get PAT status
export const getPatStatus = async (req: Request, res: Response) => {
  try {
    const pat : Pat = await PatModel.get();
    if (pat.expired) {
      return res.json({ expired: true, error: false, errorMsg: '' });
    }
    
    const username = ''; // Leave blank for PAT
    const auth = Buffer.from(`${username}:${pat.patToken}`).toString('base64');
    // Check PAT status with Azure DevOps
    const response = await axios.get(ADO_PAT_URL, {
      headers: { Authorization: `Basic ${auth}` },
    });
    
    // If response is successful, consider PAT not expired
    res.json({ expired: false, error: false, errorMsg: '' });
  } catch (error) {
    res.json({ expired: true, error: true, errorMsg: 'PAT check failed' });
  }
};

// Set PAT
export const setPat = async (req: Request, res: Response) => {
  try {
    const { Pat: patToken } = req.body as { Pat: string };
    
    const username = ''; // Leave blank for PAT
    const auth = Buffer.from(`${username}:${patToken}`).toString('base64');
    // Validate PAT with Azure DevOps
    const response = await axios.get(ADO_PAT_URL, {
      headers: { Authorization: `Basic ${auth}` },
    });

    console.log(response.status);
    if(response.status != 200){
      throw error("blah");
    }

    // Save or update PAT in the database
    const patModel = new PatModel(patToken, false);
    await patModel.save();
    
    res.json({ success: true, error: false, errorMsg: '' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: true, errorMsg: 'PAT update failed' });
  }
};
