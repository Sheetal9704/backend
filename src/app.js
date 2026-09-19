const express = require("express");

const app = express();

app.use(
  "/user",
  (req, res, next) => {
    console.log("Handling route 1");
    // res.send("Route Handler 1");
    next();
  },
  (req, res, next) => {
    console.log("Handling route 2");
    // res.send("Route Handler 2");
    next();
  },
  (req, res, next) => {
    console.log("Handling route 3");
    // res.send("Route Handler 3");
    next();
  },
  (req, res, next) => {
    console.log("Handling route 4");
    // res.send("Route Handler 4");
    next();
  },
  (req, res, next) => {
    console.log("Handling route 5");
    res.send("Route Handler 5");
  },
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
