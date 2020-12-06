const mongoose = require("mongoose");
const User = require("./models/User");
const Tour = require("./models/Tour");

async function initConnection() {
  try {
    await mongoose.connect("mongodb://localhost/myDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connected I guess");
    mongoose.connection.on("error", (error) => {
      console.log(error);
    });
  } catch (error) {
    console.log(error);
  }
}

async function createUser(name, email, password) {
  // TODO: Test if user is already exists.
  const newUser = new User({
    name,
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

async function createComment(tour, author, body) {
  let p = await Tour.findById(tour);
  p.comments.push({ body: body, author: author });
  return await p.save();
}

async function getAllTours() {
  return await Tour.find({}).populate([
    { path: "author", select: "name" },
    { path: "comments.author", select: "name" },
    { path: "ratings.author", select: "name" },
    ,
  ]);
}

async function getAllUsers() {
  return await User.find({}, "name");
}

async function getTourById(id) {
  return await Tour.findById(id);
}

async function getUserById(id) {
  return await User.findById(id, "name");
}

async function searchTours(q) {
  let re = new RegExp(".*" + q + ".*", "i");
  return await Tour.find({
    $or: [{ body: re }, { title: re }],
  });
}

async function searchUsers(q) {
  let re = new RegExp(".*" + q + ".*", "i");
  return await User.find({ $or: [{ name: re }, { email: re }] }, "name");
}

async function deleteTourById(id) {
  return await Tour.findByIdAndDelete(id);
}

async function deleteUserById(id) {
  return await User.findByIdAndDelete(id);
}

async function getToursFromUser(id) {
  return await Tour.find({ author: id });
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
