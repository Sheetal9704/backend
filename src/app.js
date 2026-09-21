const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json()); // middleware to convert JSON readable data to JS object

app.get("/userById", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body._id.$oid });
    // const user = await User.findById(req.body._id.$oid);
    if (!user) {
      res.status(404).send("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("Error while fetching the data", err);
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
    res.status(400).send("Error while fetching the data");
  }
});

app.patch("/userById", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.body._id.$oid, {
      emailId: req.body.emailId,
    });
    if (user) {
      res.send("User updated successfully!!");
    }
  } catch (err) {
    res.status(400).send("Error while fetching the data");
  }
});

app.patch("/user", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { firstName: "Sheetal" },
      { emailId: req.body.emailId },
    );
    if (user) {
      res.send("User updated successfully!!");
    }
  } catch (err) {
    res.status(400).send("Error while fetching the data");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Error while fetching the data");
  }
});

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User data saved successfully!!");
  } catch (err) {
    res.status(400).send("Error while saving the data");
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
