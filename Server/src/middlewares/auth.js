const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    console.log("checkinggggg.");
    const { token } = req.cookies;
    if (!token) {
      console.log("cookie checkinggg");
      return res.status(401).json({ message: "Please login!", success: false });
    }

    console.log("chekiggg 1111");
    const decodedData = jwt.verify(token, "Dev@Tinder1003");
    const { _id } = decodedData;
    console.log("chkigg 22222");
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    console.log("chkigg 33333");

    req.user = user;
    next();
  } catch (error) {
    console.log("cheeckiig logsssss");
    res.status(400).send(`ERROR : ${error.message}`);
  }
};

module.exports = {
  userAuth,
};
