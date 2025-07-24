const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateFoodItem(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.price = !isEmpty(data.price) ? data.price : "";

  // Name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  // Price checks
  if (Validator.isEmpty(data.price)) {
    errors.price = "Price field is required";
  } else if (!data.price.match("[0-9]+")) {
    errors.price = "Price is invalid";
  } else if (data.price <= 0) {
    errors.price = "Price is invalid";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
