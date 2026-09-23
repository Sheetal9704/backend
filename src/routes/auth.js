const express = require("express");
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;
    const user = new User({
      firstName,
      lastName,
      emailId,
    });
    const passwordHash = await user.getEncryptedPassword(password);
    user.password = passwordHash;
    await user.save();
    res.send("User data saved successfully!!");
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("User not Found!!");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      throw new Error("Invalid Credentials");
    } else {
      const token = await user.getJWT();
      res.cookie("token", token);
      res.send("Login successfull!!");
    }
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

authRouter.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.send("Log out successfull!");
});

module.exports = authRouter;
