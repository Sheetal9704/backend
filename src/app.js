const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const userValidation = require("./validations/user");

const app = express();

app.use(express.json()); // middleware to convert JSON readable data to JS object

app.get("/userById", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body._id });
    // const user = await User.findById(req.body._id);
    if (!user) {
      res.status(404).send("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("Fetching Data Failed:" + err.message);
  }
});

app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ emailId: req.body.emailId });
    if (!user) {
      res.status(404).send("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("Fetching Data Failed:" + err.message);
  }
});

app.patch("/userById/:userId", async (req, res) => {
  try {
    userValidation(req.body);
    const userId = req.params.userId;
    const user = await User.findByIdAndUpdate(userId, req.body, {
      runValidators: true,
    });
    if (user) {
      res.send("User updated successfully!!");
    }
  } catch (err) {
    res.status(400).send("Update Failed:" + err.message);
  }
});

app.patch("/user/:emailId", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { emailId: req.params.emailId },
      req.body,
      {
        runValidators: true,
      },
    );
    if (user) {
      res.send("User updated successfully!!");
    }
  } catch (err) {
    res.status(400).send("Update Failed:" + err.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Fetching data Failed:" + err.message);
  }
});

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User data saved successfully!!");
  } catch (err) {
    res.status(400).send("Saving Data Failed:" + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully!!");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch(() => {
    console.log("Database cannot be connected");
  });
