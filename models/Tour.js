const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  summary: { type: String, required: true },
  links: [
    {
      link: { type: String, required: true },
      description: { type: String, required: true },
      created: { type: Date, default: Date.now },
      lastUpdated: { type: Date, default: Date.now },
    },
  ],
  comments: [
    {
      body: { type: String, required: true },
      date: { type: Date, default: Date.now },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
  ],
  ratings: [
    {
      value: { type: Number, required: true },
      date: { type: Date, default: Date.now },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
  ],
  created: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
});

tourSchema.post("save", function (doc) {
  console.log(`Tour ${doc._id} has been saved.`);
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
