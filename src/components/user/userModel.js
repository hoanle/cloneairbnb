const mongoose = require("mongoose");
const emailValidator = require("email-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
require("dotenv").config({ path: ".env" });

const userSchemas = mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must have a name"],
    trim: true,
    max: 40,
  },
  email: {
    type: String,
    required: [true, "User must have an email"],
    unique: true,
    trim: true,
    validate: {
      validator: (v) => {
        return emailValidator.validate(v);
      },
      message: "Invalid email",
    },
  },
  password: {
    type: String,
    min: 6,
    max: 40,
    trim: true,
  },
  introduction: {
    type: String,
    trim: true,
    max: 200,
  },
  country: {
    city: {
      type: String,
    },
    country: {
      type: String,
    },
  },
  verified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["host", "user"],
    default: "user",
  },
  tokens: [
    {
      type: String,
    },
  ],
  verificationToken: {
    type: String,
  },
  avatar: {
    type: {
      url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
  },
});

userSchemas.methods.generateToken = async function () {
  const user = this;
  const token = await jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "14d",
  });
  user.tokens.push(token);
  await user.save();
  return token;
};

userSchemas.methods.generateVerificationToken = async function () {
  const user = this;
  const token = await jwt.sign({ _id: this.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  user.verificationToken = token;
  await user.save();
  return token;
};

userSchemas.statics.permits = function (params) {
  const permits = ["name", "email", "password", "country", "introduction", 'avatar'];
  let results = {};
  permits
    .map((p) => {
      if (params[p]) results[p] = params[p];
    })
    .filter(Boolean);
  return results;
};

userSchemas.statics.findOrCreateOne = async function (params) {
  const email = params.email;
  let found = await User.findOne({ email });
  if (!found) {
    const per = User.permits(params);
    found = await User.create({ ...per, role: "user" });
  }
  return found;
};
userSchemas.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.__v;
  delete userObject.verificationToken;
  delete userObject.tokens;
  return userObject;
};

userSchemas.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

const User = mongoose.model("User", userSchemas);
module.exports = User;
