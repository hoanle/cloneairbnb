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
    type: Array,
    required: [true, "Language is required"],
    trim: true,
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

module.exports = mongoose.model("Experience", expSchema);
