const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');
const Project = require('../models/Project');
const { isAuthenticated } = require('../middleware/auth');

// Apply authentication middleware to all task routes
router.use(isAuthenticated);

// Tasks List
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.getAll();
    res.render('tasks/index', { 
      title: 'Tasks',
      tasks,
      currentUser: req.session.userId,
      username: req.session.username,
      success: req.query.success,
      error: req.query.error
    });
  } catch (error) {
    console.error('Error getting tasks:', error);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Error getting tasks',
      error 
    });
  }
});

// Search Tasks
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    const tasks = await Task.search(query);
    res.render('tasks/index', { 
      title: 'Search Results',
      tasks,
      searchQuery: query,
      currentUser: req.session.userId,
      username: req.session.username
    });
  } catch (error) {
    console.error('Error searching tasks:', error);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Error searching tasks',
      error 
    });
  }
});

// New Task Form
router.get('/new', async (req, res) => {
  try {
    const projects = await Project.getAll();
    const users = await User.getAll();
    
    // Default project ID can be passed in query string
    const projectId = req.query.project_id || '';
    
    res.render('tasks/new', { 
      title: 'New Task',
      projects,
      users,
      projectId,
      currentUser: req.session.userId,
      username: req.session.username,
      error: req.query.error
    });
  } catch (error) {
    console.error('Error rendering new task form:', error);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Error rendering new task form',
      error 
    });
  }
});

// Create Task
router.post('/', async (req, res) => {
  try {
    const { title, description, project_id, assigned_to, due_date, priority, status } = req.body;
    
    // Validation
    if (!title || !project_id) {
      return res.redirect('/tasks/new?error=Title and project are required&project_id=' + project_id);
    }
    
    await Task.create({
      title,
      description,
      project_id,
      assigned_to: assigned_to || null,
      due_date: due_date || null,
      priority: priority || 'Medium',
      status: status || 'To Do'
    });
    
    // Redirect back to the project if we came from there
    if (project_id) {
      res.redirect(`/projects/${project_id}?success=Task created successfully`);
    } else {
      res.redirect('/tasks?success=Task created successfully');
    }
  } catch (error) {
    console.error('Error creating task:', error);
    res.redirect('/tasks/new?error=Error creating task');
  }
});

// View Task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.getById(req.params.id);
    
    if (!task) {
      return res.status(404).render('error', { 
        title: 'Error',
        message: 'Task not found' 
      });
    }
    
    res.render('tasks/view', { 
      title: task.title,
      task,
      currentUser: req.session.userId,
      username: req.session.username,
      success: req.query.success,
      error: req.query.error
    });
  } catch (error) {
    console.error('Error viewing task:', error);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Error viewing task',
      error 
    });
  }
});

// Edit Task Form
router.get('/:id/edit', async (req, res) => {
  try {
    const task = await Task.getById(req.params.id);
    
    if (!task) {
      return res.status(404).render('error', { 
        title: 'Error',
        message: 'Task not found' 
      });
    }
    
    const projects = await Project.getAll();
    const users = await User.getAll();
    
    res.render('tasks/edit', { 
      title: 'Edit Task',
      task,
      projects,
      users,
      currentUser: req.session.userId,
      username: req.session.username,
      error: req.query.error
    });
  } catch (error) {
    console.error('Error rendering edit task form:', error);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Error rendering edit task form',
      error 
    });
  }
});

// Update Task
router.post('/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description, project_id, assigned_to, due_date, priority, status } = req.body;
    
    // Validation
    if (!title || !project_id) {
      return res.redirect(`/tasks/${taskId}/edit?error=Title and project are required`);
    }
    
    const success = await Task.update(taskId, {
      title,
      description,
      project_id,
      assigned_to: assigned_to || null,
      due_date: due_date || null,
      priority: priority || 'Medium',
      status: status || 'To Do'
    });
    
    if (!success) {
      return res.redirect(`/tasks/${taskId}/edit?error=Task not found`);
    }
    
    // Redirect back to the project page if desired
    if (req.query.from_project) {
      res.redirect(`/projects/${project_id}?success=Task updated successfully`);
    } else {
      res.redirect(`/tasks/${taskId}?success=Task updated successfully`);
    }
  } catch (error) {
    console.error('Error updating task:', error);
    res.redirect(`/tasks/${req.params.id}/edit?error=Error updating task`);
  }
});

// Delete Task
router.post('/:id/delete', async (req, res) => {
  try {
    const task = await Task.getById(req.params.id);
    
    if (!task) {
      return res.redirect('/tasks?error=Task not found');
    }
    
    const success = await Task.delete(req.params.id);
    
    if (!success) {
      return res.redirect('/tasks?error=Task not found');
    }
    
    // Redirect back to the project page if specified
    if (req.query.from_project) {
      res.redirect(`/projects/${task.project_id}?success=Task deleted successfully`);
    } else {
      res.redirect('/tasks?success=Task deleted successfully');
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.redirect('/tasks?error=Error deleting task');
  }
});

module.exports = router; 