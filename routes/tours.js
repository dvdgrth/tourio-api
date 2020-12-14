const express = require("express");
const DB = require("./../databaseInterface");
const passport = require("./../auth");

const router = express.Router();

// Get tour by id.
router.get("/:id", async (req, res, next) => {
  try {
    const ret = await DB.getTourById(req.params.id);
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

// Get Tours.
router.get("/", async (req, res, next) => {
  try {
    if (req.query.q) {
      res.json(await DB.searchTours(req.query.q));
    } else {
      res.json(await DB.getAllTours());
    }
  } catch (error) {
    next(error);
  }
});

// Create Tour.
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const ret = await DB.createTour(
        req.body.title,
        req.body.author,
        req.body.summary,
        req.body.links
      );
      res.json(ret);
    } catch (error) {
      next(error);
    }
  }
);

// Create comment.
router.post(
  "/comments",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const ret = await DB.createComment(
        req.body.tour,
        req.body.author,
        req.body.body
      );
      res.json(ret);
    } catch (error) {
      next(error);
    }
  }
);

// Delete Tour.
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const ret = await DB.deleteTourById(req.params.id);
      res.json(ret);
    } catch (error) {
      next(error);
    }
  }
);

// Create rating.
router.post(
  "/ratings",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const ret = await DB.createRating(
        req.body.tour,
        req.body.author,
        req.body.rating
      );
      res.json(ret);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
