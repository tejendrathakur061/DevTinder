const mongoose = require("mongoose");

const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const sendConnectionRequest = async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const { toUserId, status } = req.params;

    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: `Invalid status type : ${status}`,
      });
    }

    if (!mongoose.isValidObjectId(toUserId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    const existConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { toUserId: fromUserId, fromUserId: toUserId },
      ],
    });

    if (existConnectionRequest) {
      return res.status(400).json({
        message: `Connection Request Already Exist!!`,
      });
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();
    res.json({
      message: `Connection request send successfully!`,
      data,
    });
  } catch (err) {
    res.status(500).send(`ERROR : ${err.message}`);
  }
};

const reviewConnectionRequest = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    const allowedStatus = ["rejected", "accepted"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: `Status not allowed : ${status}`,
      });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });

    if (!connectionRequest) {
      return res
        .status(404)
        .json({ message: `Connection request not found` });
    }

    connectionRequest.status = status;

    const data = await connectionRequest.save();
    res.json({ message: `Connection request : ${status}`, data });
  } catch (error) {
    res.status(400).send(`ERROR : ${error.message}`);
  }
};

module.exports = { sendConnectionRequest, reviewConnectionRequest };
