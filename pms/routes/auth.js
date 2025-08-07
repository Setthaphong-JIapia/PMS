const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isNotAuthenticated } = require('../middleware/auth');

// Login Page
router.get('/login', isNotAuthenticated, (req, res) => {
  res.render('auth/login', { 
    title: 'Login',
    error: req.query.error
  });
});

// Register Page
router.get('/register', isNotAuthenticated, (req, res) => {
  res.render('auth/register', { 
    title: 'Register',
    error: req.query.error
  });
});

// Login Process
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.authenticate(username, password);
    
    if (!user) {
      return res.redirect('/auth/login?error=Invalid username or password');
    }
    
    // Set session
    req.session.userId = user.id;
    req.session.username = user.username;
    
    res.redirect('/projects');
  } catch (error) {
    console.error('Login error:', error);
    res.redirect('/auth/login?error=An error occurred. Please try again.');
  }
});

// Register Process
router.post('/register', async (req, res) => {
  const { username, email, password, password2 } = req.body;
  
  // Validation
  if (!username || !email || !password || !password2) {
    return res.redirect('/auth/register?error=Please fill in all fields');
  }
  
  if (password !== password2) {
    return res.redirect('/auth/register?error=Passwords do not match');
  }
  
  if (password.length < 6) {
    return res.redirect('/auth/register?error=Password must be at least 6 characters');
  }
  
  try {
    // Check if user already exists
    const existingUser = await User.findByUsername(username);
    
    if (existingUser) {
      return res.redirect('/auth/register?error=Username already exists');
    }
    
    // Create user
    const userId = await User.create({
      username,
      email,
      password
    });
    
    // Set session
    req.session.userId = userId;
    req.session.username = username;
    
    res.redirect('/projects');
  } catch (error) {
    console.error('Registration error:', error);
    res.redirect('/auth/register?error=An error occurred. Please try again.');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/auth/login');
  });
});

module.exports = router; 