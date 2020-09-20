const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const passport = require("passport");

const isAuthenticated = require("../middleware/isAuthenticated");

router.get("/welcome-page", authController.welcomePage);

router.get("/google", authController.google);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/welcome-page"
  }),
  authController.googleCallback
);

router.get("/dashboard", isAuthenticated, authController.dashboard);

router.get("/logout", isAuthenticated, authController.logout);

module.exports = router;
