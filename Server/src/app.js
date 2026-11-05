const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: "https://devtinderdev.netlify.app",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestRouter");
const userRouter = require("./routes/userRouter");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log(`Database connected!`);
    app.listen(process.env.PORT, () => {
      console.log(
        `Server successfully running on http://localhost:${process.env.PORT}`,
      );
    });
  })
  .catch((err) => {
    console.log(`Database connection FAILED : ${err}`);
    process.exit(1);
  });
