const express = require("express");

const app = express();

app.use("/admin", (req, res, next) => {
  const token = "abc";
  const isAdminAuthorized = token === "abc";
  if (!isAdminAuthorized) {
    res.status(401).send("unAuthorised Admin");
  } else {
    next();
  }
});

app.get("/admin/getAllData", (req, res) => {
  res.send("All Data sent");
});

app.get("/admin/deleteData", (req, res) => {
  res.send("Delete Data");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
