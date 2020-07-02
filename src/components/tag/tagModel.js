const mongoose = require('mongoose')

const TagSchema = new mongoose.Schema({
    tag : { 
        type: String,
        required: [true, "tag must have a name"],
        unique: true
    }
})
TagSchema.statics.generateTags = async function(tags) {
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

const Tag = mongoose.model("Tag", TagSchema)
module.exports = Tag
