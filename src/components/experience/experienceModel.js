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
    unique: true,
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
    min: 0,
    max: 5,
    default: 0
  },
  nRating: {
    type: Number,
    default: 0
  },
  images: {
    type: Array,
  },
  description: {
    type: String,
  },
  languages: {
    type: Array,
    required: [true, "Language is required"],
    trim: true
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
