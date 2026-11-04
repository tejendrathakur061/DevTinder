const validator = require("validator");

const validateSignup = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error(`Please enter your name`);
  }

  if (!validator.isEmail(emailId)) {
    throw new Error(`Invalid email`);
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error(`Choose a strong password`);
  }
};

const validateEditsOfUser = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "about",
    "imgURL",
    "age",
    "skills",
    "gender",
  ];

  const fields = Object.keys(req.body || {});
  return (
    fields.length > 0 &&
    fields.every((field) => allowedEditFields.includes(field))
  );
};

module.exports = {
  validateSignup,
  validateEditsOfUser,
};
