const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  revoked: { type: Boolean, default: false },
});

userSchema.post("save", function () {
  console.log(`A new user was saved. (${this.username}, ${this.email})`);
});

userSchema.methods.validPassword = async function (password) {
  // console.log("INside psw");
  // console.log(password);
  // console.log(this.password);
  const match = await bcrypt.compare(password, this.password);
  // if(match) {
  //     //login
  // }
  console.log("match= ", match);
  return match;
  // return password === this.password;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
