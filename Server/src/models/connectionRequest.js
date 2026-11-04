const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "rejected", "accepted"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true },
);

connectionRequestSchema.index({
  toUserId: 1,
  fromUserId: 1,
});

connectionRequestSchema.pre("save", function () {
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error(`You cannot send request to yourself!!`);
  }
});

const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema,
);

module.exports = ConnectionRequestModel;
