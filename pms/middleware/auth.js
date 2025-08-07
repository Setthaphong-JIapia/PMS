// Check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/auth/login');
};

// Check if user is NOT authenticated (for login/register pages)
const isNotAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return next();
  }
  res.redirect('/projects');
};

module.exports = {
  isAuthenticated,
  isNotAuthenticated
}; 