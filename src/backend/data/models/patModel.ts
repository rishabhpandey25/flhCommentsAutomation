// src/backend/db/models/patModel.ts
import { db } from '../../db/db.js';
import { Pat } from '../types.js';
import crypto from 'crypto';

export class PatModel implements Pat {
  patToken: string;
  expired: boolean;

  constructor(patToken: string, expired: boolean) {
    this.patToken = patToken;
    this.expired = expired;
  }

  // Encrypt the PAT token using AES-256
  static encryptToken(token: string): string {
    const cipher = crypto.createCipheriv('aes-256-cbc', process.env.ENCRYPTION_KEY!, process.env.ENCRYPTION_IV!);
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  // Decrypt the PAT token
  static decryptToken(encryptedToken: string): string {
    const decipher = crypto.createDecipheriv('aes-256-cbc', process.env.ENCRYPTION_KEY!, process.env.ENCRYPTION_IV!);
    let decrypted = decipher.update(encryptedToken, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  // Save or update the PAT
  async save(): Promise<void> {
    //const encryptedToken = PatModel.encryptToken(this.patToken);
    db.data!.pat = { patToken: this.patToken, expired: this.expired };
    await db.write();
  }

  // Static method to retrieve the PAT
  static async get(): Promise<Pat> {
    if (!db.data!.pat) return { patToken: '', expired: true } as Pat;
    //const decryptedToken = PatModel.decryptToken(db.data!.pat.patToken);
    return db.data!.pat;
  }
}
