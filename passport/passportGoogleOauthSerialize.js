const User = require("../models/User");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

module.exports = passport => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
      },
      (accessToken, refreshToken, profile, done) => {
        User.findOne({ googleID: profile.id }).then(user => {
          if (user) {
            done(null, user);
          } else {
            const user = new User();
            user.googleID = profile.id;
            user.email = profile.emails[0].value;
            user.firstName = profile.name.givenName;
            user.lastName = profile.name.familyName;
            user.image = profile.photos[0].value;
            user.save().then(user => done(null, user));
          }
        });
      }
    )
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findOne({ _id: id }).then(user => {
      done(null, user);
    });
  });
};
