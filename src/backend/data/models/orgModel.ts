// src/backend/db/models/orgModel.ts
import { db } from '../../db/db.js';
import { Org } from '../types.js';

export class OrgModel implements Org {
  id: string;
  name: string;
  needed: boolean;

  constructor(id: string, name: string, needed: boolean) {
    this.id = id;
    this.name = name;
    this.needed = needed;
  }

  // Save or update an organization
  async save(): Promise<void> {
    db.data!.orgs[this.id] = { id: this.id, name: this.name, needed: this.needed };
    await db.write();
  }

  // Static method to retrieve an organization by ID
  static async getById(id: string): Promise<OrgModel | null> {
    const orgData = db.data!.orgs[id];
    return orgData ? new OrgModel(orgData.id, orgData.name, orgData.needed) : null;
  }

  // Static method to update an organization
  static async update(orgData: Org): Promise<void> {
    const orgModel = await OrgModel.getById(orgData.id);
    if (orgModel) {
      orgModel.name = orgData.name;
      orgModel.needed = orgData.needed;
      await orgModel.save();
    } else {
      // If the organization does not exist, you might want to handle it
      // For example, log a warning or respond with an error
      console.warn(`Organization with id ${orgData.id} does not exist`);
    }
  }

  // Static method to retrieve all organizations
  static async getAll(): Promise<Org[]> {
    return Object.values(db.data!.orgs);
  }
}
