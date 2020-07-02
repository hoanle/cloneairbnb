const mongoose = require("mongoose");

const schema = mongoose.Schema({
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
  imageURL: {
    type: String,
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

schema.statics.generateTags = async function(tags) {
    const ltags = tags.map(e => e.toLowerCase().trim()); // trim and lowerCase all strings
    const tagIDs = ltags.map(async e => {
        let tag = await this.findOne({ tag: e });
        // check if tag exists, return tag document
        if (tag)
            return tag
        // else create a new tag document
        tag = await this.create({ tag: e })
        return tag
    })
    const result = Promise.all(tagIDs) // execute all promises in the array
    return result
}

module.exports = mongoose.model("Experience", schema);
