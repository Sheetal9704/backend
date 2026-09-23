const validator = require("validator");

const validateEditProfileData = (user) => {
  const ALLOW_EDITS = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoURL",
    "skills",
  ];
  const isEditValidationAllowed = Object.keys(user).every((key) =>
    ALLOW_EDITS.includes(key),
  );
  return isEditValidationAllowed;
};

const validateNewPassword = (password) => {
  return validator.isStrongPassword(password);
};

const validateSendRequestStatus = (status) => {
  const ALLOWED_SEND_STATUS = ["interested", "ignored"];
  return ALLOWED_SEND_STATUS.includes(status);
};

const validateReviewStatus = (status) => {
  const ALLOW_REVIEW_STATUS = ["accepted", "rejected"];
  return ALLOW_REVIEW_STATUS.includes(status);
};

module.exports = {
  validateEditProfileData,
  validateNewPassword,
  validateSendRequestStatus,
  validateReviewStatus,
};
