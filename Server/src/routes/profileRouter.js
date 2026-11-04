const express = require("express");

const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditsOfUser } = require("../utils/validate");

profileRouter.get("/profile", userAuth, (req, res) => {
  try {
    const user = req.user.toObject();
    delete user.password;
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditsOfUser(req)) {
      return res.status(400).json({ message: "Invalid edit request" });
    }
    const user = req.user;
    Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
    });
    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;
    res.json({
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

module.exports = profileRouter;
