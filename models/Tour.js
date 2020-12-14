const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    summary: { type: String, required: true },
    links: [
      {
        link: { type: String, required: true },
        description: { type: String, required: true },
        // created: { type: Date, default: Date.now },
        // lastUpdated: { type: Date, default: Date.now },
      },
      { timestamps: true },
    ],
    comments: [
      {
        body: { type: String, required: true },
        // date: { type: Date, default: Date.now },
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
      { timestamps: true },
    ],
    ratings: {
      type: [
        {
          value: { type: Number, required: true },
          // date: { type: Date, default: Date.now },
          author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
        },
        { timestamps: true },
      ],
      // get: calculateRating,
    },
    // created: { type: Date, default: Date.now },
    // lastUpdated: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// // getter for ratings
// function calculateRating(ratings) {
//   console.log(ratings);
//   // if (ratings.length === 0) {
//   //   return 0;
//   // }
//   // let sum = ratings.reduce(function (acc, r) {
//   //   return acc + r.value;
//   // }, 0);
//   // return sum / ratings.length;
//   return "test";
// }

tourSchema.post("save", function (doc) {
  console.log(`Tour ${doc._id} has been saved.`);
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
