const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const userAuth = require("../middlewares/auth");
const {
  validateSendRequestStatus,
  validateReviewStatus,
} = require("../utils/validation");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      // fetch status fromUserId and toUserID
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // validate status
      if (!validateSendRequestStatus(status)) {
        throw new Error("Invalid Status Type!!");
      }

      // validate toUserId
      const toUser = await User.findOne({ _id: toUserId });
      if (!toUser) {
        throw new Error("Invalid Connection Request!!");
      }

      // validate existingConnection and duplicate connection
      const existingConnection = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      if (existingConnection) {
        throw new Error("Connection Already Requested!!");
      }
      // validate for self connection

      if (fromUserId.equals(toUserId)) {
        throw new Error("Invalid Connection! Connection to same user.");
      }
      // then save connection in DB
      const newConnectionRequest = ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await newConnectionRequest.save();
      res.json({ message: "Connection request successfull!!", data });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { requestId, status } = req.params;

      // validate status type - accepted/rejected
      if (!validateReviewStatus(status)) {
        return res.status(400).json({ message: "Invalid Status Type!!" });
      }

      // validate toUser = loggedIn user
      // validate request Id is of loggedin user
      // status of the connection request is interested

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection Request Not Found!!" });
      }
      connectionRequest.status = status;
      connectionRequest.save();
      return res.json({
        message: `${loggedInUser.firstName} ${status} the request`,
        data: connectionRequest,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  },
);

module.exports = requestRouter;
