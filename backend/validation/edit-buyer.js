const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInputBuyer(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.contact = !isEmpty(data.contact) ? data.contact : "";
  data.age = !isEmpty(data.age) ? data.age : "";
  data.batch = !isEmpty(data.batch) ? data.batch : "";

  // Name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  // Age check
  if (isEmpty(data.age)) {
    errors.age = "Age field is required";
  } else if (data.age <= 0) {
    errors.age = "Age is invalid";
  }
  // Contact number check
  if (Validator.isEmpty(data.contact)) {
    errors.contact = "Contact field is required";
  } else if (!data.contact.match("[0-9]{10}")) {
    errors.contact = "Contact Number must contain 10 digits";
  }

  // Batch check
  if (Validator.isEmpty(data.batch)) {
    errors.batch = "Batch field is required";
  } else if (!["UG1", "UG2", "UG3", "UG4", "UG5"].includes(data.batch)) {
    errors.batch = "Invalid Batch";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
