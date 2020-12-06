const express = require("express");
const DB = require("./../databaseInterface");
const passport = require("./../auth");

const router = express.Router();

// Get user by id.
router.get("/:id", async (req, res, next) => {
  try {
    const ret = await DB.getUserById(req.params.id);
    if (ret != null) {
      res.json(ret);
    } else {
      let error = new Error(`Id not found. (id = ${req.params.id})`);
      error.statusCode = 404;
      next(error);
    }
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});

// Get Users.
router.get("/", async (req, res, next) => {
  try {
    if (req.query.q) {
      res.json(await DB.searchUsers(req.query.q));
    } else {
      res.json(await DB.getAllUsers());
    }
  } catch (error) {
    next(error);
  }
});

// Create User.
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const ret = await DB.createUser(
        req.body.name,
        req.body.email,
        req.body.password
      );
      res.json(ret);
    } catch (error) {
      next(error);
    }
  }
);

// Delete User.
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const ret = await DB.deleteUserById(req.params.id.trim());
      res.json(ret);
    } catch (error) {
      next(error);
    }
  }
);

// Get Post from User.
router.get("/:id/posts", async (req, res, next) => {
  try {
    res.json(await DB.getPostsFromUser(req.params.id));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
