const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

// User model
const User = require("../models/User");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async function (email, password, done) {
        try {
          const user = await User.findOne({ email });
          if (!user) done(null, false);
          else
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err;
              else if (isMatch) return done(null, user);
              else return done(null, false);
            });
        } catch (error) {
          console.log(error);
        }
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
