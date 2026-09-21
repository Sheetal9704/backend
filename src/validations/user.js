const ALLOW_UPDATES = ["password", "age", "gender", "photoURL", "skills"];
const userValidation = (userData) => {
  const isValidationAllowed = Object.keys(userData).every((key) =>
    ALLOW_UPDATES.includes(key),
  );
  if (!isValidationAllowed) throw new Error("Cannot Update");
};

module.exports = userValidation;
