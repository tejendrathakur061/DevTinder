const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignup } = require("../utils/validate");

const signup = async (req, res) => {
  try {
    validateSignup(req);

    const { firstName, lastName, emailId, password, age, gender } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
    });

    await user.save();
    res.send(`User created Successfully!`);
  } catch (error) {
    res.status(400).send(`SIGNUP FAILED: ${error.message}`);
  }
};

const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error(`Invalid credentials`);
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      res.send(user);
    } else {
      throw new Error(`Invalid credentials`);
    }
  } catch (error) {
    res.status(400).send(`LOGIN FAILED: ${error.message}`);
  }
};

const logout = (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.send(`User logout successful!`);
  } catch (error) {
    res.status(400).send(`LOGOUT FAILED: ${error.message}`);
  }
};

module.exports = { signup, login, logout };
