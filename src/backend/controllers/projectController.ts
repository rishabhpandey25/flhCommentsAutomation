// src/backend/api/projects.ts
import { Request, response, Response } from 'express';
import axios from 'axios';
import { PatModel } from '../data/models/patModel.js';
import { ProjectModel } from '../data/models/projectModel.js';
import { Project , Pat, User} from '../data/types.js';
import { UserModel } from '../data/models/userModel.js';


const ADO_PROJECTS_URL = 'https://dev.azure.com/{organization}/_apis/projects?api-version=6.0';
const ADO_PR_URL = 'https://dev.azure.com/{organization}/{project}/_apis/git/pullrequests?api-version=6.0&searchCriteria.status=active&searchCriteria.creatorId={userid}';

// Get all projects for a particular organization where the user has an active PR
export const getProjects = async (req: Request, res: Response) => {
  try {
    const { orgName } = req.body as { orgName: string };
    console.log(req.body);
    // Fetch PAT from the database
    const pat : Pat = await PatModel.get();
    if (pat.expired) {
      return res.json({ error: true, errorMsg: 'PAT not found' });
    }
    //console.log(pat);
    const username = ''; // Leave blank for PAT
    const auth = Buffer.from(`${username}:${pat.patToken}`).toString('base64');
    //console.log(auth);

    // Fetch projects from Azure DevOps
    const projectsResponse = await axios.get(ADO_PROJECTS_URL.replace('{organization}', orgName), {
      headers: { Authorization: `Basic ${auth}` },
    });

//    console.log(projectsResponse);

    const projects = projectsResponse.data.value;

    const projectsWithActivePRs: Project[] = [];
    const user: User = await UserModel.get();

    for (const project of projects) {
      // Fetch active pull requests for each project
      const prsResponse = await axios.get(ADO_PR_URL.replace('{organization}', orgName).replace('{project}', project.name).replace('{userid}',user.id), {
        headers: { Authorization: `Basic ${auth}` },
      });

      console.log(prsResponse.data.value);
      const prs = prsResponse.data.value;

      if (prs.length > 0) {
        projectsWithActivePRs.push({
          id: project.id,
          name: project.name,
          orgName: orgName,
        });
      }
    }

    // Save projects with active PRs to the database
    await Promise.all(projectsWithActivePRs.map(projectData => {
      const projectModel = new ProjectModel(projectData.id, projectData.name, projectData.orgName);
      return projectModel.save();
    }));

    const ProjectForOrg : Project[] = await ProjectModel.getByOrgName(orgName);
    res.json(ProjectForOrg);
  } catch (error) {
    console.log(error);
    res.json({ error: true, errorMsg: 'Failed to fetch projects' });
  }
};
