const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

const HOME = "http://localhost:3001";

// User model
const User = require("../models/User");
const e = require("express");

// Login Handle
router.post("/login", passport.authenticate("local"), (req, res) =>
  res.send(req.user)
);

// Register Handle
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  let user = await User.findOne({ email });

  if (user) res.send("Email already registered");
  else {
    user = new User({ email, password });

    // hash the password
    try {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(user.password, salt);
      user.password = hash;
    } catch (error) {
      console.log(error);
    }

    // save the user
    try {
      const item = await user.save();
      res.send(item);
    } catch (error) {
      res.send(error);
    }
  }
});

module.exports = router;
