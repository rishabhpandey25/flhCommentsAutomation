// src/backend/api/orgs.ts
import { Request, Response } from 'express';
import { Org } from '../data/types.js'; // Import the Org type
import { OrgModel } from '../data/models/orgModel.js'; // Import OrgModel to interact with organizations

// Get all organizations
export const getAllOrgs = async (req: Request, res: Response) => {
  try {
    const orgs: Org[] = await OrgModel.getAll();
    res.json({ Orgs: orgs, error: false, errorMsg: '' });
  } catch (error) {
    res.json({ Orgs: [], error: true, errorMsg: 'Failed to get organizations' });
  }
};

// Set needed organizations
export const setNeededOrgs = async (req: Request, res: Response) => {
    try {
      // Validate and parse the request body
      const Orgs: Org[] = req.body.Orgs; // Assuming the body contains a property `Orgs` which is an array of Org objects
  
      // Ensure Orgs is an array of Org objects
      if (!Array.isArray(Orgs) || !Orgs.every(org => 'id' in org && 'name' in org && 'needed' in org)) {
        return res.json({ success: false, error: true, errorMsg: 'Invalid input format' });
      }
  
      // Update organizations in the database using the model's update method
      const updatePromises = Orgs.map(orgData => OrgModel.update(orgData));
      await Promise.all(updatePromises);
  
      res.json({ success: true, error: false, errorMsg: '' });
    } catch (error) {
      res.json({ success: false, error: true, errorMsg: 'Failed to update organizations' });
    }
  };