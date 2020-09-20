const Story = require("../models/Story");
const User = require("../models/User");
const path = require("path");

const moment = require("moment");

const message = require("../messages/messages");

const storyScreen = (req, res, next) => {
  res.render(path.join(__dirname, "../", "views", "stories", "add"));
};

const postAddStory = (req, res, next) => {
  const title = req.body.title;
  const storyText = req.body.story;
  const allowComments = req.body.allowComments;
  const status = req.body.status;

  let parsedAllowComments;

  if (!allowComments) {
    parsedAllowComments = false;
  } else {
    parsedAllowComments = true;
  }

  const story = new Story({
    title: title,
    story: storyText,
    allowComments: parsedAllowComments,
    status: status,
    userId: req.user.id,
    date: moment()
      .locale("nl")
      .format("LLLL")
  });

  story
    .save()
    .then(story =>
      Story.find({ userId: req.user.id }).then(stories => {
        res.render(path.join(__dirname, "../", "views", "index", "dashboard"), {
          stories: stories,
          msg: true,
          message: message.storySaved
        });
      })
    )
    .catch(err => console.log(err));
};

const showStory = (req, res) => {
  const storyId = req.params.storyId;

  Story.findById(storyId)
    .populate("userId")
    .populate("comments.commentUserId")
    .then(story => {
      res.render(path.join(__dirname, "../", "views", "stories", "show"), {
        story: story,
        storiesUser: story.userId
      });
    });
};

const editStory = (req, res) => {
  const storyId = req.params.storyId;

  Story.findById(storyId).then(story => {
    res.render(path.join(__dirname, "../", "views", "stories", "edit"), {
      story: story
    });
  });
};

const postEditStory = (req, res) => {
  console.log(req.body);
  const storyId = req.params.storyId;
  const title = req.body.title;
  const storyText = req.body.story;
  const allowComments = req.body.allowComments;
  const status = req.body.status;

  let retrievedUser;

  let parsedAllowComments;

  if (!allowComments) {
    parsedAllowComments = false;
  } else {
    parsedAllowComments = true;
  }

  User.findOne({ googleId: req.user.googleId })
    .then(user => {
      retrievedUser = user;
      return Story.findById(storyId);
    })
    .then(story => {
      story.title = title;
      story.story = storyText;
      story.allowComments = parsedAllowComments;
      story.status = status;
      story.date = moment()
        .locale("nl")
        .format("LLLL");
      story.userId = retrievedUser.id;

      return story.save();
    })
    .then(story =>
      Story.find({ userId: req.user.id }).then(stories => {
        res.render(path.join(__dirname, "../", "views", "index", "dashboard"), {
          stories: stories,
          msg: true,
          message: message.storyEdited
        });
      })
    )
    .catch(err => console.log(err));
};

const getPublicStories = (req, res) => {
  Story.find({ status: "Gedeeld" })
    .populate("userId")
    .then(stories => {
      if (stories.length === 0) {
        res.render(path.join(__dirname, "../", "views", "stories", "index"), {
          stories: []
        });
      }
      res.render(path.join(__dirname, "../", "views", "stories", "index"), {
        stories: stories,
        text: message.publicStories
      });
    })
    .catch(err => console.log(err));
};

const getMyStories = (req, res) => {
  Story.find({ status: "Persoonlijk" })
    .populate("userId")
    .then(stories => {
      if (stories.length === 0) {
        res.render(path.join(__dirname, "../", "views", "stories", "index"), {
          stories: []
        });
      }

      res.render(path.join(__dirname, "../", "views", "stories", "index"), {
        stories: stories,
        text: message.personalStories
      });
    })
    .catch(err => console.log(err));
};

const postComment = (req, res) => {
  const storyId = req.params.storyId;
  const userId = req.params.userId;

  const commentText = req.body.commentText;

  Story.findById(storyId)
    .then(story => {
      story.comments.unshift({
        commentText: commentText,
        commentDate: moment()
          .locale("nl")
          .format("LLLL"),
        commentUserId: userId
      });

      return story.save();
    })
    .then(story => res.redirect(`/stories/show-story/${storyId}`))
    .catch(err => console.log(err));
};

const deleteStory = (req, res) => {
  const storyId = req.params.storyId;

  Story.findByIdAndRemove(storyId).then(story => {
    Story.find({ userId: req.user.id }).then(stories => {
      res.render(path.join(__dirname, "../", "views", "index", "dashboard"), {
        stories: stories,
        msg: true,
        message: message.deletePost
      });
    });
  });
};

const cancel = (req, res) => {
  Story.find({ userId: req.user.id }).then(stories => {
    res.render(path.join(__dirname, "../", "views", "index", "dashboard"), {
      stories: stories,
      postDeleted: false
    });
  });
};

const getUserPublicStories = (req, res) => {
  const userId = req.params.userId;

  Story.find({ userId: userId })
    .populate("userId")
    .then(stories => {
      res.render(path.join(__dirname, "../", "views", "stories", "index"), {
        stories: stories,
        storiesUser: stories[0].userId,
        text: `Verhalen van ${stories[0].userId.firstName} ${stories[0].userId.lastName}`
      });
    })
    .catch(err => console.log(err));
};

module.exports = {
  storyScreen,
  postAddStory,
  showStory,
  editStory,
  postEditStory,
  getPublicStories,
  getMyStories,
  postComment,
  deleteStory,
  cancel,
  getUserPublicStories
};
