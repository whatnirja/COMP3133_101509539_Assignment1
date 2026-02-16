const { validationResult } = require("express-validator");
const { GraphQLError } = require("graphql");

async function runValidation(rules, data) {
  const req = { body: data };

  for (const rule of rules()) {
    await rule.run(req);
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new GraphQLError("Validation failed", {
      extensions: {
        code: "BAD_USER_INPUT",
        details: errors.array().map(e => ({ field: e.path, message: e.msg }))
      }
    });
  }
}

module.exports = { runValidation };
