const isAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/auth/welcome-page");
  }
};

module.exports = isAuthenticated;
