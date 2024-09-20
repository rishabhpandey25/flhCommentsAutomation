// src/backend/db/models/projectModel.ts
import { db } from '../../db/db.js';
import { Project } from '../types.js';

export class ProjectModel implements Project {
  id: string;
  name: string;
  orgName: string; // Associate project with organization

  constructor(id: string, name: string, orgName: string) {
    this.id = id;
    this.name = name;
    this.orgName = orgName;
  }

  // Save or update a project
  async save(): Promise<void> {
    const existingProject = db.data!.projects.find(p => p.id === this.id);
    if (existingProject) {
      Object.assign(existingProject, { name: this.name, orgName: this.orgName });
    } else {
      db.data!.projects.push({ id: this.id, name: this.name, orgName: this.orgName });
    }
    await db.write();
  }

  // Static method to retrieve a project by ID
  static async getById(id: string): Promise<Project | null> {
    return db.data!.projects.find(project => project.id === id) || null;
  }

  // Static method to retrieve projects by organization name
  static async getByOrgName(orgName: string): Promise<Project[]> {
    const projects = db.data!.projects as Project[];
    return projects.filter(o => o.orgName === orgName);
  }
  // Static method to retrieve all projects
  static async getAll(): Promise<Project[]> {
    return db.data!.projects;
  }
}
