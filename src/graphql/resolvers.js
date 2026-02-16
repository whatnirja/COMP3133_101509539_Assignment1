const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { GraphQLError } = require("graphql");

const User = require("../models/User");
const Employee = require("../models/Employee");
const cloudinary = require("../config/cloudinary");

const { runValidation } = require("../utils/graphqlErrors");
const { signupRules, loginRules } = require("../validators/userValidators");
const { addEmployeeRules, updateEmployeeRules } = require("../validators/employeeValidators");

function signToken(user) {
  return jwt.sign(
    { _id: user._id.toString(), username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );
}

module.exports = {
  Query: {
    login: async (_, { input }) => {
      await runValidation(loginRules, input);

      const { username_or_email, password } = input;

      const user = await User.findOne({
        $or: [{ username: username_or_email }, { email: username_or_email }]
      });

      if (!user) {
        throw new GraphQLError("Invalid credentials", { extensions: { code: "UNAUTHENTICATED" } });
      }

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) {
        throw new GraphQLError("Invalid credentials", { extensions: { code: "UNAUTHENTICATED" } });
      }

      const token = signToken(user);

      return { message: "Login successful", token, user };
    },

    getAllEmployees: async (_, __, ctx) => {
      if (!ctx.user) {
        throw new GraphQLError("Unauthorized", { extensions: { code: "UNAUTHENTICATED" } });
      }
      const employees = await Employee.find().sort({ created_at: -1 });
      return { message: "Employees fetched successfully", employees };
    },

    getEmployeeByEid: async (_, { eid }, ctx) => {
      if (!ctx.user) {
        throw new GraphQLError("Unauthorized", { extensions: { code: "UNAUTHENTICATED" } });
      }
      const employee = await Employee.findById(eid);
      if (!employee) {
        throw new GraphQLError("Employee not found", { extensions: { code: "NOT_FOUND" } });
      }
      return { message: "Employee fetched successfully", employee };
    },

    searchEmployees: async (_, { designation, department }, ctx) => {
      if (!ctx.user) {
        throw new GraphQLError("Unauthorized", { extensions: { code: "UNAUTHENTICATED" } });
      }

      const filter = {};
      if (designation) filter.designation = designation;
      if (department) filter.department = department;

      const employees = await Employee.find(filter).sort({ created_at: -1 });
      return { message: "Employees fetched successfully", employees };
    },

    me: async (_, __, ctx) => {
      if (!ctx.user) return null;
      return User.findById(ctx.user._id);
    }
  },

  Mutation: {
    signup: async (_, { input }) => {
      await runValidation(signupRules, input);

      const { username, email, password } = input;

      const exists = await User.findOne({ $or: [{ username }, { email }] });
      if (exists) {
        throw new GraphQLError("User already exists", { extensions: { code: "CONFLICT" } });
      }

      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ username, email, password: hashed });

      const token = signToken(user);
      return { message: "Signup successful", token, user };
    },

    addEmployee: async (_, { input }, ctx) => {
      if (!ctx.user) {
        throw new GraphQLError("Unauthorized", { extensions: { code: "UNAUTHENTICATED" } });
      }
      await runValidation(addEmployeeRules, input);

      let photoUrl = input.employee_photo;

      if (photoUrl && photoUrl.startsWith("data:image")) {
        const upload = await cloudinary.uploader.upload(photoUrl, { folder: "employees" });
        photoUrl = upload.secure_url;
      }

      const employee = await Employee.create({ ...input, employee_photo: photoUrl });
      return { message: "Employee created successfully", employee };
    },

    updateEmployeeByEid: async (_, { eid, input }, ctx) => {
      if (!ctx.user) {
        throw new GraphQLError("Unauthorized", { extensions: { code: "UNAUTHENTICATED" } });
      }
      await runValidation(updateEmployeeRules, input);

      let updates = { ...input };

      if (updates.employee_photo && updates.employee_photo.startsWith("data:image")) {
        const upload = await cloudinary.uploader.upload(updates.employee_photo, { folder: "employees" });
        updates.employee_photo = upload.secure_url;
      }

      const employee = await Employee.findByIdAndUpdate(eid, updates, { new: true });
      if (!employee) {
        throw new GraphQLError("Employee not found", { extensions: { code: "NOT_FOUND" } });
      }

      return { message: "Employee updated successfully", employee };
    },

    deleteEmployeeByEid: async (_, { eid }, ctx) => {
      if (!ctx.user) {
        throw new GraphQLError("Unauthorized", { extensions: { code: "UNAUTHENTICATED" } });
      }
      const deleted = await Employee.findByIdAndDelete(eid);
      if (!deleted) {
        throw new GraphQLError("Employee not found", { extensions: { code: "NOT_FOUND" } });
      }
      return { message: "Employee deleted successfully" };
    }
  }
};
