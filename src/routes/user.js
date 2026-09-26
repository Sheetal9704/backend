const express = require("express");
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

userRouter.get("/user/review/requests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const data = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate({
      path: "fromUserId",
      select: "firstName lastName age gender skills photoURL about",
    });
    if (!data) {
      return res.status(404).json({
        message: "Pending Request not found!!",
      });
    }
    return res.json({ data });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate({
        path: "fromUserId",
        select: "firstName lastName age gender skills photoURL about",
      })
      .populate({
        path: "toUserId",
        select: "firstName lastName age gender skills photoURL about",
      });

    if (!connections) {
      return res.status(404).send("Connection Not found");
    }
    const data = connections?.map((con) => {
      if (con.fromUserId.equals(loggedInUser._id)) {
        return con.toUserId;
      }
      return con.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const pageNo = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit > 50 ? 50 : limit;
    const skip = (pageNo - 1) * limit;

    const loggedInUser = req.user;
    const userRequestSent = await ConnectionRequest.find({
      fromUserId: loggedInUser._id,
    }).select("toUserId ");

    const userRequestRecieved = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
    }).select("fromUserId");

    const connectedUsers = [
      ...userRequestSent.map((user) => user.toUserId),
      ...userRequestRecieved.map((user) => user.fromUserId),
      loggedInUser._id,
    ];

    const userFeeds = await User.find({
      _id: { $nin: connectedUsers },
    })
      .select("firstName lastName age gender skills photoURL about")
      .skip(skip)
      .limit(limit);

    if (!userFeeds) {
      res.send("No User Feed to display");
    }
    res.send(userFeeds);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = userRouter;
