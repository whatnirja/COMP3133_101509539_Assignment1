const { body } = require("express-validator");

const addEmployeeRules = () => [
  body("first_name").notEmpty().withMessage("first_name required"),
  body("last_name").notEmpty().withMessage("last_name required"),
  body("email").isEmail().withMessage("invalid email"),
  body("gender").isIn(["Male", "Female", "Other"]).withMessage("gender must be Male/Female/Other"),
  body("designation").notEmpty().withMessage("designation required"),
  body("salary").isFloat({ min: 1000 }).withMessage("salary must be >= 1000"),
  body("date_of_joining").notEmpty().withMessage("date_of_joining required"),
  body("department").notEmpty().withMessage("department required")
];

const updateEmployeeRules = () => [
  body("email").optional().isEmail().withMessage("invalid email"),
  body("gender").optional().isIn(["Male", "Female", "Other"]).withMessage("gender must be Male/Female/Other"),
  body("salary").optional().isFloat({ min: 1000 }).withMessage("salary must be >= 1000")
];

module.exports = { addEmployeeRules, updateEmployeeRules };