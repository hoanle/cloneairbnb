const mongoose = require("mongoose");
const expSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  country: {
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
  rating: {
    type: Number,
    required: [true, "Review needs a rating"],
    min: 1,
    max: 5,
  },
  imagePath: {
    type: String,
  },
  description: {
      type: String
  },
  host: {
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

