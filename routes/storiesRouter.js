const express = require("express");
const router = express.Router();
const storiesController = require("../controller/storiesController");

const isAuthenticated = require("../middleware/isAuthenticated");

router.get("/add-story-screen", isAuthenticated, storiesController.storyScreen);

router.post("/post-add-story", isAuthenticated, storiesController.postAddStory);

router.get("/show-story/:storyId", storiesController.showStory);

router.get(
  "/edit-story-screen/:storyId",
  isAuthenticated,
  storiesController.editStory
);

router.post(
  "/post-edit-story/:storyId",
  isAuthenticated,
  storiesController.postEditStory
);

router.get("/public/", storiesController.getPublicStories);

router.get("/public/user/:userId", storiesController.getUserPublicStories);

router.get("/my-stories", isAuthenticated, storiesController.getMyStories);

router.post(
  "/post-comment/:storyId&:userId",
  isAuthenticated,
  storiesController.postComment
);

router.post(
  "/delete-story/:storyId",
  isAuthenticated,
  storiesController.deleteStory
);

router.get("/cancel", storiesController.cancel);

module.exports = router;
