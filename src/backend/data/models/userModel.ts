// src/backend/db/models/patModel.ts
import { db } from '../../db/db.js';
import { User } from '../types.js';

export class UserModel implements User {
  id: string;
  name: string;
  email: string;

  constructor(id: string, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  
  async save(): Promise<void> {
    //const encryptedToken = PatModel.encryptToken(this.patToken);
    db.data!.user = {...this};
    await db.write();
  }

  // Static method to retrieve the PAT
  static async get(): Promise<User> {
    if (!db.data!.user) return {} as User;
    //const decryptedToken = PatModel.decryptToken(db.data!.pat.patToken);
    return db.data!.user;
  }
}
