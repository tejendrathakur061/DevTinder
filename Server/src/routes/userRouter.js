const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

const USER_SAFE_DATA = [
  "firstName",
  "lastName",
  "age",
  "about",
  "imgURL",
  "gender",
  "skills",
];

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    res.json({
      message: `Data fetched successfully`,
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).send(`ERROR : ${error.message}`);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) =>
      row.fromUserId._id.toString() === loggedInUser._id.toString()
        ? row.toUserId
        : row.fromUserId,
    );
    res.json({ data });
  } catch (error) {
    res.status(400).send(`ERROR : ${error.message}`);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    if (limit > 25) limit = 25;
    if (limit < 1) limit = 1;

    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set([loggedInUser._id.toString()]);
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.toUserId.toString());
      hideUsersFromFeed.add(req.fromUserId.toString());
    });

    const users = await User.find({
      _id: {
        $nin: [...hideUsersFromFeed],
      },
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json(users);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});
module.exports = userRouter;
