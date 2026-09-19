const express = require("express");
const { authAdmin } = require("./middlewares/auth");

const app = express();

app.use("/admin", authAdmin);

app.get("/admin/getAllData", (req, res) => {
  res.send("All Data sent");
});

app.get("/admin/deleteData", (req, res) => {
  res.send("Delete Data");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
