import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ReposPage from './pages/ReposPage';
import PRsPage from './pages/PRsPage';
import CommentsPage from './pages/CommentsPage';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Home Page - Displays list of organizations */}
        <Route path="/" element={<HomePage />} />
        
        {/* Projects Page - Displays list of projects for a selected organization */}
        <Route path="/orgs/:orgId/projects" element={<ProjectsPage />} />
        
        {/* Repos Page - Displays list of repos for a selected project */}
        <Route path="/orgs/:orgId/projects/:projectId/repos" element={<ReposPage />} />
        
        {/* PRs Page - Displays list of PRs for a selected repo */}
        <Route path="/orgs/:orgId/projects/:projectId/repos/:repoId/prs" element={<PRsPage />} />
        
        {/* Comments Page - Displays list of comments for a selected PR */}
        <Route path="/orgs/:orgId/projects/:projectId/repos/:repoId/prs/:prId/comments" element={<CommentsPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
