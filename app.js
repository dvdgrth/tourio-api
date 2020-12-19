require("dotenv").config();

const express = require("express");
const DB = require("./databaseInterface");
const userRouter = require("./routes/users");
const tourRouter = require("./routes/tours");
const authRouter = require("./routes/auth");
const cors = require("cors");
const passport = require("./auth");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 4000;

const app = express();

app.set("view engine", "pug");

DB.initConnection();

let simpleLogger = (req, res, next) => {
  console.log(`${new Date().toLocaleString()}\t\t${req.method}\t\t${req.url}`);
  next();
};

app.use(simpleLogger);
app.use(express.static("public"));
app.use(express.json());

app.use(cors({ origin: `http://0.0.0.0:${PORT}`, credentials: true }));

app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/users", userRouter);
app.use("/tours", tourRouter);
app.use((err, req, res, next) => {
  console.error(`ERROR - ${new Date().toLocaleString()} - ${err.toString()}.`);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).json({ error: err.toString() });
});

app.listen(PORT, () =>
  console.log(`Server listening at http://0.0.0.0:${PORT}`)
);
