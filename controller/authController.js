const path = require("path");
const passport = require("passport");
const Story = require("../models/Story");

/// LATER WITH HEROKU SET PROXY:TRUE IN NEW GOOGLESTRATEGY ///

const welcomePage = (req, res, next) => {
  res.render(path.join(__dirname, "../", "views", "index", "welcome"), {
    user: req.user
  });
};

const google = passport.authenticate("google", {
  scope: ["profile", "email"]
});

const googleCallback = (req, res) => res.redirect("/auth/dashboard");

const dashboard = (req, res, next) => {
  Story.find({ userId: req.user.id }).then(stories => {
    res.render(path.join(__dirname, "../", "views", "index", "dashboard"), {
      stories: stories,
      msg: false
    });
  });
};

const logout = (req, res) => {
  req.logout();
  res.redirect(
    "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=https://storiesmatter.herokuapp.com/auth/welcome-page"
  );
};

module.exports = {
  welcomePage,
  google,
  googleCallback,
  dashboard,
  logout
};
