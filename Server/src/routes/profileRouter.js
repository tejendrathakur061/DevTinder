const express = require("express");
const { userAuth } = require("../middlewares/auth");
const {
  getProfile,
  editProfile,
} = require("../controller/profileController");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, getProfile);
profileRouter.patch("/profile/edit", userAuth, editProfile);

module.exports = profileRouter;
