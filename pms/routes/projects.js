const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const { isAuthenticated } = require('../middleware/auth');

// Apply authentication middleware to all project routes
router.use(isAuthenticated);

// Projects List
router.get('/', async (req, res) => {
  try {
    const projects = await Project.getAll();
    res.render('projects/index', { 
      title: 'Projects',
      projects,
      currentUser: req.session.userId,
      username: req.session.username,
      success: req.query.success,
      error: req.query.error
    });
  } catch (error) {
    console.error('Error getting projects:', error);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Error getting projects',
      error 
    });
  }
});

// Search Projects
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    const projects = await Project.search(query);
    res.render('projects/index', { 
      title: 'Search Results',
      projects,
      searchQuery: query,
      currentUser: req.session.userId,
      username: req.session.username
    });
  } catch (error) {
    console.error('Error searching projects:', error);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Error searching projects',
      error 
    });
  }
});

// New Project Form
router.get('/new', async (req, res) => {
  try {
    res.render('projects/new', { 
      title: 'New Project',
      currentUser: req.session.userId,
      username: req.session.username,
      error: req.query.error
    });
  } catch (error) {
    console.error('Error rendering new project form:', error);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Error rendering new project form',
      error 
    });
  }
});

// Create Project
router.post('/', async (req, res) => {
  try {
    const { name, description, start_date, end_date, status } = req.body;
    
    // Validation
    if (!name) {
      return res.redirect('/projects/new?error=Project name is required');
    }
    
    await Project.create({
      name,
      description,
      start_date: start_date || null,
      end_date: end_date || null,
      status: status || 'Not Started',
      created_by: req.session.userId
    });
    
    res.redirect('/projects?success=Project created successfully');
  } catch (error) {
    console.error('Error creating project:', error);
    res.redirect('/projects/new?error=Error creating project');
  }
});

// View Project
router.get('/:id', async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.getById(projectId);
    
    if (!project) {
      return res.status(404).render('error', { 
        title: 'Error',
        message: 'Project not found' 
      });
    }
    
    const tasks = await Task.getByProjectId(projectId);
    const users = await User.getAll();
    
    res.render('projects/view', { 
      title: project.name,
      project,
      tasks,
      users,
      currentUser: req.session.userId,
      username: req.session.username,
      success: req.query.success,
      error: req.query.error
    });
  } catch (error) {
    console.error('Error viewing project:', error);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Error viewing project',
      error 
    });
  }
});

// Edit Project Form
router.get('/:id/edit', async (req, res) => {
  try {
    const project = await Project.getById(req.params.id);
    
    if (!project) {
      return res.status(404).render('error', { 
        title: 'Error',
        message: 'Project not found' 
      });
    }
    
    res.render('projects/edit', { 
      title: 'Edit Project',
      project,
      currentUser: req.session.userId,
      username: req.session.username,
      error: req.query.error
    });
  } catch (error) {
    console.error('Error rendering edit project form:', error);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Error rendering edit project form',
      error 
    });
  }
});

// Update Project
router.post('/:id', async (req, res) => {
  try {
    const projectId = req.params.id;
    const { name, description, start_date, end_date, status } = req.body;
    
    // Validation
    if (!name) {
      return res.redirect(`/projects/${projectId}/edit?error=Project name is required`);
    }
    
    const success = await Project.update(projectId, {
      name,
      description,
      start_date: start_date || null,
      end_date: end_date || null,
      status: status || 'Not Started'
    });
    
    if (!success) {
      return res.redirect(`/projects/${projectId}/edit?error=Project not found`);
    }
    
    res.redirect(`/projects/${projectId}?success=Project updated successfully`);
  } catch (error) {
    console.error('Error updating project:', error);
    res.redirect(`/projects/${req.params.id}/edit?error=Error updating project`);
  }
});

// Delete Project
router.post('/:id/delete', async (req, res) => {
  try {
    const success = await Project.delete(req.params.id);
    
    if (!success) {
      return res.redirect('/projects?error=Project not found');
    }
    
    res.redirect('/projects?success=Project deleted successfully');
  } catch (error) {
    console.error('Error deleting project:', error);
    res.redirect('/projects?error=Error deleting project');
  }
});

module.exports = router; 