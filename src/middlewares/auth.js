const authAdmin = (req, res, next) => {
  const token = "abc";
  const isAdminAuthorized = token === "abc";
  if (!isAdminAuthorized) {
    res.status(401).send("unAuthorised Admin");
  } else {
    next();
  }
};

module.exports = { authAdmin };
