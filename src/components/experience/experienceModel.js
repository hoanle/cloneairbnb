const mongoose = require("mongoose");
const expSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  location: {
    type: String,
    required: [true, "Country is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  duration: {
    type: Number,
    required: [true, "Duration is required"],
  },
  averageRating: {
    type: Number,
    min: 1,
    max: 5,
  },
  nRating: {
    type: Number,
    default: 0,
  },
  images: {
    type: [
      {
        url: {
          type: String,
        },
        public_id: {
          type: String,
        },
      },
    ],
    default: [],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
  },
  languages: {
    type: [
      {
        type: String,
        enum: ["vi", "en", "ko"],
      },
    ],
    required: [true, "Language is required"],
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Who is the host?"],
  },
  tags: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Tag",
      required: [true, "Include tags please!"],
    },
  ],
});

expSchema.statics.permits = function (params) {
  const permits = [
    "title",
    "location",
    "price",
    "duration",
    "description",
    "languages",
    "userId",
  ];
  let results = {};
  permits
    .map((p) => {
      if (params[p]) results[p] = params[p];
    })
    .filter(Boolean);
  return results;
};

module.exports = mongoose.model("Experience", expSchema);
