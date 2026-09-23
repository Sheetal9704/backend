const express = require("express");
const userAuth = require("../middlewares/auth");
const {
  validateEditProfileData,
  validateNewPassword,
} = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, (req, res) => {
  try {
    res.json({ message: req.user.firstName + " profile", data: req.user });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const user = req.body;
    if (!validateEditProfileData(user)) {
      throw new Error("Invalid Edit Request!!");
    }
    const loggedInUser = req.user;
    Object.keys(user).forEach((key) => (loggedInUser[key] = user[key]));
    await loggedInUser.save({ validateBeforeSave: true });
    res.json({
      message: `${loggedInUser.firstName} your profile is updated!!`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

profileRouter.patch("/profile/forgotPassword", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { currentPassword, newPassword } = req.body;

    // validate the current password
    const isCurrentPasswordValid =
      await loggedInUser.validatePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new Error("Invalid Credentials!!");
    }

    //check if the new password is a strong password
    if (!validateNewPassword(newPassword)) {
      throw new Error("Please enter a new password!");
    }
    //encrypt the new password
    const passwordHash = await loggedInUser.getEncryptedPassword(newPassword);

    // save the new password in DB and res.send -> Password changed success.
    loggedInUser.password = passwordHash;
    await loggedInUser.save();
    res.send("Password changed successfully");
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

module.exports = profileRouter;
