const express = require("express");

const app = express();

/** 

+ → one or more

* → zero or more

? → zero or one 
**/

// Matches /abc, /abbbc, etc.
app.get(/^\/ab+c$/, (req, res) => {
  res.send("demo testing");
});

app.get("/user/:userID", (req, res) => {
  console.log(req.params.userID);
  res.send("Request Params", req.params);
});

app.get("/user", (req, res) => {
  console.log(req.query);
  res.send("Request Query", req.query);
});

app.get("/user", (req, res) => {
  res.send({
    firstName: "Sheetal",
    lastName: "M",
    city: "Bengaluru",
  });
});

app.post("/user", (req, res) => {
  res.send("User data added successfully!!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
