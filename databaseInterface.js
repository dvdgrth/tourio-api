const mongoose = require("mongoose");
const User = require("./models/User");
const Tour = require("./models/Tour");
const { use } = require("./routes/auth");
const { findByIdAndUpdate } = require("./models/User");

async function initConnection() {
  try {
    // await mongoose.connect("mongodb://localhost/myDB", {
    await mongoose.connect(
      process.env.PORT ? process.env.DB_ADDRESS : "mongodb://localhost/myDB",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }
    );
    console.log("connected I guess");
    mongoose.connection.on("error", (error) => {
      console.log(error);
    });
  } catch (error) {
    console.log(error);
  }
}

async function createUser(username, email, password) {
  if (await User.findOne({ username: username })) {
    // return { error: "username already exists." };
    throw new Error("username already exists.");
  }
  if (await User.findOne({ email: email })) {
    throw new Error("email is already registered.");
    // return { error: "email is already registered." };
  }
  const newUser = new User({
    username,
    email,
    password,
  });
  return await newUser.save();
}

async function createTour(title, author, summary, links) {
  const newTour = new Tour({
    title,
    author,
    summary,
    links,
  });
  return await newTour.save();
}

async function updateTour(id, title, author, summary, links) {
  let p = await Tour.findById(id);
  if (p.author.toString() === author.toString()) {
    p.title = title;
    p.summary = summary;
    p.links = links;
    return await p.save();
  } else {
    throw new Error(
      "change requester is not the original author: " +
        p.author.toString() +
        " vs " +
        author.toString() +
        " " +
        typeof p.author.toString() +
        " " +
        typeof author.toString()
    );
  }
}

async function createComment(tour, author, body) {
  let p = await Tour.findById(tour);
  p.comments.push({ body: body, author: author });
  return await p.save();
}

async function getAllTours() {
  return await Tour.find({})
    .populate([
      { path: "author", select: "username" },
      { path: "comments.author", select: "username" },
      { path: "ratings.author", select: "username" },
    ])
    .sort({ updatedAt: "desc" });
}

async function getAllUsers() {
  return await User.find({}, "name");
}

async function getTourById(id) {
  return await Tour.findById(id).populate([
    { path: "author", select: "username" },
    { path: "comments.author", select: "username" },
    { path: "ratings.author", select: "username" },
  ]);
}

async function getUserById(id) {
  return await User.findById(id, "username").lean();
}

async function searchTours(q) {
  let re = new RegExp(".*" + q + ".*", "i");
  return await Tour.find({
    $or: [
      { summary: re },
      { title: re },
      { "links.description": re },
      { "links.link": re },
    ],
    // $or: [{ summary: re }, { title: re }, { links: re }],
  })
    .populate([{ path: "author", select: "username" }])
    .sort({ updatedAt: "desc" });
}

async function searchUsers(q) {
  let re = new RegExp(".*" + q + ".*", "i");
  return await User.find({ $or: [{ name: re }, { email: re }] }, "name");
}

async function deleteTourById(id, author) {
  let p = await Tour.findById(id);
  if (p.author.toString() === author.toString()) {
    return await p.deleteOne();
  } else {
    throw new Error(
      "delete requester is not the original author: " +
        p.author.toString() +
        " vs " +
        author.toString() +
        " " +
        typeof p.author.toString() +
        " " +
        typeof author.toString()
    );
  }

  return await Tour.findByIdAndDelete(id);
}

async function deleteUserById(id) {
  return await User.findByIdAndDelete(id);
}

async function getToursFromUser(id) {
  return await Tour.find({ author: id })
    .populate([
      { path: "author", select: "username" },
      { path: "comments.author", select: "username" },
      { path: "ratings.author", select: "username" },
    ])
    .lean();
}

async function createRating(tour, author, rating) {
  // remove old rating from this author
  let p = await Tour.findByIdAndUpdate(
    tour,
    { $pull: { ratings: { author: author } } },
    { safe: true }
    // function removeRating(err, obj) {
    //   console.log(err);
    //   console.log(obj);
    // }
  );
  // add new rating
  p.ratings.push({ value: rating, author: author });

  return await p.save();
}

exports.initConnection = initConnection;
exports.createUser = createUser;
exports.createTour = createTour;
exports.createComment = createComment;
exports.getAllTours = getAllTours;
exports.getAllUsers = getAllUsers;
exports.getTourById = getTourById;
exports.getUserById = getUserById;
exports.searchTours = searchTours;
exports.searchUsers = searchUsers;
exports.deleteTourById = deleteTourById;
exports.deleteUserById = deleteUserById;
exports.getToursFromUser = getToursFromUser;
exports.createRating = createRating;
exports.updateTour = updateTour;
