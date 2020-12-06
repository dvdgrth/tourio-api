const express = require("express");
const DB = require("./../databaseInterface");
const passport = require("./../auth");
const User = require("./../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

const sendNewToken = function (req, res, next) {
  const token = jwt.sign(
    { sub: req.user._id, name: req.user.username },
    process.env.JWT_SECRET,
    { expiresIn: 120 }
  );
  res.send(token);
};

const setRefreshToken = function (req, res, next) {
  const refreshToken = jwt.sign(
    { sub: req.user._id, name: req.user.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "100d" }
  );
  req.user.refreshToken = res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    path: "/refresh",
  });
  next();
};

router.post("/signup", (req, res) => {
  new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  }).save();
  res.json(req.body);
});

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  setRefreshToken,
  sendNewToken
);

router.get(
  "/refresh",
  passport.authenticate("refreshTokenStrategy", { session: false }),
  sendNewToken
);

router.get(
  "/dashboard",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send(`${req.user.username}, you made it to dashboard!`);
  }
);

module.exports = router;
