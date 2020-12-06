const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  revoked: { type: Boolean, default: false },
});

userSchema.post("save", () =>
  console.log(`A new user was saved. (${this.username})`)
);

userSchema.methods.validPassword = function (password) {
  return password === this.password;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
