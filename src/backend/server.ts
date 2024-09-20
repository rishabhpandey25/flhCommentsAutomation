import express from 'express';
import path from 'path';
import { initDB } from './db/db.js';
import orgRoutes from './api/orgRoutes.js';
import patRoutes from './api/patRoutes.js';
import projectRoutes from './api/projectRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// API routes
app.use('/api/orgs', orgRoutes);
app.use('/api/pat', patRoutes);
app.use('/api/projects', projectRoutes);

// Serve static files from React app
// app.use(express.static(path.join(__dirname, '../../frontend/build')));

// // Serve React index.html for any route that is not an API call
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
// });

// Initialize Database and Start Server
initDB()
  .then(() => {
    console.log('Database initialized successfully.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize the database:', err);
  });
