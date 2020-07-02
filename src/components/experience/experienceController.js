const Experience = require("./experienceModel");

exports.createExperience = async function (req, res) {
  try {
    const { title, country, price, duration, rating } = req.body;
    if (!title || !description || !tags) {
      res.status(400).json({
        status: "NOT OK!",
        message: "Title, description, host and tags are required",
      });
    }
    const tagObj = await Tag.generateTags(tags);
    const exp = new Experience({
      title,
      country,
      price,
      duration,
      rating,
      tags: tagObj,
    });
    await exp.save();
    res.status(200).json({ status: "OK", data: exp }).send(exp);
  } catch (err) {
    res.status(400).json({ status: "NOT OK!", error: err.message });
  }
};
