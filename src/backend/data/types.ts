// src/backend/data/types.ts

export type Org = {
    id: string;
    name: string;
    needed: boolean;
  };
  
  export type Pat = {
    patToken: string;
    expired: boolean;
  };
  
  export type Project = {
    id: string;
    name: string;
    orgName: string;  // Add orgName to associate project with organization
  };

  export type User = {
    id: string;
    name: string;
    email: string;  // Add orgName to associate project with organization
  };
  
  export type Database = {
    orgs: Record<string, Org>;
    pat: Pat | null;
    projects: Project[];
    user: User | null
  };
  