const express = require("express");
const DB = require("./../databaseInterface");
const passport = require("./../auth");
const User = require("./../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = express.Router();

const sendNewToken = function (req, res, next) {
  const token = jwt.sign(
    { sub: req.user._id, name: req.user.username },
    process.env.JWT_SECRET,
    { expiresIn: 60 }
  );
  // res.send(token);
  res.json({ token: token });
};

const setRefreshToken = function (req, res, next) {
  const refreshToken = jwt.sign(
    { sub: req.user._id, name: req.user.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "30d" }
  );
  req.user.refreshToken = res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/refresh",
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  });
  next();
};

router.post("/signup", async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    // const hash = bcrypt.hashSync(req.body.password, 10);
    const ret = await DB.createUser(req.body.username, req.body.email, hash);
    console.log(ret);
    res.json(ret);
  } catch (error) {
    next(error);
  }

  // const hash = bcrypt.hashSync(req.body.password, 10);

  // const newUser = await new User({
  //   username: req.body.username,
  //   password: hash,
  //   email: req.body.email,
  // }).save();

  // res.json(newUser);
});

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  setRefreshToken,
  sendNewToken
);

router.post(
  "/refresh",
  passport.authenticate("refreshTokenStrategy", { session: false }),
  sendNewToken
);

// router.get(
//   "/dashboard",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     res.send(`${req.user.username}, you made it to dashboard!`);
//   }
// );

module.exports = router;
