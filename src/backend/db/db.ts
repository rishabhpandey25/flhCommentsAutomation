import { JSONFile, Low } from 'lowdb';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Database, Org } from '../data/types';
import * as fs from 'fs';

// File path for storing the database and the orgs list
const dbFile = join(process.cwd(),'src', 'backend', 'db', 'documents', 'database.json');
const orgsListFile = join(process.cwd(),'src', 'backend', 'db', 'documents', 'orgList.json');

// Load the list of organization names from the JSON file
const loadOrgsList = (): string[] => {
  if (fs.existsSync(orgsListFile)) {
    const data = fs.readFileSync(orgsListFile, 'utf8');
    return JSON.parse(data) as string[];
  }
  return [];
};

// Generate default data including orgs with UUIDs
const generateDefaultData = (): Database => {
  const orgNames = loadOrgsList();

  const orgs: Record<string, Org> = {};
  console.log(orgNames);
  orgNames.forEach(name => {
    const id = uuidv4();
    orgs[id] = {
      id,
      name,
      needed: false, // Set default value or adjust as needed
    };
  });
  console.log(orgs);

  return {
    orgs,
    pat: null,
    projects: [],
    user: null
  };
};

// Initialize the database with default values
const defaultData = generateDefaultData();
const adaptor =  new JSONFile<Database>(dbFile);
const db = new Low<Database>(adaptor)

// Default values for the database
async function initDB() {
  await db.read();
  console.log(db.data);
  console.log(defaultData);
  if(Object.keys(db.data!.orgs).length == 0){
    db.data = defaultData;
  }
  await db.write();
}

export { db, initDB };