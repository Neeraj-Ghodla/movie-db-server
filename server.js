const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");

// INIT APP
const app = express();

// INTI DB
mongoose
  .connect(require("./config/keys").MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

// PASSPORT MIDDLEWARE
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// APP CONFIG
app.use(
  cookieSession({
    name: "session",
    keys: ["cats"],
    maxAge: 24 * 60 * 60 * 1000, // session will expire after 24 hours
  })
);
app.use(cookieParser());
app.use(
  cors({
    origin: false,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(session({ secret: "cats", resave: true, saveUninitialized: true }));
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

// ROUTES
app.use("/users", require("./routes/users.js"));
app.use("/", require("./routes/index.js"));

// PORT
const PORT = process.env.PORT || 3000;

// START SERVER
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
