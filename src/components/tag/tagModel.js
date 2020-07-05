const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema({
  tag: {
    type: String,
    required: [true, "tag must have a name"],
    unique: true,
  },
});
TagSchema.statics.generateTags = async function (tags) {
  const ltags = tags.map((e) => e.toLowerCase().trim()); // trim and lowerCase all strings
  const tagIDs = ltags.map(async (e) => {
    let tag = await this.findOne({ tag: e });
    // check if tag exists, return tag document
    if (tag) return tag;
    // else create a new tag document
    tag = await this.create({ tag: e });
    return tag;
  });
  const result = Promise.all(tagIDs); // execute all promises in the array
  return result;
};

TagSchema.statics.findTags = async function(tags) {
  const lowerCaseTag = tags.map((x) => decodeURI(x).toLowerCase().trim());
  const tagIds = lowerCaseTag
    .map(async (t) => {
      let tag = await Tag.findOne({ tag: t });
      return tag;
    })
    .filter(Boolean);
  const results = Promise.all(tagIds);
  return results;
};

TagSchema.methods.toJSON = function () {
  const tag = this;
  const tagObject = tag.toObject();
  delete tagObject.__v;
  return tagObject;
};

const Tag = mongoose.model("Tag", TagSchema);
module.exports = Tag;
