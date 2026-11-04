const { Schema, model } = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      index: true,
      minLength: 2,
      maxLength: 12,
    },

    lastName: {
      type: String,
    },

    emailId: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      required: true,
      min: 18,
      max: 90,
    },

    gender: {
      type: String,
      required: true,
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE} invalid gender type`,
      },

      // validate(value) {
      //   if (!["male", "female", "other"].includes(value)) {
      //     throw new Error(`Gender invalid!`);
      //   }
      // },
    },

    imgURL: {
      type: String,
      default: "https://ui-avatars.com",
      validate(value) {
        if (value && !validator.isURL(value)) {
          throw new Error(`Invalid URL`);
        }
      },
    },

    about: {
      type: String,
      default: "This is default description about the user",
    },

    skills: {
      type: [String],
    },
  },
  { timestamps: true },
);

userSchema.methods.getJWT = function () {
  const token = jwt.sign({ _id: this._id }, "Dev@Tinder1003", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = function (passwordInputByUser) {
  const passwordHash = this.password;
  return bcrypt.compare(passwordInputByUser, passwordHash);
};

const User = model("User", userSchema);

module.exports = User;
