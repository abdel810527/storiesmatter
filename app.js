const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const helmet = require("helmet")

const passport = require("passport");
const passportGoogleOauthSerialize = require("./passport/passportGoogleOauthSerialize");

const mongoose = require("mongoose");
const mongoDB =
  `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0-7jozn.mongodb.net/verteljeverhaal?w=majority`;

const session = require("express-session");

const csrf = require("csurf");

const authRouter = require("./routes/authRouter");
const storiesRouter = require("./routes/storiesRouter");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passportGoogleOauthSerialize(passport);

app.use(csrf());

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/auth", authRouter);
app.use("/stories", storiesRouter);

app.use(helmet())

mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(r => app.listen(process.env.PORT || 3000));
