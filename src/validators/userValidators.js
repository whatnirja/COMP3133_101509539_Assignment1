const { body } = require("express-validator");

const signupRules = () => [
  body("username").isLength({ min: 3 }).withMessage("username must be at least 3 chars"),
  body("email").isEmail().withMessage("invalid email"),
  body("password").isLength({ min: 6 }).withMessage("password must be at least 6 chars")
];

const loginRules = () => [
  body("username_or_email").notEmpty().withMessage("username_or_email required"),
  body("password").notEmpty().withMessage("password required")
];

module.exports = { signupRules, loginRules };